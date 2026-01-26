
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { User } from '../types';
import { supabaseService } from '../services/supabaseService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'selection' | 'login' | 'register'>('selection');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    characterName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showMaintenance = (service: string) => {
    alert(`[SYSTEME] L'authentification via ${service} est actuellement indisponible (Maintenance/Clés non configurées). Veuillez utiliser la Connexion Directe.`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.username || !formData.email || !formData.password || !formData.characterName) {
      setError("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    const { user, error: registerError } = await supabaseService.signUp(
      formData.email,
      formData.password,
      formData.username,
      formData.characterName
    );

    if (registerError || !user) {
      setError(registerError || "Erreur lors de l'inscription.");
      setLoading(false);
      return;
    }

    onLogin(user);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { user, error: loginError } = await supabaseService.signIn(
      formData.email,
      formData.password
    );

    if (loginError || !user) {
      setError(loginError || "Identifiants incorrects.");
      setLoading(false);
      return;
    }

    onLogin(user);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-lg bg-[#151a26]/90 backdrop-blur-2xl p-12 rounded-[40px] border border-white/5 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl mb-6 shadow-xl">S</div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Site-19 Hub</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Authentification de sécurité requise</p>
        </div>

        {mode === 'selection' && (
          <div className="space-y-4">
            <button onClick={() => showMaintenance('Discord')} className="w-full bg-[#5865F2] hover:bg-[#4752C4] py-5 rounded-2xl flex items-center justify-center gap-4 transition-all">
              <div className="w-6 h-6 text-white"><Icons.Discord /></div>
              <span className="font-bold uppercase tracking-widest text-xs text-white">Discord (Maintenance)</span>
            </button>
            <button onClick={() => showMaintenance('Roblox')} className="w-full bg-white text-black hover:bg-gray-200 py-5 rounded-2xl flex items-center justify-center gap-4 transition-all">
              <div className="w-6 h-6"><Icons.Roblox /></div>
              <span className="font-bold uppercase tracking-widest text-xs">Roblox (Maintenance)</span>
            </button>
            <div className="py-2 flex items-center gap-4 text-gray-800">
              <div className="h-px flex-1 bg-current opacity-20"></div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">OU</span>
              <div className="h-px flex-1 bg-current opacity-20"></div>
            </div>
            <button onClick={() => setMode('login')} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 transition-all">
              Connexion Directe
            </button>
            <button onClick={() => setMode('register')} className="w-full text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
              Créer un compte
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <input required type="email" name="email" placeholder="Email" value={formData.email} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl focus:border-blue-500 outline-none transition-colors" onChange={handleInputChange} />
            <input required type="password" name="password" placeholder="Mot de passe" value={formData.password} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl focus:border-blue-500 outline-none transition-colors" onChange={handleInputChange} />
            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
              {loading ? 'Connexion...' : 'Accéder au Hub'}
            </button>
            <button type="button" onClick={() => setMode('selection')} className="w-full text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Retour</button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input required type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl focus:border-blue-500 outline-none transition-colors" onChange={handleInputChange} />
            <input required type="text" name="characterName" placeholder="Nom du Personnage RP" value={formData.characterName} className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl focus:border-blue-500 outline-none transition-colors" onChange={handleInputChange} />
            <input required type="email" name="email" placeholder="Email" value={formData.email} className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl focus:border-blue-500 outline-none transition-colors" onChange={handleInputChange} />
            <input required type="password" name="password" placeholder="Mot de passe" value={formData.password} className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl focus:border-blue-500 outline-none transition-colors" onChange={handleInputChange} />
            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
              {loading ? 'Inscription...' : 'S\'enregistrer'}
            </button>
            <button type="button" onClick={() => setMode('selection')} className="w-full text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Retour</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
