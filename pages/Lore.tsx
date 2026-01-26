
import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { LoreEvent } from '../types';

const Lore: React.FC = () => {
  const [events, setEvents] = useState<LoreEvent[]>([]);

  useEffect(() => {
    const loadLore = async () => {
      const loreEvents = await supabaseService.getLore();
      setEvents(loreEvents);
    };
    loadLore();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-8 py-40">
      <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-32">Archives Lore.</h1>
      
      <div className="relative border-l border-white/10 pl-16 space-y-32">
        {events.map(event => (
          <div key={event.id} className="relative group">
            <div className="absolute -left-[72px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-[#0b0d17] group-hover:scale-150 transition-transform"></div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-6 block">{event.date}</span>
            <h3 className="text-4xl font-black italic mb-10 uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{event.title}</h3>
            <div className="bg-[#151a26] p-12 rounded-[40px] border border-white/5 shadow-2xl">
              <p className="text-gray-400 text-lg mb-10 leading-loose italic">"{event.description}"</p>
              <div className="pt-8 border-t border-white/5">
                <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest block mb-4">Statut de l'évènement :</span>
                <p className="text-sm text-blue-500 font-bold uppercase tracking-widest">{event.outcome}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lore;
