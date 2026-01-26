
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Wiki from './pages/Wiki';
import Blog from './pages/Blog';
import Lore from './pages/Lore';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { supabaseService } from './services/supabaseService';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'utilisateur actuel au chargement
    const checkUser = async () => {
      const currentUser = await supabaseService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabaseService.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = async () => {
    await supabaseService.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0d17] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl mb-4 mx-auto animate-pulse">S</div>
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/lore" element={<Lore />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/admin" 
            element={
              user && (user.grade === 'Fondateur' || user.grade === 'Responsable') 
              ? <AdminDashboard user={user} /> 
              : <Navigate to="/" />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
