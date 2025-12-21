import React from 'react';
import { useApp } from '../services/context';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { blogPosts } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-secondary dark:text-white mb-4">Blog & Insights</h1>
        <p className="text-gray-500 dark:text-gray-400">Deep reflections and educational content on the Holy Quran.</p>
      </div>
      
      {blogPosts.map(post => (
        <article key={post.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300 group">
           <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
             <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
           </div>
           <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
             <div className="flex items-center space-x-4 text-xs font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest">
                <span className="flex items-center"><Calendar size={14} className="mr-1"/> {post.date}</span>
                <span className="flex items-center"><User size={14} className="mr-1"/> Editor</span>
             </div>
             <h2 
                className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-primary cursor-pointer transition-colors"
                onClick={() => navigate(`/blog/${post.id}`)}
             >
                 {post.title}
             </h2>
             <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-2">{post.excerpt}</p>
             <button 
                onClick={() => navigate(`/blog/${post.id}`)}
                className="bg-gray-50 dark:bg-gray-700 text-primary dark:text-primary-light font-bold px-6 py-2 rounded-xl hover:bg-primary hover:text-white self-start flex items-center transition-all"
             >
                 Read More <ArrowRight size={16} className="ml-2"/>
             </button>
           </div>
        </article>
      ))}

      {blogPosts.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-bold border-2 border-dashed rounded-3xl">
          No articles published yet.
        </div>
      )}
    </div>
  );
};

export default BlogPage;