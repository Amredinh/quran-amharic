import React, { useState } from 'react';
import { useApp } from '../services/context';
import { Upload, CheckCircle, AlertCircle, Lock } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { addTranslation, translations } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Admin Logic
  const [langName, setLangName] = useState('');
  const [langCode, setLangCode] = useState('');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded check for demo
        setIsAuthenticated(true);
    } else {
        alert("Incorrect password");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!langName || !langCode || !fileContent) {
      setMessage({ type: 'error', text: 'Please fill all fields and upload XML.' });
      return;
    }

    try {
      addTranslation(langCode, langName, fileContent);
      setMessage({ type: 'success', text: `Successfully added ${langName} translation.` });
      setLangName('');
      setLangCode('');
      setFileContent(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to parse XML file.' });
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-red-500 dark:text-red-400" size={32} />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Restricted Area</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Authorized personnel only.</p>
                <form onSubmit={handleLogin}>
                    <input 
                        type="password" 
                        placeholder="Enter Access Key"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:border-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">Unlock</button>
                </form>
            </div>
        </div>
    );
  }

  // Dashboard
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <Upload className="mr-3 text-primary" /> Admin Panel
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Upload new translation XML files here. The format must match the standard Quran XML structure.</p>

      {message && (
        <div className={`p-4 rounded-lg mb-6 flex items-center ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
           {message.type === 'success' ? <CheckCircle className="mr-2" size={20}/> : <AlertCircle className="mr-2" size={20}/>}
           {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Language Name</label>
          <input 
            type="text" 
            value={langName}
            onChange={e => setLangName(e.target.value)}
            placeholder="e.g. Oromo" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Language Code (Slug)</label>
          <input 
            type="text" 
            value={langCode}
            onChange={e => setLangCode(e.target.value)}
            placeholder="e.g. orom" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">XML File</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer relative">
            <input type="file" accept=".xml" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="pointer-events-none">
                <Upload className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">{fileContent ? "File loaded ready for submit" : "Click to upload XML"}</p>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-green-800 transition">
          Add Translation
        </button>
      </form>

      <div className="mt-12 border-t dark:border-gray-700 pt-8">
        <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Current Active Translations</h3>
        <ul className="space-y-2">
           {translations.map(t => (
             <li key={t.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
                <span>{t.name}</span>
                <span className="bg-gray-200 dark:bg-gray-600 text-xs font-mono px-2 py-1 rounded">/{t.id}</span>
             </li>
           ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;