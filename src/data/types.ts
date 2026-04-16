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
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'exploration' | 'quete' | 'social' | 'defi';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  avatar: string;
  points: number;
  level: number;
  badges: string[];
  completedQuests: string[];
  visitedAttractions: string[];
  accessibilityPrefs: AccessibilityPrefs;
}

export interface AccessibilityPrefs {
  wheelchair: boolean;
  reducedMobility: boolean;
  visualImpairment: boolean;
  hearingImpairment: boolean;
  withChildren: boolean;
  childAge?: number;
}
