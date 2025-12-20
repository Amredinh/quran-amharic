import React, { useState } from 'react';
import { useApp } from '../services/context';
import { RECITERS, SURAH_NAMES_EN } from '../constants';
import { getFullSurahAudioUrl } from '../services/quranService';
import { Play, Search } from 'lucide-react';

const AudioPage: React.FC = () => {
  const { playSurahAudio } = useApp();
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [filter, setFilter] = useState('');

  const handlePlay = (surahIndex: number, surahName: string) => {
     const url = getFullSurahAudioUrl(selectedReciter.subfolder, surahIndex);
     // Trigger global player
     playSurahAudio(url, surahName, selectedReciter.name);
  };

  const filteredSurahs = SURAH_NAMES_EN
    .map((name, i) => ({ id: i + 1, name }))
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.id.toString() === filter);

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
         <h1 className="text-3xl font-bold mb-6 text-secondary dark:text-primary">Quran Audio</h1>
         
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Reciter (Qari)</label>
               <select 
                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                 value={selectedReciter.name}
                 onChange={(e) => {
                    const r = RECITERS.find(rec => rec.name === e.target.value);
                    if (r) setSelectedReciter(r);
                 }}
               >
                 {RECITERS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
               </select>
            </div>
            
            <div className="flex-1">
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Search Surah</label>
               <div className="relative">
                 <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="Surah name or number..." 
                   className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary outline-none"
                   value={filter}
                   onChange={(e) => setFilter(e.target.value)}
                 />
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:gap-px bg-gray-200 dark:bg-gray-700">
            {filteredSurahs.map((surah) => (
               <div key={surah.id} className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                  <div className="flex items-center space-x-4">
                     <span className="text-gray-400 dark:text-gray-500 font-mono w-8">{surah.id}</span>
                     <span className="font-semibold text-gray-800 dark:text-gray-100">{surah.name}</span>
                  </div>
                  <button 
                    onClick={() => handlePlay(surah.id, surah.name)}
                    className="p-2 bg-green-50 dark:bg-green-900/30 text-primary rounded-full hover:bg-primary hover:text-white transition group"
                  >
                     <Play size={20} className="ml-0.5" />
                  </button>
               </div>
            ))}
         </div>
         {filteredSurahs.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No Surahs found matching your search.</div>
         )}
      </div>
    </div>
  );
};

export default AudioPage;