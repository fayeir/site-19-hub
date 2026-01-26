
import React, { useState, useEffect } from 'react';
import { User, UserGrade, BlogPost, LoreEvent, WikiSection, FullDatabase } from '../types';
import { supabaseService } from '../services/supabaseService';
import { Icons } from '../components/Icons';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'blog' | 'lore' | 'wiki' | 'system'>('users');
  const [db, setDb] = useState<FullDatabase>({ users: [], blog: [], lore: [], wiki: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [users, blog, lore, wiki] = await Promise.all([
        supabaseService.getUsers(),
        supabaseService.getBlog(),
        supabaseService.getLore(),
        supabaseService.getWiki()
      ]);
      setDb({ users, blog, lore, wiki });
      setLoading(false);
    };
    loadData();
  }, [activeTab]);

  const grades: UserGrade[] = ['Fondateur', 'Responsable', 'Développeur', 'Loriste', 'Joueur'];
  const clearanceMap: Record<UserGrade, number> = {
    'Fondateur': 5,
    'Responsable': 4,
    'Développeur': 3,
    'Loriste': 2,
    'Joueur': 1
  };
  const canManageSystem = user.grade === 'Fondateur';

  const updateUserGrade = async (userId: string, newGrade: UserGrade) => {
    const newClearance = clearanceMap[newGrade];
    const { error } = await supabaseService.updateUserGrade(userId, newGrade, newClearance);
    
    if (error) {
      alert(`Erreur: ${error}`);
      return;
    }

    // Mettre à jour l'état local
    const updatedUsers = db.users.map(u => 
      u.id === userId ? { ...u, grade: newGrade, clearance: newClearance } : u
    );
    setDb({ ...db, users: updatedUsers });
  };

  const handleExport = async () => {
    const database = await supabaseService.exportDatabase();
    if (!database) {
      alert("Erreur lors de l'export de la base de données.");
      return;
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(database, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "site19_database.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as FullDatabase;
        
        // Sauvegarder dans Supabase
        await Promise.all([
          supabaseService.saveUsers(json.users),
          supabaseService.saveBlog(json.blog),
          supabaseService.saveLore(json.lore),
          supabaseService.saveWiki(json.wiki)
        ]);
        
        setDb(json);
        alert("Base de données importée avec succès !");
      } catch (err) {
        alert("Fichier JSON invalide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#0b0d17] pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">Dashboard</h1>
            <p className="text-gray-500 text-sm">Gestion centralisée du Site-19 • Accréditation {user.grade}</p>
          </div>
          {canManageSystem && (
            <button onClick={handleExport} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all">
              Exporter JSON
            </button>
          )}
        </div>

        <div className="flex gap-8 mb-12 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
          {[
            { id: 'users', label: 'Membres' },
            { id: 'blog', label: 'Actualités' },
            { id: 'lore', label: 'Lore' },
            { id: 'wiki', label: 'Wiki' },
            { id: 'system', label: 'Système' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap pb-4 transition-all ${
                activeTab === tab.id ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#151a26] rounded-[40px] border border-white/5 p-12 shadow-2xl">
          {loading && (
            <div className="text-center py-20 text-gray-600 italic">Chargement...</div>
          )}
          
          {!loading && activeTab === 'users' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold italic uppercase">Répertoire du Personnel</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase text-gray-500 border-b border-white/5">
                    <th className="pb-6">Personnel</th>
                    <th className="pb-6">Email</th>
                    <th className="pb-6">Grade</th>
                    <th className="pb-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {db.users.map(u => (
                    <tr key={u.id}>
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xs">{u.characterName[0]}</div>
                          <div>
                            <div className="text-sm font-bold uppercase">{u.characterName}</div>
                            <div className="text-[10px] text-gray-500">ID: {u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 text-sm text-gray-500">{u.email}</td>
                      <td className="py-6">
                        <select 
                          disabled={u.id === user.id}
                          value={u.grade}
                          onChange={(e) => updateUserGrade(u.id, e.target.value as UserGrade)}
                          className="bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-[10px] font-black uppercase text-blue-500 outline-none"
                        >
                          {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </td>
                      <td className="py-6 text-right">
                         <button className="text-red-500/50 hover:text-red-500 text-[10px] font-black uppercase">Exclure</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && activeTab === 'system' && (
            <div className="space-y-12">
              <h2 className="text-2xl font-bold italic uppercase">Gestion de la Base de Données</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 p-10 rounded-[32px] border border-white/5">
                  <h3 className="text-lg font-bold uppercase mb-4">Exporter les données</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed italic">Téléchargez l'intégralité du site (utilisateurs, articles, wiki) dans un fichier JSON réel pour sauvegarde.</p>
                  <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Télécharger database.json</button>
                </div>
                <div className="bg-white/5 p-10 rounded-[32px] border border-white/5">
                  <h3 className="text-lg font-bold uppercase mb-4">Importer les données</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed italic">Chargez un fichier JSON précédemment exporté pour restaurer le site instantanément.</p>
                  <label className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer inline-block">
                    Sélectionner un fichier
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {!loading && activeTab === 'blog' && <div className="text-center py-20 text-gray-600 italic">Éditeur d'actualités JSON en cours de développement.</div>}
          {!loading && activeTab === 'lore' && <div className="text-center py-20 text-gray-600 italic">Éditeur de Lore JSON en cours de développement.</div>}
          {!loading && activeTab === 'wiki' && <div className="text-center py-20 text-gray-600 italic">Éditeur de Wiki JSON en cours de développement.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
