import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.id === Number(id));

  if (!post) {
    return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Article not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
       <button onClick={() => navigate('/blog')} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary mb-6">
          <ArrowLeft size={20} className="mr-2"/> Back to Blog
       </button>

       <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-12">
          <div className="h-64 md:h-96 w-full overflow-hidden">
             <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 md:p-12">
             <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center"><Calendar size={16} className="mr-1"/> {post.date}</span>
                <span className="flex items-center"><User size={16} className="mr-1"/> Admin</span>
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">{post.title}</h1>
             <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>{post.content}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
             </div>
          </div>
       </article>

       {/* Comment Section (Moved from Archive Page) */}
       <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-inner">
         <h3 className="font-bold text-xl mb-6 text-gray-800 dark:text-white">Comments</h3>
         
         {/* Static Mock Comments */}
         <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm mb-4 border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm text-gray-900 dark:text-white">Ahmed</p>
                <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">MashaAllah, great explanation of Surah Al-Alaq. Very helpful.</p>
         </div>
         
         <div className="mt-6">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Leave a comment</p>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:border-primary" 
                />
                <button className="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-green-900 transition">Post</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BlogPost;