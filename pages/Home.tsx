import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../services/context';
import { SURAH_NAMES_EN, REVELATION_ORDER, BLOG_POSTS } from '../constants';
import { Search, ArrowRight, BookOpen, Headphones, ChevronDown, Globe } from 'lucide-react';
import Cookies from 'js-cookie';

const Home: React.FC = () => {
  const { arabicData, currentTranslationId, setTranslationId, translations } = useApp();
  const navigate = useNavigate();
  
  // Hero State
  const [surahInput, setSurahInput] = useState<number | ''>('');
  const [ayahInput, setAyahInput] = useState<number | ''>('');
  const [heroError, setHeroError] = useState('');
  
  // Index State
  const [sortOrder, setSortOrder] = useState<'regular' | 'revelation'>('regular');
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
      setHeroError("Surah 1-114");
      setSurahInput(num);
    } else {
      setHeroError("");
      setSurahInput(num);
    }
  };

  const handleOpen = () => {
    if (!surahInput || surahInput > 114 || surahInput < 1) return;
    navigate(`/${currentTranslationId}/${surahInput}${ayahInput ? `?aya=${ayahInput}` : ''}`);
  };

  const getRecommendedSurah = () => {
    const day = new Date().getDay();
    if (day === 5) return { id: 18, name: 'Al-Kahf' };
    return { id: 1, name: 'Al-Fatiha' };
  };
  const recommended = getRecommendedSurah();

  const handleListenRecommended = () => {
    // Navigate with state to trigger auto-play
    navigate('/audio', { state: { autoPlayId: recommended.id, surahName: recommended.name } });
  };

  const displayedSurahs = sortOrder === 'regular' 
    ? SURAH_NAMES_EN.map((name, i) => ({ id: i + 1, name }))
    : REVELATION_ORDER.map(id => ({ id, name: SURAH_NAMES_EN[id - 1] }));

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Reminder Section */}
      <section>
        {lastRead ? (
          <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-6 rounded-r-2xl flex justify-between items-center shadow-lg shadow-amber-500/5 transition-colors">
            <div>
              <h3 className="text-amber-800 dark:text-amber-400 font-bold text-lg">Continue Reading</h3>
              <p className="text-amber-700 dark:text-amber-300">You were reading Surah {lastRead.name}</p>
            </div>
            <Link to={`/${currentTranslationId}/${lastRead.surahId}`} className="bg-amber-500 text-white px-6 py-2.5 rounded-xl hover:bg-amber-600 transition shadow-md font-bold">
              Continue
            </Link>
          </div>
        ) : (
          <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-6 rounded-r-2xl flex justify-between items-center shadow-lg transition-colors">
            <div>
              <h3 className="text-primary font-bold text-lg">New Reader?</h3>
              <p className="text-gray-600 dark:text-gray-300">Start with Al-Fatiha (The Opening).</p>
            </div>
            <Link to={`/${currentTranslationId}/1`} className="bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-green-600 transition shadow-md font-bold">
              Start Now
            </Link>
          </div>
        )}
      </section>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-16 relative border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-20 -mt-20 z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="flex flex-col items-center">
            <img src="logo.webp" alt="Logo" className="w-24 h-24 mb-6 drop-shadow-xl" />
            <h1 className="text-4xl md:text-6xl font-extrabold text-secondary dark:text-white tracking-tight leading-tight">
              Explore the <span className="text-primary">Quran</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-4">
              Your comprehensive Ethiopian portal for Quranic studies, translations, and reflection.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 md:p-5 rounded-[2rem] shadow-inner grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
            
            <div className="md:col-span-4 relative bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
               <select 
                 className="w-full h-full px-4 py-3.5 rounded-2xl outline-none appearance-none bg-transparent text-gray-800 dark:text-white cursor-pointer font-medium"
                 value={surahInput}
                 onChange={(e) => {
                    setSurahInput(parseInt(e.target.value));
                    setHeroError("");
                 }}
               >
                 <option value="" disabled className="bg-white dark:bg-gray-800">Select Surah</option>
                 {SURAH_NAMES_EN.map((name, idx) => (
                   <option key={idx} value={idx + 1} className="bg-white dark:bg-gray-800">{idx + 1}. {name}</option>
                 ))}
               </select>
               <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            <div className="md:col-span-2 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 flex items-center px-4">
              <span className="text-gray-400 mr-2 text-sm font-bold">#</span>
              <input 
                type="number" 
                placeholder="No." 
                className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 font-bold"
                value={surahInput}
                onChange={(e) => handleSurahNumberChange(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 flex items-center px-4">
               <span className="text-gray-400 mr-2 text-sm font-bold">Aya</span>
               <input 
                type="number" 
                placeholder="All" 
                className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 font-bold"
                value={ayahInput}
                onChange={(e) => setAyahInput(parseInt(e.target.value) || '')}
              />
            </div>

            <div className="md:col-span-2 relative bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
               <select 
                 className="w-full h-full px-4 py-3.5 rounded-2xl outline-none appearance-none bg-transparent text-gray-800 dark:text-white cursor-pointer font-bold"
                 value={currentTranslationId}
                 onChange={(e) => setTranslationId(e.target.value)}
               >
                 {translations.map(t => (
                   <option key={t.id} value={t.id} className="bg-white dark:bg-gray-800">{t.name}</option>
                 ))}
               </select>
               <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            <button 
              onClick={handleOpen}
              disabled={!surahInput || (typeof surahInput === 'number' && surahInput > 114)}
              className="md:col-span-2 bg-primary text-white py-3.5 rounded-2xl hover:bg-green-600 transition disabled:opacity-50 font-extrabold shadow-lg shadow-green-500/20 flex justify-center items-center"
            >
              Open
            </button>
          </div>
          {heroError && <p className="text-red-500 dark:text-red-400 text-sm font-bold bg-red-50 dark:bg-red-900/10 inline-block px-4 py-1 rounded-full">{heroError}</p>}
        </div>
      </section>

      {/* Recommended & Listen Logic */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-secondary to-green-800 text-white p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">Daily Recommendation</span>
            <h2 className="text-3xl font-bold mb-4">Surah {recommended.name}</h2>
            <p className="text-white/70 mb-8 max-w-sm leading-relaxed">Start your day with spiritual clarity through this beautiful recitation.</p>
            <div className="flex space-x-4">
                <Link to={`/${currentTranslationId}/${recommended.id}`} className="flex items-center space-x-2 bg-white text-secondary hover:bg-white/90 px-6 py-3 rounded-xl font-bold transition shadow-xl">
                <BookOpen size={20} /> <span>Read Now</span>
                </Link>
                <button onClick={handleListenRecommended} className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition backdrop-blur-md border border-white/20">
                <Headphones size={20} /> <span>Listen</span>
                </button>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 text-white/5 transition group-hover:scale-110 duration-700">
             <BookOpen size={300} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between transition-colors">
           <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Insights</h2>
                <Link to="/blog" className="text-primary hover:text-green-600 flex items-center text-sm font-bold">Archives <ArrowRight size={16} className="ml-1" /></Link>
            </div>
            {BLOG_POSTS.slice(0, 1).map(post => (
                <div key={post.id} className="group cursor-pointer" onClick={() => navigate(`/blog/${post.id}`)}>
                <h3 className="font-bold text-2xl text-gray-800 dark:text-gray-100 group-hover:text-primary transition leading-tight">{post.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-base line-clamp-3 mt-4 leading-relaxed">{post.excerpt}</p>
                </div>
            ))}
           </div>
           <button onClick={() => navigate(`/blog/${BLOG_POSTS[0].id}`)} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition self-start mt-6">Continue Reading</button>
        </div>
      </section>

      {/* Surah Grid */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">All Surahs</h2>
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
             <button 
                onClick={() => setSortOrder('regular')}
                className={`px-6 py-2 rounded-lg text-sm transition font-bold ${sortOrder === 'regular' ? 'bg-white dark:bg-gray-700 shadow-md text-primary' : 'text-gray-500 hover:text-primary'}`}
             >
               Order
             </button>
             <button 
                onClick={() => setSortOrder('revelation')}
                className={`px-6 py-2 rounded-lg text-sm transition font-bold ${sortOrder === 'revelation' ? 'bg-white dark:bg-gray-700 shadow-md text-primary' : 'text-gray-500 hover:text-primary'}`}
             >
               Revelation
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedSurahs.map((surah) => (
            <Link 
              key={surah.id} 
              to={`/${currentTranslationId}/${surah.id}`}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary border border-transparent transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-base group-hover:bg-primary group-hover:text-white transition shadow-sm">
                  {surah.id}
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-800 dark:text-gray-100">{surah.name}</h4>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-tighter">Read Translation</span>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-200 dark:text-gray-700 group-hover:text-primary group-hover:translate-x-1 transition" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;