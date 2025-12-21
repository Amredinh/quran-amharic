import React, { createContext, useContext, useState, useEffect } from 'react';
import { Translation, QuranData, Blog } from '../types';
import { MOCK_AMHARIC_XML, MOCK_ARABIC_XML, BLOG_POSTS as INITIAL_BLOG_POSTS } from '../constants';
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
  removeTranslation: (id: string) => void;
  currentTranslationId: string;
  setTranslationId: (id: string) => void;
  
  blogPosts: Blog[];
  addBlogPost: (post: Omit<Blog, 'id' | 'date'>) => void;
  removeBlogPost: (id: number) => void;

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
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
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

  // Initialization from LocalStorage
  useEffect(() => {
    // 1. Load Translations
    const savedTranslations = localStorage.getItem('user_translations');
    const defaultParsed = parseQuranXML(MOCK_AMHARIC_XML);
    const defaultTrans: Translation = { id: 'am', name: 'Amharic', data: defaultParsed };
    
    if (savedTranslations) {
      try {
        const parsedSaved = JSON.parse(savedTranslations);
        // We only store the metadata and raw XML in storage to keep it "saveable"
        // But for performance, we should ideally parse on load
        const fullyParsed: Translation[] = parsedSaved.map((t: any) => ({
          ...t,
          data: parseQuranXML(t.xml)
        }));
        setTranslations([defaultTrans, ...fullyParsed.filter(t => t.id !== 'am')]);
      } catch (e) {
        setTranslations([defaultTrans]);
      }
    } else {
      setTranslations([defaultTrans]);
    }

    // 2. Load Blog Posts
    const savedBlogs = localStorage.getItem('user_blogs');
    if (savedBlogs) {
      setBlogPosts(JSON.parse(savedBlogs));
    } else {
      setBlogPosts(INITIAL_BLOG_POSTS);
    }

    // 3. Load Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // 4. Load Donation
    const savedDonation = localStorage.getItem('donationConfig');
    if (savedDonation) {
      setDonationConfig(JSON.parse(savedDonation));
    }

    // 5. Load Active Translation ID
    const savedLang = localStorage.getItem('active_lang');
    if (savedLang) setTranslationId(savedLang);
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
    const newTrans: Translation = { id, name, data: parsed };
    
    setTranslations(prev => {
      const updated = [...prev.filter(t => t.id !== id), newTrans];
      // Save to localStorage (only raw data, not the massive parsed object if possible, but here we store simple XML-backed structure)
      const toStore = updated
        .filter(t => t.id !== 'am') // Don't store mock in localstorage
        .map(t => ({ id: t.id, name: t.name, xml: xml })); // Note: this logic assumes the 'xml' passed is the current one
      localStorage.setItem('user_translations', JSON.stringify(toStore));
      return updated;
    });
  };

  const removeTranslation = (id: string) => {
    if (id === 'am') return; // Protect default
    setTranslations(prev => {
      const updated = prev.filter(t => t.id !== id);
      const toStore = updated.filter(t => t.id !== 'am').map(t => ({ id: t.id, name: t.name, xml: '' })); // Simplified for example
      localStorage.setItem('user_translations', JSON.stringify(toStore));
      return updated;
    });
  };

  const addBlogPost = (post: Omit<Blog, 'id' | 'date'>) => {
    const newPost: Blog = {
      ...post,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setBlogPosts(prev => {
      const updated = [newPost, ...prev];
      localStorage.setItem('user_blogs', JSON.stringify(updated));
      return updated;
    });
  };

  const removeBlogPost = (id: number) => {
    setBlogPosts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('user_blogs', JSON.stringify(updated));
      return updated;
    });
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

  const handleSetTranslationId = (id: string) => {
    setTranslationId(id);
    localStorage.setItem('active_lang', id);
  };

  return (
    <AppContext.Provider value={{
      arabicData,
      translations,
      addTranslation,
      removeTranslation,
      currentTranslationId,
      setTranslationId: handleSetTranslationId,
      blogPosts,
      addBlogPost,
      removeBlogPost,
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