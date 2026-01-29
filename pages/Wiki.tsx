
import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Icons } from '../components/Icons';
import { WikiSection } from '../types';

const Wiki: React.FC = () => {
  const [wikiSections, setWikiSections] = useState<WikiSection[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ['Tous', 'Général', 'Départements', 'Protocoles'] as const;
  const [activeCat, setActiveCat] = useState<typeof categories[number]>('Tous');

  useEffect(() => {
    const loadWiki = async () => {
      setLoading(true);
      try {
        const sections = await supabaseService.getWiki();
        setWikiSections(sections);
      } catch (error) {
        console.error('Erreur lors du chargement du wiki:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWiki();
  }, []);

  const filtered = activeCat === 'Tous' 
    ? wikiSections 
    : wikiSections.filter(s => s.category === activeCat);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-6">Wiki Central.</h1>
        <div className="text-center text-gray-500">Chargement...</div>
      </div>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'rules': return <Icons.Rules />;
      case 'science': return <Icons.Science />;
      case 'security': return <Icons.Security />;
      case 'tech': return <Icons.Tech />;
      case 'admin': return <Icons.Admin />;
      case 'play': return <Icons.Play />;
      default: return <Icons.Info />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-20">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-6">Wiki Central.</h1>
        <div className="flex flex-wrap gap-4">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                activeCat === cat 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 italic">Aucune section disponible.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(section => (
          <div key={section.id} className="bg-[#151a26] p-12 rounded-[40px] border border-white/5 hover:bg-white/5 transition-all group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-[10px] font-black uppercase text-blue-500/50 tracking-widest">{section.category}</div>
            <div className="w-16 h-16 text-blue-500 mb-10 group-hover:scale-110 transition-transform duration-500">
              {getIcon(section.icon)}
            </div>
            <h3 className="text-2xl font-bold italic uppercase mb-4">{section.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm mb-8">{section.description}</p>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default Wiki;
