import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// Vérifier que les variables sont valides
const isValidUrl = supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'));
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 0;

if (!isValidUrl || !isValidKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes ou invalides.');
  console.error('Vérifiez votre fichier .env.local et assurez-vous que :');
  console.error('- VITE_SUPABASE_URL commence par https://');
  console.error('- VITE_SUPABASE_ANON_KEY est défini');
  console.error('L\'application ne pourra pas se connecter à Supabase.');
}

// Créer le client seulement si les variables sont valides
// Sinon, créer un client avec des valeurs invalides qui échouera proprement
export const supabase = isValidUrl && isValidKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'x-client-info': 'site-19-hub'
        }
      }
    })
  : createClient('https://invalid.supabase.co', 'invalid-key');
