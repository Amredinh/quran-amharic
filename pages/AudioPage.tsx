import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../services/context';
import { RECITERS, SURAH_NAMES_EN } from '../constants';
import { getFullSurahAudioUrl } from '../services/quranService';
import { Play, Search, User } from 'lucide-react';

const AudioPage: React.FC = () => {
  const { playSurahAudio } = useApp();
  const location = useLocation();
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [filter, setFilter] = useState('');

  // Handle auto-play from Navigation State
  useEffect(() => {
    if (location.state && (location.state as any).autoPlayId) {
      const state = location.state as any;
      setTimeout(() => {
        handlePlay(state.autoPlayId, state.surahName);
      }, 500);
    }
  }, [location.state]);

  const handlePlay = (surahIndex: number, surahName: string) => {
     const url = getFullSurahAudioUrl(selectedReciter.subfolder, surahIndex);
     playSurahAudio(url, surahName, selectedReciter.name, surahIndex, selectedReciter.subfolder);
  };

  const filteredSurahs = SURAH_NAMES_EN
    .map((name, i) => ({ id: i + 1, name }))
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.id.toString() === filter);

  return (
    <div className="space-y-10 pb-32 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors">
         <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl">
                <Play className="text-primary" fill="currentColor" size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-secondary dark:text-white">Audio Library</h1>
         </div>
         
         <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-widest">Select Qari</label>
               <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                 <select 
                   className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-bold transition-all appearance-none cursor-pointer"
                   value={selectedReciter.name}
                   onChange={(e) => {
                      const r = RECITERS.find(rec => rec.name === e.target.value);
                      if (r) setSelectedReciter(r);
                   }}
                 >
                   {RECITERS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                 </select>
               </div>
            </div>
            
            <div className="space-y-2">
               <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-widest">Quick Search</label>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="Surah name or number..." 
                   className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                   value={filter}
                   onChange={(e) => setFilter(e.target.value)}
                 />
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:gap-px bg-gray-100 dark:bg-gray-700">
            {filteredSurahs.map((surah) => (
               <div key={surah.id} className="bg-white dark:bg-gray-800 p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
                  <div className="flex items-center space-x-4">
                     <span className="text-gray-300 dark:text-gray-600 font-black text-xl w-10">{surah.id}</span>
                     <span className="font-extrabold text-gray-800 dark:text-gray-100 text-lg">{surah.name}</span>
                  </div>
                  <button 
                    onClick={() => handlePlay(surah.id, surah.name)}
                    className="p-3 bg-primary/5 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition shadow-sm"
                  >
                     <Play size={22} fill="currentColor" className="ml-0.5" />
                  </button>
               </div>
            ))}
         </div>
         {filteredSurahs.length === 0 && (
            <div className="p-16 text-center text-gray-400 font-bold">No results found.</div>
         )}
      </div>
    </div>
  );
};

export default AudioPage;