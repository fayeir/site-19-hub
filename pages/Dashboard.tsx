
import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { BlogPost } from '../types';

const Dashboard: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadBlog = async () => {
      const posts = await supabaseService.getBlog();
      setBlogPosts(posts.slice(0, 2));
    };
    loadBlog();
  }, []);

  return (
    <div className="animate-in fade-in duration-1000">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0d17]/80 to-[#0b0d17] z-10"></div>
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1445262102387-5febb1932c1a?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale brightness-50 contrast-125"></div>
        
        <div className="relative text-center px-6 max-w-5xl z-20">
          <div className="inline-block px-6 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-10 backdrop-blur-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Accès Sécurisé : Réseau Fondation</span>
          </div>
          <h1 className="text-[10rem] font-black italic tracking-tighter leading-[0.9] mb-12 uppercase select-none opacity-90">
            Site-19<span className="text-blue-600">.</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed italic opacity-80">
            Le hub administratif central pour la gestion du personnel, les archives historiques et les protocoles de confinement.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link to="/wiki" className="group bg-white text-black px-16 py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-blue-600 hover:text-white flex items-center gap-4 shadow-2xl">
              <span>Consulter le Wiki</span>
              <div className="w-4 h-4"><Icons.Play /></div>
            </Link>
            <Link to="/lore" className="text-gray-500 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all border-b border-white/5 pb-2">Archives Lore</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-40 grid grid-cols-1 md:grid-cols-3 gap-20">
        <div className="space-y-6">
          <div className="w-12 h-12 text-blue-600"><Icons.Security /></div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">Personnel</h3>
          <p className="text-gray-500 text-sm leading-loose">Une hiérarchie stricte assurant l'efficacité opérationnelle et la sécurité des données sensibles.</p>
        </div>
        <div className="space-y-6">
          <div className="w-12 h-12 text-blue-600"><Icons.Science /></div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">Recherche</h3>
          <p className="text-gray-500 text-sm leading-loose">Documentation exhaustive sur les anomalies et les procédures de tests scientifiques.</p>
        </div>
        <div className="space-y-6">
          <div className="w-12 h-12 text-blue-600"><Icons.Tech /></div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">Stabilité</h3>
          <p className="text-gray-500 text-sm leading-loose">Infrastructures optimisées pour une expérience RP fluide et sans interruptions techniques.</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
