
import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      try {
        const blogPosts = await supabaseService.getBlog();
        setPosts(blogPosts);
      } catch (error) {
        console.error('Erreur lors du chargement du blog:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-40">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-32 text-center">Actualités.</h1>
        <div className="text-center text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-40">
      <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-32 text-center">Actualités.</h1>
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 italic">Aucun article disponible.</div>
      ) : (
        <div className="space-y-32">
          {posts.map(post => (
          <article key={post.id} className="group">
            <div className="flex items-center gap-6 mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 px-4 py-1 bg-blue-500/10 rounded-full">{post.category}</span>
              <div className="h-px flex-1 bg-white/5"></div>
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{post.date}</span>
            </div>
            <h2 className="text-5xl font-black italic mb-10 leading-none group-hover:text-blue-500 transition-colors uppercase tracking-tighter">{post.title}</h2>
            <div className="text-gray-500 text-lg leading-loose mb-12 italic">
              {post.content || post.excerpt}
            </div>
            <div className="flex items-center gap-4 border-t border-white/5 pt-10">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-xs">S</div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Publié par {post.author}</span>
            </div>
          </article>
        ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
