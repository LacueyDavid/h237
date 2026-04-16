export interface Attraction {
  id: string;
  name: string;
  description: string;
  category: 'manege' | 'spectacle' | 'nature' | 'restauration' | 'jeu';
  lat: number;
  lng: number;
  waitMinutes: number;
  minAge?: number;
  minHeight?: number;
  accessible: boolean;
  image: string;
  icon: string;
  animals?: Animal[];
}

export interface Animal {
  name: string;
  species: string;
  bio: string;
  funFact: string;
  favoriteSpot: string;
  image: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  steps: QuestStep[];
  reward: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  duration: string;
  theme: 'nature' | 'aventure' | 'culture' | 'famille';
  icon: string;
}

export interface QuestStep {
  id: string;
  title: string;
  description: string;
  attractionId?: string;
  hint: string;
  completed: boolean;
  requiresPhoto?: boolean;
}

export interface Report {
  id: string;
  type: 'maintenance' | 'comportement' | 'enfant_perdu' | 'autre';
  description: string;
  location?: string;
  timestamp: Date;
  status: 'envoyé' | 'pris_en_charge' | 'résolu';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'urgent' | 'promo' | 'event';
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  avatar: string;
  points: number;
  level: number;
  completedQuests: string[];
  visitedAttractions: string[];
  wishlist: string[];
  accessibilityPrefs: AccessibilityPrefs;
}

export interface AccessibilityPrefs {
  wheelchair: boolean;
  reducedMobility: boolean;
  withChildren: boolean;
  childAge?: number;
}
