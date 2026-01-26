
import { BlogPost, LoreEvent, WikiSection } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Mise à jour majeure : La Zone Technique',
    excerpt: 'Découvrez les nouveaux systèmes de gestion de l\'énergie et les garages souterrains.',
    // Added missing content property
    content: 'Le personnel technique est fier d\'annoncer le déploiement de la mise à jour 2.4. Les nouveaux systèmes de gestion d\'énergie permettent une meilleure stabilité du Site-19 lors des brèches de confinement et optimisent la consommation des générateurs auxiliaires.',
    date: '12 Juin 2024',
    author: 'Staff Technique',
    category: 'Update'
  },
  {
    id: '2',
    title: 'Recrutement : Département de la Sécurité',
    excerpt: 'Nous recherchons de nouveaux agents pour sécuriser les secteurs 3 et 4.',
    // Added missing content property
    content: 'Le Département de la Sécurité ouvre une nouvelle vague de recrutement. Les candidats doivent posséder une condition physique exemplaire, une résistance mémétique de niveau 3 minimum et une loyauté indéfectible envers les protocoles de la Fondation.',
    date: '10 Juin 2024',
    author: 'Direction',
    category: 'Annonce'
  }
];

export const LORE_EVENTS: LoreEvent[] = [
  {
    id: 'e1',
    title: 'L\'Incident du Canyon Rouge',
    date: 'Janvier 2024',
    description: 'Une faille spatiale a été détectée près de l\'antenne satellite principale.',
    outcome: 'Confinement réussi, zone placée sous surveillance radar constante.'
  },
  {
    id: 'e2',
    title: 'Brèche massive Secteur-G',
    date: 'Mars 2024',
    description: 'Défaillance des générateurs lors d\'un orage magnétique.',
    outcome: 'Protocole de verrouillage automatique activé. 0 pertes civiles.'
  }
];

export const WIKI_SECTIONS: WikiSection[] = [
  { id: '1', category: 'Général', title: 'Règlements', icon: 'rules', description: 'Les lois fondamentales régissant le comportement sur le site.' },
  { id: '6', category: 'Général', title: 'Comment jouer', icon: 'play', description: 'Guide d\'installation et de première connexion sur Roblox.' },
  { id: '2', category: 'Départements', title: 'Dép. Scientifique', icon: 'science', description: 'Recherche avancée et tests sur les entités anormales.' },
  { id: '3', category: 'Départements', title: 'Dép. Sécurité', icon: 'security', description: 'Maintien de l\'ordre et escortes de classe D.' },
  { id: '4', category: 'Départements', title: 'Dép. Technique', icon: 'tech', description: 'Maintenance des infrastructures et des générateurs.' },
  { id: '5', category: 'Protocoles', title: 'Administration', icon: 'admin', description: 'Gestion des ressources humaines et du Conseil O5.' },
  { id: '7', category: 'Protocoles', title: 'Codes d\'Alerte', icon: 'info', description: 'Signification des alarmes et procédures d\'urgence.' }
];
