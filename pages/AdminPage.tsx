import React, { useState } from 'react';
import { useApp } from '../services/context';
import { Upload, CheckCircle, AlertCircle, Lock, Heart, Settings, Plus, Trash2, FileText, Image as ImageIcon } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { 
    addTranslation, 
    removeTranslation, 
    translations, 
    donationConfig, 
    updateDonationConfig,
    blogPosts,
    addBlogPost,
    removeBlogPost
  } = useApp();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'donations' | 'translations' | 'blogs'>('donations');
  
  // Translation State
  const [langName, setLangName] = useState('');
  const [langCode, setLangCode] = useState('');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Blog State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('');

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
      setMessage({ type: 'success', text: `Successfully added ${langName}. Refreshed on frontend.` });
      setLangName(''); setLangCode(''); setFileContent(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'XML Parse error.' });
    }
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) {
      setMessage({ type: 'error', text: 'Title and content are required.' });
      return;
    }
    addBlogPost({
      title: blogTitle,
      excerpt: blogExcerpt || blogContent.substring(0, 100) + '...',
      content: blogContent,
      image: blogImage || 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800'
    });
    setMessage({ type: 'success', text: 'Blog post published!' });
    setBlogTitle(''); setBlogExcerpt(''); setBlogContent(''); setBlogImage('');
  };

  const handleDonationSave = () => {
    updateDonationConfig(localDonation);
    setMessage({ type: 'success', text: 'Donation settings updated and saved.' });
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-red-500" size={32} />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Admin Dashboard</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Access Key"
                        className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:border-primary transition-all font-bold"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                    <button className="w-full bg-secondary text-white py-4 rounded-xl font-extrabold hover:bg-green-800 transition shadow-lg shadow-green-900/20">Sign In</button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Management Console</h1>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
           {(['donations', 'translations', 'blogs'] as const).map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition ${activeTab === tab ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center shadow-md animate-fade-in ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
           {message.type === 'success' ? <CheckCircle className="mr-3" size={20}/> : <AlertCircle className="mr-3" size={20}/>}
           <span className="font-bold text-sm">{message.text}</span>
           <button className="ml-auto" onClick={() => setMessage(null)}><Plus className="rotate-45" size={18}/></button>
        </div>
      )}

      {/* TABS CONTENT */}
      {activeTab === 'donations' && (
        <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-500"><Heart size={24} fill="currentColor" /></div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Donation Settings</h2>
            </div>
            
            <div className="grid gap-6">
              <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Popup Visibility</h4>
                    <p className="text-xs text-gray-400">Visitor-facing support prompt</p>
                  </div>
                  <button 
                    onClick={() => setLocalDonation({...localDonation, enabled: !localDonation.enabled})}
                    className={`w-14 h-8 rounded-full transition-colors relative ${localDonation.enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localDonation.enabled ? 'left-7' : 'left-1'}`} />
                  </button>
              </div>

              <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Display Message</label>
                    <textarea 
                      value={localDonation.message}
                      onChange={e => setLocalDonation({...localDonation, message: e.target.value})}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white"
                      rows={3}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">CTA Label</label>
                      <input 
                          type="text" 
                          value={localDonation.buttonText}
                          onChange={e => setLocalDonation({...localDonation, buttonText: e.target.value})}
                          className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Destination URL</label>
                      <input 
                          type="text" 
                          value={localDonation.link}
                          onChange={e => setLocalDonation({...localDonation, link: e.target.value})}
                          className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                  <button onClick={handleDonationSave} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-500/20">
                      Save & Sync
                  </button>
              </div>
            </div>
        </section>
      )}

      {activeTab === 'translations' && (
        <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Upload size={24} /></div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add Translation</h2>
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
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Slug (Internal Code)</label>
                  <input 
                      type="text" 
                      value={langCode}
                      onChange={e => setLangCode(e.target.value)}
                      placeholder="e.g. orom" 
                      className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white font-bold"
                  />
                  </div>
              </div>

              <div className="border-3 border-dashed border-gray-200 dark:border-gray-600 rounded-3xl p-10 text-center hover:border-primary transition-all cursor-pointer relative bg-gray-50 dark:bg-gray-900/20">
                  <input type="file" accept=".xml" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="pointer-events-none">
                      <Upload className="mx-auto text-gray-400 mb-3" size={40} />
                      <p className="text-gray-500 dark:text-gray-400 font-bold">{fileContent ? "XML Loaded" : "Upload Quran XML"}</p>
                      <p className="text-gray-400 text-[10px] mt-1 uppercase">Max size: 5MB</p>
                  </div>
              </div>

              <button type="submit" className="w-full bg-secondary text-white py-4 rounded-xl font-extrabold hover:bg-green-800 transition shadow-xl">
                Deploy Translation
              </button>
          </form>

          <div className="mt-12 border-t dark:border-gray-700 pt-10">
              <div className="flex items-center space-x-2 mb-6">
                  <Settings className="text-gray-400" size={18} />
                  <h3 className="font-bold text-gray-800 dark:text-white">Active Database</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {translations.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 group">
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-100">{t.name}</span>
                        <div className="text-[10px] text-gray-400 uppercase mt-1">ID: {t.id}</div>
                      </div>
                      {t.id !== 'am' && (
                        <button onClick={() => removeTranslation(t.id)} className="p-2 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                          <Trash2 size={18} />
                        </button>
                      )}
                  </div>
              ))}
              </div>
          </div>
        </section>
      )}

      {activeTab === 'blogs' && (
        <section className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-accent/10 rounded-2xl text-accent"><FileText size={24} /></div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Blog Post</h2>
            </div>
            
            <form onSubmit={handleBlogSubmit} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Title</label>
                  <input 
                    type="text" 
                    value={blogTitle}
                    onChange={e => setBlogTitle(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white font-bold"
                    placeholder="E.g. The Power of Tahajjud"
                  />
               </div>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        value={blogImage}
                        onChange={e => setBlogImage(e.target.value)}
                        className="w-full pl-12 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white text-sm"
                        placeholder="https://images.unsplash..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Excerpt (Short Summary)</label>
                    <input 
                      type="text" 
                      value={blogExcerpt}
                      onChange={e => setBlogExcerpt(e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Full Content</label>
                  <textarea 
                    value={blogContent}
                    onChange={e => setBlogContent(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:border-primary text-gray-800 dark:text-white min-h-[200px]"
                    rows={6}
                  />
               </div>
               <button type="submit" className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition shadow-lg shadow-amber-500/20">
                  Publish Post
               </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold text-xl mb-6 text-gray-800 dark:text-white">Manage Posts</h3>
             <div className="space-y-4">
                {blogPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center space-x-4">
                      <img src={post.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div>
                        <div className="font-bold text-gray-800 dark:text-white line-clamp-1">{post.title}</div>
                        <div className="text-[10px] text-gray-400 uppercase">{post.date}</div>
                      </div>
                    </div>
                    <button onClick={() => removeBlogPost(post.id)} className="p-2 text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {blogPosts.length === 0 && <p className="text-gray-400 text-center py-4">No posts found.</p>}
             </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPage;