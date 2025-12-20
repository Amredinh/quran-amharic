import React from 'react';
import { BLOG_POSTS } from '../constants';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center text-secondary dark:text-primary mb-12">Blog & Insights</h1>
      
      {BLOG_POSTS.map(post => (
        <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition duration-300">
           <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
             <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-110 transition duration-700" />
           </div>
           <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
             <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="flex items-center"><Calendar size={14} className="mr-1"/> {post.date}</span>
                <span className="flex items-center"><User size={14} className="mr-1"/> Admin</span>
             </div>
             <h2 
                className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 hover:text-primary cursor-pointer"
                onClick={() => navigate(`/blog/${post.id}`)}
             >
                 {post.title}
             </h2>
             <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
             <button 
                onClick={() => navigate(`/blog/${post.id}`)}
                className="text-primary font-bold hover:underline self-start flex items-center"
             >
                 Read Article <ArrowRight size={16} className="ml-1"/>
             </button>
           </div>
        </article>
      ))}
    </div>
  );
};

export default BlogPage;