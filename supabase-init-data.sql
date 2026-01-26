-- Script SQL pour insérer les données initiales
-- À exécuter dans l'éditeur SQL de votre projet Supabase après avoir créé les tables

-- Données initiales pour le blog
INSERT INTO blog_posts (id, title, excerpt, content, date, author, category) VALUES
('1', 'Mise à jour majeure : La Zone Technique', 'Découvrez les nouveaux systèmes de gestion de l''énergie et les garages souterrains.', 'Le personnel technique est fier d''annoncer le déploiement de la mise à jour 2.4. Les nouveaux systèmes de gestion d''énergie permettent une meilleure stabilité du Site-19 lors des brèches de confinement et optimisent la consommation des générateurs auxiliaires.', '12 Juin 2024', 'Staff Technique', 'Update'),
('2', 'Recrutement : Département de la Sécurité', 'Nous recherchons de nouveaux agents pour sécuriser les secteurs 3 et 4.', 'Le Département de la Sécurité ouvre une nouvelle vague de recrutement. Les candidats doivent posséder une condition physique exemplaire, une résistance mémétique de niveau 3 minimum et une loyauté indéfectible envers les protocoles de la Fondation.', '10 Juin 2024', 'Direction', 'Annonce')
ON CONFLICT (id) DO NOTHING;

-- Données initiales pour le lore
INSERT INTO lore_events (id, title, date, description, outcome) VALUES
('e1', 'L''Incident du Canyon Rouge', 'Janvier 2024', 'Une faille spatiale a été détectée près de l''antenne satellite principale.', 'Confinement réussi, zone placée sous surveillance radar constante.'),
('e2', 'Brèche massive Secteur-G', 'Mars 2024', 'Défaillance des générateurs lors d''un orage magnétique.', 'Protocole de verrouillage automatique activé. 0 pertes civiles.')
ON CONFLICT (id) DO NOTHING;

-- Données initiales pour le wiki
INSERT INTO wiki_sections (id, category, title, icon, description) VALUES
('1', 'Général', 'Règlements', 'rules', 'Les lois fondamentales régissant le comportement sur le site.'),
('6', 'Général', 'Comment jouer', 'play', 'Guide d''installation et de première connexion sur Roblox.'),
('2', 'Départements', 'Dép. Scientifique', 'science', 'Recherche avancée et tests sur les entités anormales.'),
('3', 'Départements', 'Dép. Sécurité', 'security', 'Maintien de l''ordre et escortes de classe D.'),
('4', 'Départements', 'Dép. Technique', 'tech', 'Maintenance des infrastructures et des générateurs.'),
('5', 'Protocoles', 'Administration', 'admin', 'Gestion des ressources humaines et du Conseil O5.'),
('7', 'Protocoles', 'Codes d''Alerte', 'info', 'Signification des alarmes et procédures d''urgence.')
ON CONFLICT (id) DO NOTHING;
