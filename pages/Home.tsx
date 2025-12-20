import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../services/context';
import { SURAH_NAMES_EN, REVELATION_ORDER, BLOG_POSTS } from '../constants';
import { Search, ArrowRight, BookOpen, Headphones, ChevronDown } from 'lucide-react';
import Cookies from 'js-cookie';

const Home: React.FC = () => {
  const { arabicData, currentTranslationId } = useApp();
  const navigate = useNavigate();
  
  // Hero State
  const [surahInput, setSurahInput] = useState<number | ''>('');
  const [ayahInput, setAyahInput] = useState<number | ''>('');
  const [heroError, setHeroError] = useState('');
  
  // Index State
  const [sortOrder, setSortOrder] = useState<'regular' | 'revelation'>('regular');

  // Reminder
  const [lastRead, setLastRead] = useState<{surahId: number, name: string} | null>(null);

  useEffect(() => {
    const saved = Cookies.get('lastRead');
    if (saved) {
      setLastRead(JSON.parse(saved));
    }
  }, []);

  const handleSurahNumberChange = (val: string) => {
    const num = parseInt(val);
    if (!val) {
      setSurahInput('');
      setHeroError("");
      return;
    }

    if (num > 114 || num < 1) {
      setHeroError("Surah not found (Max 114)");
      setSurahInput(num); // Keep the number to allow correction
    } else {
      setHeroError("");
      setSurahInput(num);
    }
  };

  const handleSurahSelectChange = (val: string) => {
    const num = parseInt(val);
    setSurahInput(num);
    setHeroError("");
  };

  const handleOpen = () => {
    if (!surahInput || surahInput > 114 || surahInput < 1) return;
    
    // Check Ayah count
    const surah = arabicData.suras.find(s => s.index === surahInput);
    if (!surah && surahInput <= 114) {
       // Mock data fallback
       navigate(`/${currentTranslationId}/${surahInput}${ayahInput ? `?aya=${ayahInput}` : ''}`);
       return;
    }
    
    if (surah && ayahInput) {
       if (Number(ayahInput) > surah.ayas.length) {
         setHeroError(`Surah ${surah.name} only has ${surah.ayas.length} ayahs.`);
         return;
       }
    }
    
    navigate(`/${currentTranslationId}/${surahInput}${ayahInput ? `?aya=${ayahInput}` : ''}`);
  };

  const getRecommendedSurah = () => {
    const day = new Date().getDay(); // 5 is Friday
    if (day === 5) return { id: 18, name: 'Al-Kahf' }; // Friday
    return { id: 67, name: 'Al-Mulk' }; // Random daily recommendation
  };
  const recommended = getRecommendedSurah();

  const displayedSurahs = sortOrder === 'regular' 
    ? SURAH_NAMES_EN.map((name, i) => ({ id: i + 1, name }))
    : REVELATION_ORDER.map(id => ({ id, name: SURAH_NAMES_EN[id - 1] }));

  return (
    <div className="space-y-12">
      {/* Reminder / Start Section */}
      <section>
        {lastRead ? (
          <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-6 rounded-r-xl flex justify-between items-center shadow-sm animate-fade-in">
            <div>
              <h3 className="text-amber-800 dark:text-amber-400 font-bold text-lg">Continue Reading</h3>
              <p className="text-amber-700 dark:text-amber-300">You were reading Surah {lastRead.name}</p>
            </div>
            <Link to={`/${currentTranslationId}/${lastRead.surahId}`} className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition shadow-md">
              Continue
            </Link>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-xl flex justify-between items-center shadow-sm animate-fade-in">
            <div>
              <h3 className="text-blue-800 dark:text-blue-400 font-bold text-lg">Welcome to Quran.et</h3>
              <p className="text-blue-700 dark:text-blue-300">Start your journey with The Opening.</p>
            </div>
            <Link to={`/${currentTranslationId}/1`} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition shadow-md">
              Start Reading (Al-Fatiha)
            </Link>
          </div>
        )}
      </section>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8 md:p-12 relative transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 dark:bg-green-900/20 rounded-full -mr-16 -mt-16 z-0 opacity-50"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary dark:text-primary">Explore the Quran</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Read, Listen, and Reflect in Amharic and other Ethiopian languages.</p>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow-inner grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-stretch">
            
            {/* Surah Dropdown */}
            <div className="md:col-span-5 relative bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
               <select 
                 className="w-full h-full px-4 py-3 rounded-lg outline-none appearance-none bg-transparent text-gray-800 dark:text-white cursor-pointer"
                 value={surahInput}
                 onChange={(e) => handleSurahSelectChange(e.target.value)}
               >
                 <option value="" disabled>Select Surah</option>
                 {SURAH_NAMES_EN.map((name, idx) => (
                   <option key={idx} value={idx + 1}>{idx + 1}. {name}</option>
                 ))}
               </select>
               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Surah Number Input */}
            <div className="md:col-span-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 flex items-center px-4">
              <span className="text-gray-400 dark:text-gray-300 mr-2 text-sm">#</span>
              <input 
                type="number" 
                placeholder="No." 
                className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
                value={surahInput}
                onChange={(e) => handleSurahNumberChange(e.target.value)}
              />
            </div>

            {/* Ayah Input */}
            <div className="md:col-span-2 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 flex items-center px-4">
               <span className="text-gray-400 dark:text-gray-300 mr-2 text-sm">Aya</span>
               <input 
                type="number" 
                placeholder="No." 
                className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
                value={ayahInput}
                onChange={(e) => setAyahInput(parseInt(e.target.value) || '')}
              />
            </div>

            {/* Button */}
            <button 
              onClick={handleOpen}
              disabled={!surahInput || (typeof surahInput === 'number' && surahInput > 114)}
              className="md:col-span-2 bg-primary text-white py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 font-bold shadow-md flex justify-center items-center"
            >
              Open
            </button>
          </div>
          {heroError && <p className="text-red-500 dark:text-red-400 text-sm font-semibold">{heroError}</p>}
        </div>
      </section>

      {/* Today's Recommendation & Blog */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-secondary to-green-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Today's Recommended Surah</h2>
            <div className="text-4xl font-arabic mb-6">{recommended.name}</div>
            <div className="flex space-x-4">
                <Link to={`/${currentTranslationId}/${recommended.id}`} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-lg transition backdrop-blur-sm">
                <BookOpen size={20} /> <span>Read</span>
                </Link>
                <Link to="/audio" className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-lg transition backdrop-blur-sm">
                <Headphones size={20} /> <span>Listen</span>
                </Link>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 text-white/5">
             <BookOpen size={200} />
          </div>
        </div>
        
        {/* Latest Blog Preview */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col justify-between transition-colors">
           <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Latest from Blog</h2>
                <Link to="/blog" className="text-primary hover:underline flex items-center text-sm">View All <ArrowRight size={16} className="ml-1" /></Link>
            </div>
            {BLOG_POSTS.slice(0, 1).map(post => (
                <div key={post.id} className="group cursor-pointer" onClick={() => navigate(`/blog/${post.id}`)}>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-primary transition">{post.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mt-2">{post.excerpt}</p>
                </div>
            ))}
           </div>
           <button onClick={() => navigate(`/blog/${BLOG_POSTS[0].id}`)} className="text-primary font-bold hover:underline self-start mt-4">Read Article</button>
        </div>
      </section>

      {/* Surah Index */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Surahs</h2>
          <div className="flex space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
             <button 
                onClick={() => setSortOrder('regular')}
                className={`px-4 py-1 rounded-md text-sm transition ${sortOrder === 'regular' ? 'bg-white dark:bg-gray-600 shadow text-primary font-bold' : 'text-gray-600 dark:text-gray-300'}`}
             >
               Regular
             </button>
             <button 
                onClick={() => setSortOrder('revelation')}
                className={`px-4 py-1 rounded-md text-sm transition ${sortOrder === 'revelation' ? 'bg-white dark:bg-gray-600 shadow text-primary font-bold' : 'text-gray-600 dark:text-gray-300'}`}
             >
               Revelation
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedSurahs.map((surah) => (
            <Link 
              key={surah.id} 
              to={`/${currentTranslationId}/${surah.id}`}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-primary border border-transparent transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 text-primary rounded-full flex items-center justify-center font-bold text-sm group-hover:bg-primary group-hover:text-white transition">
                  {surah.id}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100">{surah.name}</h4>
                  <span className="text-xs text-gray-400">Meccan/Medinan</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;