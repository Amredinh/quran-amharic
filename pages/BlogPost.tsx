import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../services/context';
import { Calendar, User, ArrowLeft, MessageSquare } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogPosts } = useApp();
  const post = blogPosts.find(p => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">Article Not Found</h2>
        <button onClick={() => navigate('/blog')} className="text-primary font-bold hover:underline">Return to Blog</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
       <button onClick={() => navigate('/blog')} className="group flex items-center text-gray-500 dark:text-gray-400 hover:text-primary mb-8 font-bold transition">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform"/> Back to Insights
       </button>

       <article className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-12">
          <div className="h-64 md:h-[400px] w-full overflow-hidden relative">
             <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 md:p-12">
                <div>
                   <div className="flex items-center space-x-4 text-xs font-bold text-white/80 mb-3 uppercase tracking-widest">
                      <span className="flex items-center"><Calendar size={14} className="mr-1"/> {post.date}</span>
                      <span className="flex items-center"><User size={14} className="mr-1"/> Staff Writer</span>
                   </div>
                   <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">{post.title}</h1>
                </div>
             </div>
          </div>
          <div className="p-8 md:p-12">
             <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-[1.8] text-lg">
                {post.content.split('\n').map((para, i) => (
                  <p key={i} className="mb-6">{para}</p>
                ))}
             </div>
          </div>
       </article>

       <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gray-700">
         <div className="flex items-center space-x-3 mb-8">
            <MessageSquare className="text-primary" size={24} />
            <h3 className="font-extrabold text-2xl text-gray-800 dark:text-white">Join the Conversation</h3>
         </div>
         
         <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <p className="font-extrabold text-gray-900 dark:text-white">Admin Team</p>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Featured</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">This platform is built for you. We appreciate your feedback and reflections on this article.</p>
            </div>
            
            <div className="mt-8 space-y-4">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Write a response</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="text" 
                        placeholder="Share your thoughts..." 
                        className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:border-primary transition-all" 
                    />
                    <button className="bg-primary text-white px-8 py-4 rounded-xl font-extrabold hover:bg-green-600 transition shadow-lg shadow-green-500/20">Post</button>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BlogPost;