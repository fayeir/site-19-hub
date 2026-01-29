-- Script pour créer les profils manquants pour les utilisateurs existants dans Auth
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- Ce script crée les entrées manquantes dans la table users pour les comptes Auth existants

-- Insérer les utilisateurs Auth qui n'ont pas encore de profil dans users
INSERT INTO public.users (
  id,
  username,
  email,
  character_name,
  grade,
  clearance,
  joined_date
)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'username', 'Utilisateur ' || SUBSTRING(au.id::text, 1, 8)),
  au.email,
  COALESCE(au.raw_user_meta_data->>'character_name', 'Personnage'),
  CASE 
    WHEN (SELECT COUNT(*) FROM public.users) = 0 THEN 'Fondateur'
    ELSE 'Joueur'
  END,
  CASE 
    WHEN (SELECT COUNT(*) FROM public.users) = 0 THEN 5
    ELSE 1
  END,
  TO_CHAR(au.created_at, 'DD/MM/YYYY')
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;
