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

      // Attendre un peu pour que le trigger crée le profil (si trigger configuré)
      // Sinon, créer manuellement le profil
      await new Promise(resolve => setTimeout(resolve, 500));

      // Vérifier si le profil existe déjà (créé par le trigger)
      let userData = null;
      const { data: existingProfile } = await supabase
        .from(TABLES.users)
        .select('id, username, email, character_name, grade, clearance, joined_date')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (existingProfile) {
        // Le profil a été créé par le trigger
        userData = existingProfile;
      } else {
        // Créer manuellement le profil si le trigger n'existe pas
        const { data: existingUsers } = await supabase
          .from(TABLES.users)
          .select('id')
          .limit(1);

        const isFirstUser = !existingUsers || existingUsers.length === 0;
        const joinedDate = new Date().toLocaleDateString('fr-FR');

        const { data: insertedProfile, error: insertError } = await supabase
          .from(TABLES.users)
          .insert([{
            id: authData.user.id,
            username,
            email,
            character_name: characterName,
            grade: isFirstUser ? 'Fondateur' : 'Joueur',
            clearance: isFirstUser ? 5 : 1,
            joined_date: joinedDate
          }])
          .select('id, username, email, character_name, grade, clearance, joined_date')
          .single();

        if (insertError) {
          console.error('Erreur lors de la création du profil:', insertError);
          return { user: null, error: `Erreur lors de la création du profil: ${insertError.message}` };
        }

        userData = insertedProfile;
      }

      // Mapper vers le type User
      const newUser: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        characterName: userData.character_name,
        grade: userData.grade,
        clearance: userData.clearance,
        joinedDate: userData.joined_date
      };

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
        .select('id, username, email, character_name, grade, clearance, joined_date')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (userError) {
        console.error('Erreur lors de la récupération du profil:', userError);
        return { user: null, error: 'Erreur lors de la récupération du profil' };
      }

      if (!userData) {
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
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.warn('Erreur auth:', authError);
        return null;
      }
      
      if (!authUser) {
        return null;
      }

      const { data: userData, error } = await supabase
        .from(TABLES.users)
        .select('id, username, email, character_name, grade, clearance, joined_date')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        // Ne pas bloquer si l'erreur est 406 ou si l'utilisateur n'existe pas encore
        if (error.code === 'PGRST116' || error.message?.includes('406')) {
          console.warn('Profil utilisateur non trouvé dans la table users');
          return null;
        }
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
      }

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
    try {
      const { data, error } = await supabase
        .from(TABLES.blog)
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.warn('Erreur lors de la récupération du blog depuis Supabase:', error);
        console.log('Utilisation des données par défaut (constantes)');
        return BLOG_POSTS; // Fallback vers les constantes
      }

      if (!data || data.length === 0) {
        console.log('Aucune donnée dans Supabase, utilisation des constantes');
        return BLOG_POSTS;
      }

      console.log(`✅ ${data.length} articles de blog chargés depuis Supabase`);
      return data as BlogPost[];
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération du blog:', error);
      return BLOG_POSTS;
    }
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
    try {
      const { data, error } = await supabase
        .from(TABLES.lore)
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.warn('Erreur lors de la récupération du lore depuis Supabase:', error);
        console.log('Utilisation des données par défaut (constantes)');
        return LORE_EVENTS; // Fallback
      }

      if (!data || data.length === 0) {
        console.log('Aucune donnée dans Supabase, utilisation des constantes');
        return LORE_EVENTS;
      }

      console.log(`✅ ${data.length} événements de lore chargés depuis Supabase`);
      return data as LoreEvent[];
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération du lore:', error);
      return LORE_EVENTS;
    }
  },

  async saveLore(lore: LoreEvent[]): Promise<{ error: string | null }> {
    await supabase.from(TABLES.lore).delete().neq('id', '');
    
    const { error } = await supabase
      .from(TABLES.lore)
      .insert(lore);

    return { error: error?.message || null };
  },

  async getWiki(): Promise<WikiSection[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.wiki)
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.warn('Erreur lors de la récupération du wiki depuis Supabase:', error);
        console.log('Utilisation des données par défaut (constantes)');
        return WIKI_SECTIONS; // Fallback
      }

      if (!data || data.length === 0) {
        console.log('Aucune donnée dans Supabase, utilisation des constantes');
        return WIKI_SECTIONS;
      }

      console.log(`✅ ${data.length} sections wiki chargées depuis Supabase`);
      return data as WikiSection[];
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération du wiki:', error);
      return WIKI_SECTIONS;
    }
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
