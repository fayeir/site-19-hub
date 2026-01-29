-- Script SQL pour corriger les politiques RLS
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- Supprimer les anciennes politiques si elles existent (optionnel, pour éviter les doublons)
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Ajouter la politique pour permettre l'insertion lors de l'inscription
-- Un utilisateur authentifié peut insérer son propre profil (avec son propre ID)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Vérifier que RLS est activé
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
