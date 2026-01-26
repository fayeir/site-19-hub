
export type UserGrade = 'Fondateur' | 'Responsable' | 'Développeur' | 'Loriste' | 'Joueur';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Stocké pour la simulation de base de données
  characterName: string;
  grade: UserGrade;
  clearance: number;
  joinedDate: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: 'Update' | 'Annonce' | 'Devlog';
}

export interface LoreEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  outcome: string;
}

export interface WikiSection {
  id: string;
  title: string;
  icon: 'rules' | 'science' | 'security' | 'tech' | 'admin' | 'play' | 'info';
  category: 'Général' | 'Départements' | 'Protocoles';
  description: string;
  content?: string;
}

export interface FullDatabase {
  users: User[];
  blog: BlogPost[];
  lore: LoreEvent[];
  wiki: WikiSection[];
}
