import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { UserProfile, AccessibilityPrefs, Report, Announcement } from '../data/types';
import { quests as defaultQuests } from '../data/quests';
import type { Quest } from '../data/types';

interface AppState {
  user: UserProfile;
  quests: Quest[];
  reports: Report[];
  announcements: Announcement[];
  activeQuestId: string | null;
}

type Action =
  | { type: 'VISIT_ATTRACTION'; attractionId: string }
  | { type: 'COMPLETE_QUEST_STEP'; questId: string; stepId: string }
  | { type: 'SET_ACTIVE_QUEST'; questId: string | null }
  | { type: 'ADD_POINTS'; points: number }
  | { type: 'TOGGLE_WISHLIST'; attractionId: string }
  | { type: 'ADD_REPORT'; report: Report }
  | { type: 'UPDATE_ACCESSIBILITY'; prefs: Partial<AccessibilityPrefs> };

const initialAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: '🎉 Ouverture de la saison !',
    content: 'Le parc est ouvert tous les jours de 10h à 19h. Profitez des beaux jours !',
    type: 'info',
    timestamp: new Date(),
  },
  {
    id: 'a2',
    title: '🎠 Nouveau manège',
    content: 'Découvrez "Les Ailes du Jardin", notre toute nouvelle attraction familiale.',
    type: 'event',
    timestamp: new Date(),
  },
  {
    id: 'a3',
    title: '🐣 Naissances à la Ferme',
    content: 'Trois agneaux sont nés cette semaine à la Ferme Normande. Venez les découvrir !',
    type: 'info',
    timestamp: new Date(),
  },
];

const initialState: AppState = {
  user: {
    name: 'Visiteur',
    avatar: '🌳',
    points: 50,
    level: 1,
    completedQuests: [],
    visitedAttractions: [],
    wishlist: [],
    accessibilityPrefs: {
      wheelchair: false,
      reducedMobility: false,
      withChildren: false,
    },
  },
  quests: defaultQuests,
  reports: [],
  announcements: initialAnnouncements,
  activeQuestId: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'VISIT_ATTRACTION': {
      if (state.user.visitedAttractions.includes(action.attractionId)) return state;
      const visited = [...state.user.visitedAttractions, action.attractionId];
      return {
        ...state,
        user: {
          ...state.user,
          visitedAttractions: visited,
          points: state.user.points + 10,
        },
      };
    }
    case 'COMPLETE_QUEST_STEP': {
      const quests = state.quests.map(q => {
        if (q.id !== action.questId) return q;
        return {
          ...q,
          steps: q.steps.map(s =>
            s.id === action.stepId ? { ...s, completed: true } : s
          ),
        };
      });
      const quest = quests.find(q => q.id === action.questId);
      const allDone = quest?.steps.every(s => s.completed);
      return {
        ...state,
        quests,
        user: {
          ...state.user,
          points: state.user.points + 25,
          completedQuests: allDone && !state.user.completedQuests.includes(action.questId)
            ? [...state.user.completedQuests, action.questId]
            : state.user.completedQuests,
          level: Math.floor((state.user.points + 25) / 100) + 1,
        },
      };
    }
    case 'SET_ACTIVE_QUEST':
      return { ...state, activeQuestId: action.questId };
    case 'ADD_POINTS':
      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + action.points,
          level: Math.floor((state.user.points + action.points) / 100) + 1,
        },
      };
    case 'TOGGLE_WISHLIST': {
      const inList = state.user.wishlist.includes(action.attractionId);
      return {
        ...state,
        user: {
          ...state.user,
          wishlist: inList
            ? state.user.wishlist.filter(id => id !== action.attractionId)
            : [...state.user.wishlist, action.attractionId],
        },
      };
    }
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.report] };
    case 'UPDATE_ACCESSIBILITY':
      return {
        ...state,
        user: {
          ...state.user,
          accessibilityPrefs: { ...state.user.accessibilityPrefs, ...action.prefs },
        },
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
