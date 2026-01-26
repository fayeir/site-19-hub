# Guide de configuration - Site-19 Hub

## ✅ Modifications effectuées

### 1. Suppression des éléments IA
- ✅ Supprimé `pages/AIAssistant.tsx`
- ✅ Supprimé `services/geminiService.ts`
- ✅ Retiré la dépendance `@google/genai` de `package.json`
- ✅ Nettoyé les références dans `vite.config.ts` et `index.html`

### 2. Configuration Supabase
- ✅ Ajouté `@supabase/supabase-js` dans les dépendances
- ✅ Créé `services/supabaseClient.ts` pour initialiser le client Supabase
- ✅ Créé `services/supabaseService.ts` pour remplacer `storageService.ts`
- ✅ Toutes les pages ont été mises à jour pour utiliser Supabase

### 3. Authentification
- ✅ Système d'authentification migré vers Supabase Auth
- ✅ Inscription et connexion fonctionnelles
- ✅ Gestion de session automatique
- ✅ Déconnexion implémentée

### 4. Base de données
- ✅ Script SQL créé (`supabase-schema.sql`) pour créer les tables
- ✅ Script d'initialisation créé (`supabase-init-data.sql`) pour les données par défaut
- ✅ Tables créées : `users`, `blog_posts`, `lore_events`, `wiki_sections`
- ✅ Politiques RLS (Row Level Security) configurées

### 5. Configuration Vercel
- ✅ Fichier `vercel.json` créé
- ✅ Configuration pour les variables d'environnement

## 📋 Étapes de configuration

### Étape 1 : Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte (gratuit)
3. Créez un nouveau projet
4. Notez l'URL du projet et la clé anon (Settings > API)

### Étape 2 : Configurer la base de données

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Exécutez le contenu de `supabase-schema.sql` pour créer les tables
3. Exécutez le contenu de `supabase-init-data.sql` pour insérer les données initiales

### Étape 3 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

### Étape 4 : Installer les dépendances

```bash
npm install
```

### Étape 5 : Tester en local

```bash
npm run dev
```

L'application devrait être accessible sur `http://localhost:3000`

### Étape 6 : Déployer sur Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Dans les paramètres du projet Vercel, ajoutez les variables d'environnement :
   - `VITE_SUPABASE_URL` : votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` : votre clé anon Supabase
3. Déployez !

## 🔐 Sécurité

- Les mots de passe sont gérés de manière sécurisée par Supabase Auth
- Les politiques RLS (Row Level Security) sont activées
- Les utilisateurs peuvent seulement modifier leur propre profil
- Seuls les admins peuvent modifier le contenu (blog, lore, wiki)

## 📝 Notes importantes

- Le premier utilisateur créé devient automatiquement "Fondateur" avec clearance niveau 5
- Les données sont maintenant stockées dans Supabase (plus de localStorage)
- Le système d'authentification utilise Supabase Auth avec email/mot de passe
- Les fonctions Discord/Roblox sont toujours en maintenance (comme prévu)

## 🐛 Dépannage

### Erreur "Variables d'environnement Supabase manquantes"
- Vérifiez que votre fichier `.env.local` existe et contient les bonnes variables
- Redémarrez le serveur de développement après avoir modifié `.env.local`

### Erreur "Profil utilisateur introuvable"
- Vérifiez que les tables ont été créées correctement dans Supabase
- Vérifiez que le script `supabase-schema.sql` a été exécuté

### Erreur de connexion à Supabase
- Vérifiez que l'URL et la clé anon sont correctes
- Vérifiez que votre projet Supabase est actif
