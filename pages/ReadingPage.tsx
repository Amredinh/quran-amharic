import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useApp } from '../services/context';
import { getAyahAudioUrl } from '../services/quranService';
import { Settings as SettingsIcon, Play, Pause, Copy, MoreHorizontal, ChevronRight, Check, X, Heart } from 'lucide-react';
import Cookies from 'js-cookie';

const ReadingPage: React.FC = () => {
  const { lang, id } = useParams();
  const location = useLocation();
  const { arabicData, translations, currentTranslationId, setTranslationId, reciters, favorites, addFavorite, removeFavorite, isFavorite } = useApp();
  const surahIndex = parseInt(id || "1");

  // Load Data
  const surahArabic = arabicData.suras.find(s => s.index === surahIndex);
  // Priority: URL Param > Current Session Context
  const activeLangId = lang || currentTranslationId;
  const translation = translations.find(t => t.id === activeLangId);
  const surahTranslation = translation?.data.suras.find(s => s.index === surahIndex);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [arabicSize, setArabicSize] = useState(28);
  const [transSize, setTransSize] = useState(16);
  const [showArabic, setShowArabic] = useState(true);
  const [showTrans, setShowTrans] = useState(true);
  const [readingMode, setReadingMode] = useState<'default' | 'paper'>('default');

  // Reciter State (Default to AbdulSamad but load custom EveryAyah reciters dynamically)
  const [selectedReciter, setSelectedReciter] = useState(() => 
    localStorage.getItem('everyayah_reciter') || 'AbdulSamad_64kbps_QuranExplorer.Com'
  );

  // Play Mode State (Continuous vs One Ayah)
  const [playMode, setPlayMode] = useState<'continuous' | 'single'>(() => 
    (localStorage.getItem('reading_play_mode') as 'continuous' | 'single') || 'continuous'
  );

  const playModeRef = useRef<'continuous' | 'single'>('continuous');

  // Keep refs in sync
  useEffect(() => {
    playModeRef.current = playMode;
    localStorage.setItem('reading_play_mode', playMode);
  }, [playMode]);

  // Filter reciters that support word/ayah playing
  const ayahLevels = reciters.filter(r => r.isEveryAyah);

  // Audio & Interaction State
  const [activeAyah, setActiveAyah] = useState<number | null>(null); // Index in array
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Modals
  const [showDetail, setShowDetail] = useState<number | null>(null); // Ayah index
  const [showCopy, setShowCopy] = useState<number | null>(null); // Ayah index

  // SCROLL TO TOP ON MOUNT
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const playAyahRef = useRef<(index: number) => void>(() => {});

  // Initialize Audio Ref once
  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;

    const handleEnded = () => {
        setIsPlaying(false);
        if (playModeRef.current === 'single') {
            return;
        }
        setActiveAyah(prev => {
            if (prev !== null && surahArabic && prev < surahArabic.ayas.length - 1) {
                // Auto play next
                setTimeout(() => playAyahRef.current(prev + 1), 100);
                return prev + 1;
            }
            return null;
        });
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
    };
  }, [surahArabic]);

  // Handle URL Query for specific ayah highlighting
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ayaParam = params.get('aya');
    if (ayaParam && surahArabic) {
        const idx = parseInt(ayaParam) - 1;
        if(idx >= 0 && idx < surahArabic.ayas.length) {
             setTimeout(() => {
                const el = document.getElementById(`ayah-${idx}`);
                if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setActiveAyah(idx); // Highlight it
             }, 500);
        }
    }
  }, [location.search, surahArabic]);

  // Save Last Read
  useEffect(() => {
     if (surahArabic) {
        Cookies.set('lastRead', JSON.stringify({ surahId: surahArabic.index, name: surahArabic.name }), { expires: 365 });
     }
  }, [surahArabic]);


  const playAyah = (index: number) => {
    if (!audioRef.current) return;
    
    if (activeAyah === index && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
    }

    setActiveAyah(index);
    setIsPlaying(true);
    
    // Inject custom reciter
    const url = getAyahAudioUrl(surahIndex, index + 1, selectedReciter);
    audioRef.current.src = url;
    
    audioRef.current.play().catch(e => {
        console.error("Play error", e);
        setIsPlaying(false);
    });

    document.getElementById(`ayah-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    playAyahRef.current = playAyah;
  }); // Keep latest playAyah updated on every render

  const handleCopy = (index: number, type: 'arabic' | 'trans' | 'both') => {
      const arabic = surahArabic?.ayas[index].text;
      const trans = surahTranslation?.ayas[index].text;
      let text = "";
      if (type === 'arabic') text = arabic || "";
      if (type === 'trans') text = trans || "";
      if (type === 'both') text = `${arabic}\n\n${trans}`;
      
      navigator.clipboard.writeText(text);
      setShowCopy(null);
  };

  const handleReciterChange = (subfolder: string) => {
    setSelectedReciter(subfolder);
    localStorage.setItem('everyayah_reciter', subfolder);
  };

  // Bookmark toggler for Surah
  const suraFavKey = `sura-${surahIndex}`;
  const suraIsFav = isFavorite(suraFavKey);
  const toggleSuraFavorite = () => {
    if (suraIsFav) {
      removeFavorite(suraFavKey);
    } else {
      addFavorite({
        type: 'surah',
        suraId: surahIndex,
        suraName: surahArabic?.name || `Surah ${surahIndex}`
      });
    }
  };

  // Bookmark toggler for Ayah
  const toggleAyahFavorite = (idx: number, ayaNo: number) => {
    const key = `ayah-${surahIndex}-${idx}`;
    if (isFavorite(key)) {
      removeFavorite(key);
    } else {
      addFavorite({
        type: 'ayah',
        suraId: surahIndex,
        suraName: `${surahArabic?.name} [Aya ${ayaNo}]`,
        ayahIndex: idx,
        ayahNo: ayaNo,
        textTrans: surahTranslation?.ayas[idx]?.text || ""
      });
    }
  };

  if (!surahArabic) return <div className="text-center py-20 dark:text-white">Surah Not Found in Database</div>;

  const bgClass = readingMode === 'paper' ? 'bg-[#f4ecd8] text-gray-900' : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100';

  return (
    <div className={`relative min-h-screen ${bgClass} transition-colors duration-300`}>
      
      {/* Sticky Toolbar */}
      <div className={`sticky top-16 z-30 ${readingMode === 'paper' ? 'bg-[#f4ecd8]/90' : 'bg-white/90 dark:bg-gray-800/90'} backdrop-blur-md border-b border-gray-200 dark:border-gray-700 py-3 px-4 flex justify-between items-center shadow-sm transition-colors`}>
        <div className="flex items-center space-x-3">
           <h1 className="font-bold text-lg md:text-2xl">{surahArabic.index}. {surahArabic.name}</h1>
           <button 
             onClick={toggleSuraFavorite} 
             className={`p-1.5 rounded-lg border transition ${suraIsFav ? 'bg-red-50 text-red-500 border-red-200 dark:bg-red-950/20' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 border-transparent'}`}
             title="Favorite Surah"
           >
              <Heart size={18} fill={suraIsFav ? "currentColor" : "none"} />
           </button>
        </div>
        
        {/* Reciters Choice Dropdown Header (Request Part 1) */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="hidden sm:flex items-center space-x-1 border border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-gray-800 p-1 px-2 rounded-xl text-xs font-semibold shadow-xs">
            <span className="text-gray-500 dark:text-gray-400">ድምፅ አቅራቢ | Qari:</span>
            <select 
              value={selectedReciter} 
              onChange={(e) => handleReciterChange(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-primary max-w-[130px] md:max-w-[150px] cursor-pointer"
            >
              <option value="AbdulSamad_64kbps_QuranExplorer.Com">Abdul Basit (Default)</option>
              {ayahLevels.map(r => (
                <option key={r.subfolder} value={r.subfolder}>{r.name.replace(" (Every Ayah)", "")}</option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center space-x-1 border border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-gray-800 p-1 px-2 rounded-xl text-xs font-semibold shadow-xs">
            <span className="text-gray-500 dark:text-gray-400">ሁነታ | Mode:</span>
            <select 
              value={playMode} 
              onChange={(e) => setPlayMode(e.target.value as 'continuous' | 'single')}
              className="bg-transparent border-none outline-none font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer"
            >
              <option value="continuous">ተከታታይ (Continuous)</option>
              <option value="single">አንድ አያህ (One Ayah)</option>
            </select>
          </div>

          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <SettingsIcon size={18} className="text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>

      {/* Reciters selection block for mobile users */}
      <div className="block sm:hidden p-3 bg-slate-50 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-850 px-4 text-xs space-y-2.5">
          <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-wider">
             <span>ድምፅ አቅራቢ (Qari)</span>
             <select 
              value={selectedReciter} 
              onChange={(e) => handleReciterChange(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-primary cursor-pointer text-sm"
             >
              <option value="AbdulSamad_64kbps_QuranExplorer.Com">Abdul Basit (Default)</option>
              {ayahLevels.map(r => (
                <option key={r.subfolder} value={r.subfolder}>{r.name.replace(" (Every Ayah)", "")}</option>
              ))}
             </select>
          </div>
          <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-wider pt-2 border-t border-slate-100 dark:border-slate-900">
             <span>የአጫዋች ሁነታ (Play Mode)</span>
             <select 
              value={playMode} 
              onChange={(e) => setPlayMode(e.target.value as 'continuous' | 'single')}
              className="bg-transparent border-none outline-none font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer text-sm"
             >
              <option value="continuous">ተከታታይ (Continuous)</option>
              <option value="single">አንድ አያህ (One Ayah)</option>
             </select>
          </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-32 right-4 md:right-10 z-40 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 w-80 border border-gray-100 dark:border-gray-700 animate-fade-in text-gray-800 dark:text-gray-100">
           <div className="flex justify-between mb-4">
              <h3 className="font-bold">Display Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
           </div>
           
           <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Arabic Font Size</label>
                <input type="range" min="18" max="60" value={arabicSize} onChange={(e) => setArabicSize(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Translation Font Size</label>
                <input type="range" min="12" max="30" value={transSize} onChange={(e) => setTransSize(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm">Arabic Visibility</span>
                 <input type="checkbox" checked={showArabic} onChange={(e) => setShowArabic(e.target.checked)} className="accent-primary w-5 h-5" />
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm">Translation Visibility</span>
                 <input type="checkbox" checked={showTrans} onChange={(e) => setShowTrans(e.target.checked)} className="accent-primary w-5 h-5" />
              </div>
              <div>
                 <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">Paper Texture Mode</span>
                 <div className="flex space-x-2">
                    <button onClick={() => setReadingMode('default')} className={`flex-1 py-1 text-sm rounded border ${readingMode==='default' ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600'}`}>Modern</button>
                    <button onClick={() => setReadingMode('paper')} className={`flex-1 py-1 text-sm rounded border ${readingMode==='paper' ? 'bg-[#e3dcc8] text-gray-900 border-[#d3c9b0] font-bold' : 'border-gray-300 dark:border-gray-600'}`}>Classic</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        {surahArabic.ayas.map((aya, idx) => {
          const ayahFavKey = `ayah-${surahIndex}-${idx}`;
          const isAyahFav = isFavorite(ayahFavKey);

          return (
            <div 
              key={idx} 
              id={`ayah-${idx}`}
              className={`mb-8 p-4 rounded-xl transition duration-500 border-b border-gray-100 dark:border-gray-800 ${activeAyah === idx ? (readingMode === 'paper' ? 'bg-black/5' : 'bg-green-50 dark:bg-green-900/20 shadow-sm scale-[1.01]') : ''}`}
            >
               <div className="flex justify-between items-start mb-4">
                 <div className="flex space-x-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${readingMode === 'paper' ? 'bg-[#e3dcc8] text-gray-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                      {aya.index}
                   </div>
                   
                   <button onClick={() => playAyah(idx)} className="text-gray-400 hover:text-primary transition" title="Play verse">
                      {activeAyah === idx && isPlaying ? <Pause size={20} /> : <Play size={20} />}
                   </button>
                   <button onClick={() => setShowCopy(idx)} className="text-gray-400 hover:text-primary transition relative" title="Copy text">
                      <Copy size={20} />
                      {showCopy === idx && (
                        <div className="absolute top-full left-0 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-2 z-20 w-48 border border-gray-100 dark:border-gray-700 flex flex-col mt-2">
                            <button onClick={() => handleCopy(idx, 'arabic')} className="text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200">Copy Arabic</button>
                            <button onClick={() => handleCopy(idx, 'trans')} className="text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200">Copy Translation</button>
                            <button onClick={() => handleCopy(idx, 'both')} className="text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200">Copy Both</button>
                        </div>
                      )}
                   </button>
                   <button 
                     onClick={() => toggleAyahFavorite(idx, aya.index)} 
                     className={`transition ${isAyahFav ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                     title={isAyahFav ? "Unbookmark" : "Bookmark Verse"}
                   >
                     <Heart size={20} fill={isAyahFav ? "currentColor" : "none"} />
                   </button>
                   <button onClick={() => setShowDetail(idx)} className="text-gray-400 hover:text-primary transition" title="Verse detail">
                      <MoreHorizontal size={20} />
                   </button>
                 </div>
               </div>

               {showDetail === idx && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg relative shadow-2xl animate-fade-in">
                       <button onClick={() => setShowDetail(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500"><X size={24} /></button>
                       <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Verse Detail</h3>
                       <p className="font-arabic text-right text-2xl mb-4 leading-loose text-gray-900 dark:text-white">{aya.text}</p>
                       
                       <div className="mb-4">
                         <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Quick Language Switch</label>
                         <select 
                          value={activeLangId}
                          onChange={(e) => setTranslationId(e.target.value)}
                          className="w-full mt-1 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600"
                         >
                           {translations.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                         </select>
                       </div>
                       <p className="text-lg text-gray-700 dark:text-gray-200">{surahTranslation?.ayas[idx]?.text || "Translation not loaded for this version."}</p>
                    </div>
                 </div>
               )}

               {aya.bismillah && (
                  <div className="text-center mb-6 font-arabic text-2xl text-secondary dark:text-primary opacity-80 animate-fade-in">
                     {aya.bismillah}
                  </div>
               )}

               {showArabic && (
                 <p 
                  className={`text-right font-arabic leading-[2.5] mb-4 ${readingMode === 'paper' ? 'text-gray-900' : 'text-gray-900 dark:text-white'}`}
                  style={{ fontSize: `${arabicSize}px` }}
                 >
                   {aya.text}
                 </p>
               )}

               {showTrans && (
                  <p 
                    className={`text-left leading-relaxed ${readingMode === 'paper' ? 'text-gray-800' : 'text-gray-700 dark:text-gray-300'}`}
                    style={{ fontSize: `${transSize}px` }}
                  >
                     {surahTranslation?.ayas[idx]?.text || "This verse translation is not yet in our database."}
                  </p>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingPage;