# Site-19 Hub

Portail communautaire pour le serveur SCP RP avec gestion de base de données Supabase.

## Prérequis

- Node.js (version 18 ou supérieure)
- Un compte Supabase (gratuit)
- Un compte Vercel pour l'hébergement

## Configuration

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Dans votre projet Supabase, allez dans **SQL Editor**
3. Exécutez le script SQL fourni dans `supabase-schema.sql` pour créer les tables nécessaires
4. Récupérez vos clés d'API :
   - Allez dans **Settings** > **API**
   - Copiez l'**URL du projet** et la **clé anon/public**

### 3. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

**Important :** Ne commitez jamais le fichier `.env.local` (il est déjà dans `.gitignore`)

### 4. Configuration Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Dans les paramètres du projet Vercel, ajoutez les variables d'environnement :
   - `VITE_SUPABASE_URL` : votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` : votre clé anon Supabase
3. Déployez !

## Développement local

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Build pour production

```bash
npm run build
```

## Structure de la base de données

Le projet utilise Supabase avec les tables suivantes :
- `users` : Gestion des utilisateurs et authentification
- `blog_posts` : Articles de blog/actualités
- `lore_events` : Événements historiques du lore
- `wiki_sections` : Sections du wiki

## Fonctionnalités

- ✅ Authentification sécurisée avec Supabase Auth
- ✅ Gestion des utilisateurs avec système de grades
- ✅ Blog/Actualités
- ✅ Archives Lore
- ✅ Wiki central
- ✅ Dashboard administrateur
- ✅ Export/Import de base de données JSON

## Notes importantes

- Le premier utilisateur créé devient automatiquement "Fondateur" avec clearance niveau 5
- Les mots de passe sont gérés de manière sécurisée par Supabase Auth
- Les données sont stockées dans Supabase (plus de localStorage)
