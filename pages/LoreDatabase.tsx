
import React, { useState } from 'react';

const LoreDatabase: React.FC = () => {
  const [search, setSearch] = useState('');

  const departments = [
    { title: 'Règlements', icon: 'clipboard' },
    { title: 'Fondamentaux', icon: 'lightbulb' },
    { title: 'Comment fonctionne... ?', icon: 'question' },
    { title: 'Département Scientifique', icon: 'book' },
    { title: 'Département de la Sécurité', icon: 'shield' },
    { title: "Département d'Ingénierie & des Services Techniques", icon: 'wrench' },
    { title: 'Département Administratif', icon: 'users' },
  ];

  return (
    <div className="pt-32 px-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <h1 className="text-6xl font-bold italic tracking-tighter">Wiki</h1>
        
        <div className="flex w-full md:w-96">
          <input 
            type="text" 
            placeholder="Rechercher" 
            className="flex-1 bg-[#151a26] border border-white/5 px-6 py-3 rounded-l-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-600 px-6 rounded-r-lg hover:bg-blue-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((dept, i) => (
          <div key={i} className="bg-[#151a26] p-10 rounded-xl border border-white/5 hover:border-blue-500/50 card-glow transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              {/* Simple icons based on title */}
              {dept.icon === 'clipboard' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              {dept.icon === 'lightbulb' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.674a1 1 0 01.992.883l.667 5a1 1 0 01-.992 1.117H9.006a1 1 0 01-.992-1.117l.667-5a1 1 0 01.982-.883zM12 2a7 7 0 00-7 7c0 2.386 1.19 4.495 3 5.748V17h8v-2.252c1.81-1.253 3-3.362 3-5.748a7 7 0 00-7-7z" /></svg>}
              {dept.icon === 'question' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              {dept.icon === 'book' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              {dept.icon === 'shield' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              {dept.icon === 'wrench' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              {dept.icon === 'users' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            </div>
            <h3 className="text-xl font-bold italic">{dept.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoreDatabase;
