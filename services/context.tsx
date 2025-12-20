import React, { createContext, useContext, useState, useEffect } from 'react';
import { Translation, QuranData } from '../types';
import { MOCK_AMHARIC_XML, MOCK_ARABIC_XML } from '../constants';
import { parseQuranXML } from './quranService';

interface AppContextType {
  arabicData: QuranData;
  translations: Translation[];
  addTranslation: (id: string, name: string, xml: string) => void;
  currentTranslationId: string;
  setTranslationId: (id: string) => void;
  
  // Audio Player State (Global Footer Player)
  audioPlayerState: {
    isPlaying: boolean;
    currentUrl: string | null;
    reciterName: string;
    surahName: string;
    showPlayer: boolean;
  };
  playSurahAudio: (url: string, surahName: string, reciterName: string) => void;
  stopAudio: () => void;

  // UI State
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [arabicData] = useState<QuranData>(parseQuranXML(MOCK_ARABIC_XML));
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [currentTranslationId, setTranslationId] = useState<string>('am');
  
  const [darkMode, setDarkMode] = useState(false);

  const [audioPlayerState, setAudioPlayerState] = useState({
    isPlaying: false,
    currentUrl: null as string | null,
    reciterName: '',
    surahName: '',
    showPlayer: false
  });

  useEffect(() => {
    // Load default Amharic translation
    const parsed = parseQuranXML(MOCK_AMHARIC_XML);
    setTranslations([{ id: 'am', name: 'Amharic', data: parsed }]);

    // Initialize Dark Mode from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newVal;
    });
  };

  const addTranslation = (id: string, name: string, xml: string) => {
    const parsed = parseQuranXML(xml);
    setTranslations(prev => [...prev.filter(t => t.id !== id), { id, name, data: parsed }]);
  };

  const playSurahAudio = (url: string, surahName: string, reciterName: string) => {
    setAudioPlayerState({
      isPlaying: true,
      currentUrl: url,
      surahName,
      reciterName,
      showPlayer: true
    });
  };

  const stopAudio = () => {
    setAudioPlayerState(prev => ({ ...prev, isPlaying: false, showPlayer: false, currentUrl: null }));
  };

  return (
    <AppContext.Provider value={{
      arabicData,
      translations,
      addTranslation,
      currentTranslationId,
      setTranslationId,
      audioPlayerState,
      playSurahAudio,
      stopAudio,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};