
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Wiki', path: '/wiki' },
    { label: 'Blog', path: '/blog' },
    { label: 'Lore', path: '/lore' },
  ];

  const canAdmin = user && (user.grade === 'Fondateur' || user.grade === 'Responsable');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d17] text-white selection:bg-blue-600 selection:text-white">
      <nav className="fixed top-0 w-full z-50 h-24 bg-[#0b0d17]/80 backdrop-blur-2xl border-b border-white/5 px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black rounded-xl transition-transform group-hover:rotate-6 shadow-xl">S</div>
          <span className="text-xl font-black tracking-tighter uppercase italic">Site-19 Hub</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-white ${
                location.pathname === item.path ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          {canAdmin && (
            <Link 
              to="/admin" 
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 ${
                location.pathname === '/admin' ? 'bg-red-500/20 border-red-500/40' : ''
              }`}
            >
              Dashboard Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-2xl border border-white/10 group hover:border-white/20 transition-all cursor-default">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30">
                {user.username[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{user.characterName}</span>
                <span className="text-[8px] font-bold uppercase text-blue-500 tracking-[0.2em] mt-1">{user.grade}</span>
              </div>
              <button 
                onClick={onLogout}
                className="ml-4 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              Se Connecter
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black/40 border-t border-white/5 py-24 px-12 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black rounded-lg">S</div>
            <span className="font-black uppercase italic tracking-tighter">Site-19 Hub.</span>
          </div>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">Fondation SCP © 2024 - Non Affilié à SCP Wiki</p>
          <div className="flex gap-6">
             <div className="w-5 h-5 text-gray-600 hover:text-white transition-colors cursor-pointer"><Icons.Discord /></div>
             <div className="w-5 h-5 text-gray-600 hover:text-white transition-colors cursor-pointer"><Icons.Roblox /></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
