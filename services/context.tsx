import React, { createContext, useContext, useState, useEffect } from 'react';
import { Translation, QuranData, Blog, Reciter, FavoriteItem } from '../types';
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

  reciters: Reciter[];
  setReciters: React.Dispatch<React.SetStateAction<Reciter[]>>;

  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

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
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
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

  // Initialization from Backend & LocalStorage
  useEffect(() => {
    // 1. Initialize favorites from localStorage
    const savedFavorites = localStorage.getItem('user_favorites_list');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Fetch server database values for synchronization
    fetch('/api/public/data')
      .then(res => res.json())
      .then(async (serverData) => {
        if (serverData.blogs) setBlogPosts(serverData.blogs);
        if (serverData.reciters) setReciters(serverData.reciters);
        if (serverData.donationConfig) setDonationConfig(serverData.donationConfig);
        
        // Assemble translations list starting with the local Amharic mock
        const defaultParsed = parseQuranXML(MOCK_AMHARIC_XML);
        const defaultTrans: Translation = { id: 'am', name: 'Amharic', data: defaultParsed };
        const items = [defaultTrans];

        if (serverData.translationsMeta) {
          for (let meta of serverData.translationsMeta) {
            try {
              const res = await fetch(`/api/public/translation/${meta.id}`);
              const fullTr = await res.json();
              if (fullTr && fullTr.xml) {
                items.push({
                  id: fullTr.id,
                  name: fullTr.name,
                  data: parseQuranXML(fullTr.xml)
                });
              }
            } catch (err) {
              console.error("Failed to fetch full translation for " + meta.id, err);
            }
          }
        }
        setTranslations(items);
      })
      .catch((err) => {
        console.warn("Express server unavailable or starting, utilizing local fallback state", err);
        // Fallback state on local storage if server is unresponsive
        const defaultParsed = parseQuranXML(MOCK_AMHARIC_XML);
        const defaultTrans: Translation = { id: 'am', name: 'Amharic', data: defaultParsed };
        setTranslations([defaultTrans]);
        setBlogPosts(INITIAL_BLOG_POSTS);
        setReciters([
          { name: 'Abdulbasit Abdulsamad (Sura Recitation)', subfolder: 'basit', isEveryAyah: false },
          { name: 'Maher Al-Meaqli (Sura Recitation)', subfolder: 'maher', isEveryAyah: false },
          { name: 'Mishary Alafasi (Sura Recitation)', subfolder: 'afs', isEveryAyah: false },
          { name: 'Saad Al-Ghamdi (Sura Recitation)', subfolder: 's_gmd', isEveryAyah: false },
          { name: 'Abdulrahman Al-Sudaes (Sura Recitation)', subfolder: 'sds', isEveryAyah: false },
          { name: 'Abdul Basit (Every Ayah - AbdulSamad_64kbps)', subfolder: 'AbdulSamad_64kbps_QuranExplorer.Com', isEveryAyah: true },
          { name: 'Mishary Alafasy (Every Ayah - Alafasy_128kbps)', subfolder: 'Alafasy_128kbps', isEveryAyah: true },
          { name: 'Saad Al-Ghamdi (Every Ayah - Ghamadi_40kbps)', subfolder: 'Ghamadi_40kbps', isEveryAyah: true },
          { name: 'Mahmoud Al-Husary (Every Ayah - Husary_128kbps)', subfolder: 'Husary_128kbps', isEveryAyah: true },
          { name: 'Maher Al-Muaiqly (Every Ayah - Maher_AlMuaiqly_64kbps)', subfolder: 'Maher_AlMuaiqly_64kbps', isEveryAyah: true }
        ]);
      });

    // 3. Load Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // 4. Load Active Translation ID
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

  // Add translation locally (also sync with server if available in backgrounds)
  const addTranslation = (id: string, name: string, xml: string) => {
    const parsed = parseQuranXML(xml);
    const newTrans: Translation = { id, name, data: parsed };
    setTranslations(prev => [...prev.filter(t => t.id !== id), newTrans]);
  };

  const removeTranslation = (id: string) => {
    if (id === 'am') return; // Protect default
    setTranslations(prev => prev.filter(t => t.id !== id));
  };

  const addBlogPost = (post: Omit<Blog, 'id' | 'date'>) => {
    const newPost: Blog = {
      ...post,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setBlogPosts(prev => [newPost, ...prev]);
  };

  const removeBlogPost = (id: number) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
  };

  // Favorites Handlers
  const addFavorite = (item: Omit<FavoriteItem, 'id'>) => {
    const id = item.type === 'surah' ? `sura-${item.suraId}` : `ayah-${item.suraId}-${item.ayahIndex}`;
    const newItem: FavoriteItem = { ...item, id };
    setFavorites(prev => {
      const exists = prev.some(f => f.id === id);
      if (exists) return prev; // Avoid duplicate
      const updated = [...prev, newItem];
      localStorage.setItem('user_favorites_list', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id);
      localStorage.setItem('user_favorites_list', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
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
      reciters,
      setReciters,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
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