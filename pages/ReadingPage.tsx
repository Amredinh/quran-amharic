import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useApp } from '../services/context';
import { getAyahAudioUrl } from '../services/quranService';
import { Settings as SettingsIcon, Play, Pause, Copy, MoreHorizontal, ChevronRight, Check, X } from 'lucide-react';
import Cookies from 'js-cookie';

const ReadingPage: React.FC = () => {
  const { lang, id } = useParams();
  const location = useLocation();
  const { arabicData, translations, currentTranslationId, setTranslationId } = useApp();
  const surahIndex = parseInt(id || "1");

  // Load Data
  const surahArabic = arabicData.suras.find(s => s.index === surahIndex);
  const translation = translations.find(t => t.id === (lang || currentTranslationId));
  const surahTranslation = translation?.data.suras.find(s => s.index === surahIndex);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [arabicSize, setArabicSize] = useState(28);
  const [transSize, setTransSize] = useState(16);
  const [showArabic, setShowArabic] = useState(true);
  const [showTrans, setShowTrans] = useState(true);
  const [readingMode, setReadingMode] = useState<'default' | 'paper'>('default');

  // Audio & Interaction State
  const [activeAyah, setActiveAyah] = useState<number | null>(null); // Index in array
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Modals
  const [showDetail, setShowDetail] = useState<number | null>(null); // Ayah index
  const [showCopy, setShowCopy] = useState<number | null>(null); // Ayah index

  // Initialize Audio Ref once
  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;

    const handleEnded = () => {
        // Since activeAyah comes from closure, we need to be careful. 
        // Using a functional update or checking a ref for activeAyah would be better in complex apps.
        // For simplicity, we trust the re-render cycle or manually handle 'next'.
        setIsPlaying(false);
        setActiveAyah(prev => {
            if (prev !== null && surahArabic && prev < surahArabic.ayas.length - 1) {
                // Auto play next
                setTimeout(() => playAyah(prev + 1), 100);
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
  }, [surahArabic]); // Re-bind if surah changes

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
    
    // If clicking same ayah while playing, pause it
    if (activeAyah === index && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
    }

    setActiveAyah(index);
    setIsPlaying(true);
    
    const url = getAyahAudioUrl(surahIndex, index + 1);
    audioRef.current.src = url;
    
    audioRef.current.play().catch(e => {
        console.error("Play error", e);
        setIsPlaying(false);
        alert("Audio source not available for this Ayah.");
    });

    // Scroll
    document.getElementById(`ayah-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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

  if (!surahArabic) return <div className="text-center py-20 dark:text-white">Surah Not Found in Database</div>;

  const bgClass = readingMode === 'paper' ? 'bg-[#f4ecd8] text-gray-900' : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100';

  return (
    <div className={`relative min-h-screen ${bgClass} transition-colors duration-300`}>
      
      {/* Sticky Toolbar */}
      <div className={`sticky top-16 z-30 ${readingMode === 'paper' ? 'bg-[#f4ecd8]/90' : 'bg-white/90 dark:bg-gray-800/90'} backdrop-blur-md border-b border-gray-200 dark:border-gray-700 py-3 px-4 flex justify-between items-center shadow-sm transition-colors`}>
        <div>
           <h1 className="font-bold text-lg md:text-2xl">{surahArabic.index}. {surahArabic.name}</h1>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)} 
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <SettingsIcon size={20} className="text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-32 right-4 md:right-10 z-40 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 w-80 border border-gray-100 dark:border-gray-700 animate-fade-in text-gray-800 dark:text-gray-100">
           <div className="flex justify-between mb-4">
              <h3 className="font-bold">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
           </div>
           
           <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Arabic Size</label>
                <input type="range" min="18" max="60" value={arabicSize} onChange={(e) => setArabicSize(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Translation Size</label>
                <input type="range" min="12" max="30" value={transSize} onChange={(e) => setTransSize(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm">Show Arabic</span>
                 <input type="checkbox" checked={showArabic} onChange={(e) => setShowArabic(e.target.checked)} className="accent-primary w-5 h-5" />
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm">Show Translation</span>
                 <input type="checkbox" checked={showTrans} onChange={(e) => setShowTrans(e.target.checked)} className="accent-primary w-5 h-5" />
              </div>
              <div>
                 <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">Mode</span>
                 <div className="flex space-x-2">
                    <button onClick={() => setReadingMode('default')} className={`flex-1 py-1 text-sm rounded border ${readingMode==='default' ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600'}`}>Clean</button>
                    <button onClick={() => setReadingMode('paper')} className={`flex-1 py-1 text-sm rounded border ${readingMode==='paper' ? 'bg-[#e3dcc8] text-gray-900 border-[#d3c9b0] font-bold' : 'border-gray-300 dark:border-gray-600'}`}>Paper</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        {surahArabic.ayas.map((aya, idx) => (
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
                 
                 {/* Actions */}
                 <button onClick={() => playAyah(idx)} className="text-gray-400 hover:text-primary transition">
                    {activeAyah === idx && isPlaying ? <Pause size={20} /> : <Play size={20} />}
                 </button>
                 <button onClick={() => setShowCopy(idx)} className="text-gray-400 hover:text-primary transition relative">
                    <Copy size={20} />
                    {showCopy === idx && (
                      <div className="absolute top-full left-0 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-2 z-20 w-48 border border-gray-100 dark:border-gray-700 flex flex-col mt-2">
                          <button onClick={() => handleCopy(idx, 'arabic')} className="text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200">Copy Arabic</button>
                          <button onClick={() => handleCopy(idx, 'trans')} className="text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200">Copy Translation</button>
                          <button onClick={() => handleCopy(idx, 'both')} className="text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200">Copy Both</button>
                      </div>
                    )}
                 </button>
                 <button onClick={() => setShowDetail(idx)} className="text-gray-400 hover:text-primary transition">
                    <MoreHorizontal size={20} />
                 </button>
               </div>
             </div>

             {showDetail === idx && (
               <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg relative shadow-2xl">
                     <button onClick={() => setShowDetail(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500"><X size={24} /></button>
                     <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Detail View</h3>
                     <p className="font-arabic text-right text-2xl mb-4 leading-loose text-gray-900 dark:text-white">{aya.text}</p>
                     
                     <div className="mb-4">
                       <label className="text-xs text-gray-400 uppercase">Change Language</label>
                       <select 
                        value={currentTranslationId}
                        onChange={(e) => setTranslationId(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600"
                       >
                         {translations.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                       </select>
                     </div>
                     <p className="text-lg text-gray-700 dark:text-gray-200">{surahTranslation?.ayas[idx].text}</p>
                  </div>
               </div>
             )}

             {/* Bismillah handling */}
             {aya.bismillah && (
                <div className="text-center mb-6 font-arabic text-2xl text-secondary dark:text-primary opacity-80">
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
                   {surahTranslation?.ayas[idx]?.text || "Translation not available for this verse in the mock data."}
                </p>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingPage;