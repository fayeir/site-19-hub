# Guide pour envoyer le projet sur GitHub

## Option 1 : Via l'interface GitHub (Recommandé si Git n'est pas installé)

1. **Créer un nouveau dépôt sur GitHub**
   - Allez sur [github.com](https://github.com)
   - Cliquez sur le bouton "+" en haut à droite
   - Sélectionnez "New repository"
   - Donnez un nom (ex: `site-19-hub`)
   - Ne cochez PAS "Initialize with README" (le projet existe déjà)
   - Cliquez sur "Create repository"

2. **Télécharger le projet en ZIP**
   - Compressez le dossier du projet
   - Sur la page de votre nouveau dépôt GitHub, cliquez sur "uploading an existing file"
   - Glissez-déposez tous les fichiers (sauf `node_modules` et `.env.local`)
   - Ajoutez un message de commit et cliquez sur "Commit changes"

## Option 2 : Via Git en ligne de commande (Si Git est installé)

### Étape 1 : Installer Git (si nécessaire)
- Téléchargez Git depuis [git-scm.com](https://git-scm.com/download/win)
- Installez-le avec les options par défaut

### Étape 2 : Initialiser le dépôt Git

Ouvrez PowerShell ou Git Bash dans le dossier du projet et exécutez :

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit: Site-19 Hub avec Supabase"
```

### Étape 3 : Créer le dépôt sur GitHub

1. Allez sur [github.com](https://github.com)
2. Créez un nouveau dépôt (sans initialiser avec README)
3. Copiez l'URL du dépôt (format: `https://github.com/votre-username/nom-du-repo.git`)

### Étape 4 : Connecter et pousser le code

```bash
# Ajouter le remote GitHub
git remote add origin https://github.com/votre-username/nom-du-repo.git

# Renommer la branche principale (si nécessaire)
git branch -M main

# Pousser le code
git push -u origin main
```

## Fichiers à ne PAS commiter

Les fichiers suivants sont déjà dans `.gitignore` et ne seront pas envoyés :
- `node_modules/` (dépendances npm)
- `.env.local` (vos clés Supabase - **IMPORTANT**)
- `dist/` (fichiers de build)
- Fichiers temporaires et de logs

## Après avoir poussé sur GitHub

1. **Configurer Vercel** :
   - Connectez votre dépôt GitHub à Vercel
   - Ajoutez les variables d'environnement dans Vercel :
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

2. **Partager le projet** :
   - Le code sera accessible sur GitHub
   - Les autres développeurs pourront cloner le projet
   - N'oubliez pas de leur donner les instructions pour configurer leur propre `.env.local`

## Notes importantes

⚠️ **NE COMMITEZ JAMAIS** :
- Le fichier `.env.local` (contient vos clés secrètes)
- Vos clés API personnelles
- Les fichiers de configuration sensibles

✅ **Fichiers à commiter** :
- Tous les fichiers source (`.tsx`, `.ts`, `.css`, etc.)
- `package.json` et `package-lock.json`
- Les fichiers de configuration (`tsconfig.json`, `vite.config.ts`, etc.)
- Les scripts SQL (`supabase-schema.sql`, `supabase-init-data.sql`)
- La documentation (`README.md`, `SETUP.md`)
