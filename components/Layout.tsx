import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Mic, Home, FileText, Moon, Sun, Globe } from 'lucide-react';
import { useApp } from '../services/context';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { darkMode, toggleDarkMode, translations, currentTranslationId, setTranslationId } = useApp();

  const isActive = (path: string) => location.pathname === path ? "text-primary font-bold" : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Quran.et</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/blog" className={isActive('/blog')}>Blog</Link>
              <Link to="/audio" className={isActive('/audio')}>Audio</Link>
            </nav>

            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="relative group">
                 <div className="flex items-center cursor-pointer text-gray-600 dark:text-gray-300 hover:text-primary">
                    <Globe size={20} className="mr-1"/>
                    <span className="uppercase text-sm font-bold">{currentTranslationId}</span>
                 </div>
                 <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-lg overflow-hidden hidden group-hover:block">
                    {translations.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setTranslationId(t.id)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${currentTranslationId === t.id ? 'text-primary font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {t.name}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-secondary dark:bg-gray-950 text-white py-8 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-4">
             <Link to="/" className="hover:text-primary transition-colors"><Home size={24} /></Link>
             <Link to="/audio" className="hover:text-primary transition-colors"><Mic size={24} /></Link>
             <Link to="/blog" className="hover:text-primary transition-colors"><FileText size={24} /></Link>
          </div>
          <p>© {new Date().getFullYear()} Quran.et. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;