-- Trigger pour créer automatiquement un profil utilisateur dans la table users
-- quand un utilisateur s'inscrit via Supabase Auth
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- Fonction qui sera appelée après l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  -- Vérifier si c'est le premier utilisateur
  SELECT COUNT(*) = 0 INTO is_first_user FROM public.users;
  
  -- Insérer le profil utilisateur dans la table users
  INSERT INTO public.users (
    id,
    username,
    email,
    character_name,
    grade,
    clearance,
    joined_date
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Utilisateur'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'character_name', 'Personnage'),
    CASE WHEN is_first_user THEN 'Fondateur' ELSE 'Joueur' END,
    CASE WHEN is_first_user THEN 5 ELSE 1 END,
    TO_CHAR(NOW(), 'DD/MM/YYYY')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger qui s'exécute après l'insertion dans auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
