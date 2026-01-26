import { supabase } from './supabaseClient';
import { BlogPost, LoreEvent, WikiSection, User, FullDatabase } from '../types';
import { BLOG_POSTS, LORE_EVENTS, WIKI_SECTIONS } from '../constants';

// Tables Supabase
const TABLES = {
  users: 'users',
  blog: 'blog_posts',
  lore: 'lore_events',
  wiki: 'wiki_sections'
};

export const supabaseService = {
  // ============ AUTHENTIFICATION ============
  
  async signUp(email: string, password: string, username: string, characterName: string): Promise<{ user: User | null; error: string | null }> {
    try {
      // Inscription avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            character_name: characterName
          }
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Erreur lors de la création du compte' };
      }

      // Vérifier si c'est le premier utilisateur
      const { data: existingUsers } = await supabase
        .from(TABLES.users)
        .select('id')
        .limit(1);

      const isFirstUser = !existingUsers || existingUsers.length === 0;

      // Créer le profil utilisateur dans la table users
      const joinedDate = new Date().toLocaleDateString('fr-FR');
      const { error: insertError } = await supabase
        .from(TABLES.users)
        .insert([{
          id: authData.user.id,
          username,
          email,
          character_name: characterName,
          grade: isFirstUser ? 'Fondateur' : 'Joueur',
          clearance: isFirstUser ? 5 : 1,
          joined_date: joinedDate
        }]);

      if (insertError) {
        return { user: null, error: insertError.message };
      }

      const newUser: User = {
        id: authData.user.id,
        username,
        email,
        characterName,
        grade: isFirstUser ? 'Fondateur' : 'Joueur',
        clearance: isFirstUser ? 5 : 1,
        joinedDate
      };

      if (insertError) {
        return { user: null, error: insertError.message };
      }

      return { user: newUser, error: null };
    } catch (error: any) {
      return { user: null, error: error.message || 'Erreur inconnue' };
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Identifiants incorrects' };
      }

      // Récupérer les données utilisateur depuis la table users
      const { data: userData, error: userError } = await supabase
        .from(TABLES.users)
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError || !userData) {
        return { user: null, error: 'Profil utilisateur introuvable' };
      }

      // Mapper les colonnes de la base de données vers le type User
      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        characterName: userData.character_name,
        grade: userData.grade,
        clearance: userData.clearance,
        joinedDate: userData.joined_date
      };

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message || 'Erreur inconnue' };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return null;
      }

      const { data: userData } = await supabase
        .from(TABLES.users)
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!userData) return null;

      // Mapper les colonnes de la base de données vers le type User
      return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        characterName: userData.character_name,
        grade: userData.grade,
        clearance: userData.clearance,
        joinedDate: userData.joined_date
      };
    } catch {
      return null;
    }
  },

  // Écouter les changements d'authentification
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  },

  // ============ DONNÉES ============

  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from(TABLES.users)
      .select('*')
      .order('joinedDate', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }

    // Mapper les colonnes de la base de données vers le type User
    return (data || []).map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      characterName: u.character_name,
      grade: u.grade,
      clearance: u.clearance,
      joinedDate: u.joined_date
    })) as User[];
  },

  async saveUsers(users: User[]): Promise<{ error: string | null }> {
    // Mapper les User vers le format de la base de données
    const usersToSave = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      character_name: u.characterName,
      grade: u.grade,
      clearance: u.clearance,
      joined_date: u.joinedDate
    }));

    // Pour la mise à jour, on utilise upsert
    const { error } = await supabase
      .from(TABLES.users)
      .upsert(usersToSave, { onConflict: 'id' });

    return { error: error?.message || null };
  },

  async updateUserGrade(userId: string, newGrade: string, newClearance: number): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from(TABLES.users)
      .update({ grade: newGrade, clearance: newClearance })
      .eq('id', userId);

    return { error: error?.message || null };
  },

  async getBlog(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from(TABLES.blog)
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération du blog:', error);
      return BLOG_POSTS; // Fallback vers les constantes
    }

    return (data || BLOG_POSTS) as BlogPost[];
  },

  async saveBlog(blog: BlogPost[]): Promise<{ error: string | null }> {
    // Supprimer tous les posts existants et insérer les nouveaux
    await supabase.from(TABLES.blog).delete().neq('id', '');
    
    const { error } = await supabase
      .from(TABLES.blog)
      .insert(blog);

    return { error: error?.message || null };
  },

  async getLore(): Promise<LoreEvent[]> {
    const { data, error } = await supabase
      .from(TABLES.lore)
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération du lore:', error);
      return LORE_EVENTS; // Fallback
    }

    return (data || LORE_EVENTS) as LoreEvent[];
  },

  async saveLore(lore: LoreEvent[]): Promise<{ error: string | null }> {
    await supabase.from(TABLES.lore).delete().neq('id', '');
    
    const { error } = await supabase
      .from(TABLES.lore)
      .insert(lore);

    return { error: error?.message || null };
  },

  async getWiki(): Promise<WikiSection[]> {
    const { data, error } = await supabase
      .from(TABLES.wiki)
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération du wiki:', error);
      return WIKI_SECTIONS; // Fallback
    }

    return (data || WIKI_SECTIONS) as WikiSection[];
  },

  async saveWiki(wiki: WikiSection[]): Promise<{ error: string | null }> {
    await supabase.from(TABLES.wiki).delete().neq('id', '');
    
    const { error } = await supabase
      .from(TABLES.wiki)
      .insert(wiki);

    return { error: error?.message || null };
  },

  // Exportation JSON (pour compatibilité)
  async exportDatabase(): Promise<FullDatabase | null> {
    try {
      const [users, blog, lore, wiki] = await Promise.all([
        this.getUsers(),
        this.getBlog(),
        this.getLore(),
        this.getWiki()
      ]);

      return { users, blog, lore, wiki };
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return null;
    }
  }
};
