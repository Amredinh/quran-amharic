import React, { useState } from 'react';
import { useApp } from '../services/context';
import { Upload, CheckCircle, AlertCircle, Lock, Heart, Settings } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { addTranslation, translations, donationConfig, updateDonationConfig } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Translation State
  const [langName, setLangName] = useState('');
  const [langCode, setLangCode] = useState('');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Donation State
  const [localDonation, setLocalDonation] = useState(donationConfig);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
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
        if (event.target?.result) setFileContent(event.target.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleTranslationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!langName || !langCode || !fileContent) {
      setMessage({ type: 'error', text: 'Missing fields.' });
      return;
    }
    try {
      addTranslation(langCode, langName, fileContent);
      setMessage({ type: 'success', text: `Added ${langName} translation.` });
      setLangName(''); setLangCode(''); setFileContent(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'XML Parse error.' });
    }
  };

  const handleDonationSave = () => {
    updateDonationConfig(localDonation);
    setMessage({ type: 'success', text: 'Donation settings updated.' });
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-red-500" size={32} />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Please enter credentials to continue.</p>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Access Key"
                        className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:border-primary transition-all font-bold"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-full bg-secondary text-white py-4 rounded-xl font-extrabold hover:bg-green-800 transition shadow-lg shadow-green-900/20">Sign In</button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-fade-in">
      
      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center shadow-lg animate-fade-in ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
           {message.type === 'success' ? <CheckCircle className="mr-3" size={24}/> : <AlertCircle className="mr-3" size={24}/>}
           <span className="font-bold">{message.text}</span>
        </div>
      )}

      {/* Donation Settings */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-500"><Heart size={24} fill="currentColor" /></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Donation Pop-up Settings</h2>
          </div>
          
          <div className="grid gap-6">
             <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <div>
                   <h4 className="font-bold text-gray-800 dark:text-white">Show Donation Popup</h4>
                   <p className="text-xs text-gray-400">Controls if the message appears to visitors</p>
                </div>
                <input 
                    type="checkbox" 
                    checked={localDonation.enabled} 
                    onChange={e => setLocalDonation({...localDonation, enabled: e.target.checked})}
                    className="w-6 h-6 accent-primary" 
                />
             </div>

             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Message</label>
                  <textarea 
                    value={localDonation.message}
                    onChange={e => setLocalDonation({...localDonation, message: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white"
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Button Text</label>
                    <input 
                        type="text" 
                        value={localDonation.buttonText}
                        onChange={e => setLocalDonation({...localDonation, buttonText: e.target.value})}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white font-bold"
                    />
                   </div>
                   <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Button Link</label>
                    <input 
                        type="text" 
                        value={localDonation.link}
                        onChange={e => setLocalDonation({...localDonation, link: e.target.value})}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white font-mono text-sm"
                    />
                   </div>
                </div>
                <button onClick={handleDonationSave} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-500/20">
                    Save Donation Settings
                </button>
             </div>
          </div>
      </section>

      {/* Translation Management */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Upload size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Translation Management</h2>
        </div>
        
        <form onSubmit={handleTranslationSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Language Name</label>
                <input 
                    type="text" 
                    value={langName}
                    onChange={e => setLangName(e.target.value)}
                    placeholder="e.g. Oromo" 
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white font-bold"
                />
                </div>
                <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Slug (Short Code)</label>
                <input 
                    type="text" 
                    value={langCode}
                    onChange={e => setLangCode(e.target.value)}
                    placeholder="e.g. orom" 
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white font-bold"
                />
                </div>
            </div>

            <div className="border-3 border-dashed border-gray-200 dark:border-gray-600 rounded-3xl p-12 text-center hover:border-primary transition-all cursor-pointer relative bg-gray-50 dark:bg-gray-800/50">
                <input type="file" accept=".xml" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="pointer-events-none">
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400 font-bold">{fileContent ? "File loaded successfully!" : "Drag & Drop Quran XML File"}</p>
                    <p className="text-gray-400 text-xs mt-2 uppercase">Supported format: .xml only</p>
                </div>
            </div>

            <button type="submit" className="w-full bg-secondary text-white py-4 rounded-xl font-extrabold hover:bg-green-800 transition shadow-xl">
              Publish New Translation
            </button>
        </form>

        <div className="mt-12 border-t dark:border-gray-700 pt-10">
            <div className="flex items-center space-x-2 mb-6">
                <Settings className="text-gray-400" size={18} />
                <h3 className="font-bold text-gray-800 dark:text-white">Active Languages</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {translations.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600">
                    <span className="font-bold text-gray-800 dark:text-gray-100">{t.name}</span>
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">ID: {t.id}</span>
                </div>
            ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;