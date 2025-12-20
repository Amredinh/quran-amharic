import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Mic, Home, FileText, Moon, Sun, Globe, X, Heart } from 'lucide-react';
import { useApp } from '../services/context';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { darkMode, toggleDarkMode, translations, currentTranslationId, setTranslationId, donationConfig } = useApp();
  const [showDonation, setShowDonation] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('donationDismissed');
    if (!dismissed && donationConfig.enabled) {
      const timer = setTimeout(() => setShowDonation(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [donationConfig.enabled]);

  const handleDismissDonation = () => {
    setShowDonation(false);
    localStorage.setItem('donationDismissed', 'true');
  };

  const isActive = (path: string) => location.pathname === path ? "text-primary font-bold" : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors duration-300 border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="logo.webp" alt="Quran.et Logo" className="w-10 h-10 object-contain rounded-full shadow-sm" />
            <span className="text-xl font-extrabold text-secondary dark:text-white hidden sm:block tracking-tight">Quran.et</span>
          </Link>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/blog" className={isActive('/blog')}>Blog</Link>
              <Link to="/audio" className={isActive('/audio')}>Audio</Link>
            </nav>

            <div className="flex items-center space-x-3">
              <div className="relative group">
                 <div className="flex items-center cursor-pointer p-1.5 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <Globe size={18} className="mr-2 text-primary"/>
                    <span className="uppercase text-xs font-bold">{currentTranslationId}</span>
                 </div>
                 <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-xl overflow-hidden hidden group-hover:block animate-fade-in">
                    {translations.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setTranslationId(t.id)}
                        className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 transition ${currentTranslationId === t.id ? 'text-primary font-bold bg-primary/5' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {t.name}
                      </button>
                    ))}
                 </div>
              </div>

              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        {children}
      </main>

      {/* Donation Modal */}
      {showDonation && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 relative border border-gray-100 dark:border-gray-700">
              <button onClick={handleDismissDonation} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                <X size={24}/>
              </button>
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <Heart className="text-red-500 fill-red-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">Support Quran.et</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {donationConfig.message}
              </p>
              <div className="flex flex-col gap-3">
                <a 
                  href={donationConfig.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-green-600 text-white text-center py-3.5 rounded-xl font-bold transition shadow-lg shadow-green-500/20"
                >
                  {donationConfig.buttonText}
                </a>
                <button 
                  onClick={handleDismissDonation}
                  className="text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 py-2 transition"
                >
                  Maybe Later
                </button>
              </div>
           </div>
        </div>
      )}

      <footer className="bg-secondary dark:bg-gray-950 text-white py-12 transition-colors duration-300 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-6 mb-8">
             <Link to="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition"><Home size={22} /></Link>
             <Link to="/audio" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition"><Mic size={22} /></Link>
             <Link to="/blog" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition"><FileText size={22} /></Link>
          </div>
          <div className="max-w-md mx-auto mb-6">
            <img src="logo.webp" alt="Logo" className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h4 className="font-bold text-lg mb-2">Quran.et - የኢትዮጵያ ቁርኣን ፖርታል</h4>
            <p className="text-gray-400 text-sm">Spreading the message of the Quran in native Ethiopian languages with modern technology.</p>
          </div>
          <p className="text-gray-500 text-xs mt-8">© {new Date().getFullYear()} Quran.et. Crafted with faith.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;