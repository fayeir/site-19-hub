-- Script SQL pour créer les tables Supabase
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  character_name TEXT NOT NULL,
  grade TEXT NOT NULL DEFAULT 'Joueur' CHECK (grade IN ('Fondateur', 'Responsable', 'Développeur', 'Loriste', 'Joueur')),
  clearance INTEGER NOT NULL DEFAULT 1 CHECK (clearance >= 1 AND clearance <= 5),
  joined_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Update', 'Annonce', 'Devlog')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des événements de lore
CREATE TABLE IF NOT EXISTS lore_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des sections wiki
CREATE TABLE IF NOT EXISTS wiki_sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT NOT NULL CHECK (icon IN ('rules', 'science', 'security', 'tech', 'admin', 'play', 'info')),
  category TEXT NOT NULL CHECK (category IN ('Général', 'Départements', 'Protocoles')),
  description TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Politique RLS (Row Level Security) pour les utilisateurs
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir tous les autres utilisateurs
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

-- Les utilisateurs peuvent insérer leur propre profil lors de l'inscription
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Politique RLS pour les articles de blog
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les articles
CREATE POLICY "Anyone can read blog posts" ON blog_posts
  FOR SELECT USING (true);

-- Seuls les admins peuvent modifier (à configurer selon vos besoins)
CREATE POLICY "Admins can modify blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.grade IN ('Fondateur', 'Responsable')
    )
  );

-- Politique RLS pour les événements de lore
ALTER TABLE lore_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lore events" ON lore_events
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify lore events" ON lore_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.grade IN ('Fondateur', 'Responsable')
    )
  );

-- Politique RLS pour les sections wiki
ALTER TABLE wiki_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wiki sections" ON wiki_sections
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify wiki sections" ON wiki_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.grade IN ('Fondateur', 'Responsable')
    )
  );

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lore_events_updated_at BEFORE UPDATE ON lore_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wiki_sections_updated_at BEFORE UPDATE ON wiki_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
