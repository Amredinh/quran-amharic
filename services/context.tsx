import React, { createContext, useContext, useState, useEffect } from 'react';
import { Translation, QuranData } from '../types';
import { MOCK_AMHARIC_XML, MOCK_ARABIC_XML } from '../constants';
import { parseQuranXML } from './quranService';

interface DonationConfig {
  message: string;
  buttonText: string;
  link: string;
  enabled: boolean;
}

interface AppContextType {
  arabicData: QuranData;
  translations: Translation[];
  addTranslation: (id: string, name: string, xml: string) => void;
  currentTranslationId: string;
  setTranslationId: (id: string) => void;
  
  audioPlayerState: {
    isPlaying: boolean;
    currentUrl: string | null;
    reciterName: string;
    surahName: string;
    showPlayer: boolean;
    surahId: number;
    reciterFolder: string;
  };
  playSurahAudio: (url: string, surahName: string, reciterName: string, surahId: number, reciterFolder: string) => void;
  stopAudio: () => void;

  darkMode: boolean;
  toggleDarkMode: () => void;

  donationConfig: DonationConfig;
  updateDonationConfig: (config: DonationConfig) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [arabicData] = useState<QuranData>(parseQuranXML(MOCK_ARABIC_XML));
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [currentTranslationId, setTranslationId] = useState<string>('am');
  const [darkMode, setDarkMode] = useState(false);
  const [donationConfig, setDonationConfig] = useState<DonationConfig>({
    message: "Help us keep Quran.et free and sustainable for the Ethiopian community.",
    buttonText: "Donate Now",
    link: "https://example.com/donate",
    enabled: true
  });

  const [audioPlayerState, setAudioPlayerState] = useState({
    isPlaying: false,
    currentUrl: null as string | null,
    reciterName: '',
    surahName: '',
    showPlayer: false,
    surahId: 1,
    reciterFolder: ''
  });

  useEffect(() => {
    const parsed = parseQuranXML(MOCK_AMHARIC_XML);
    setTranslations([{ id: 'am', name: 'Amharic', data: parsed }]);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const savedDonation = localStorage.getItem('donationConfig');
    if (savedDonation) {
      setDonationConfig(JSON.parse(savedDonation));
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

  const playSurahAudio = (url: string, surahName: string, reciterName: string, surahId: number, reciterFolder: string) => {
    setAudioPlayerState({
      isPlaying: true,
      currentUrl: url,
      surahName,
      reciterName,
      showPlayer: true,
      surahId,
      reciterFolder
    });
  };

  const stopAudio = () => {
    setAudioPlayerState(prev => ({ ...prev, isPlaying: false, showPlayer: false, currentUrl: null }));
  };

  const updateDonationConfig = (config: DonationConfig) => {
    setDonationConfig(config);
    localStorage.setItem('donationConfig', JSON.stringify(config));
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
      toggleDarkMode,
      donationConfig,
      updateDonationConfig
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