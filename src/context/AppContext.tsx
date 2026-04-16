import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { UserProfile, AccessibilityPrefs, ChatMessage } from '../data/types';
import { badges as defaultBadges } from '../data/badges';
import { quests as defaultQuests } from '../data/quests';
import type { Badge, Quest } from '../data/types';

interface AppState {
  user: UserProfile;
  badges: Badge[];
  quests: Quest[];
  chatMessages: ChatMessage[];
  activeQuestId: string | null;
}

type Action =
  | { type: 'VISIT_ATTRACTION'; attractionId: string }
  | { type: 'COMPLETE_QUEST_STEP'; questId: string; stepId: string }
  | { type: 'SET_ACTIVE_QUEST'; questId: string | null }
  | { type: 'ADD_POINTS'; points: number }
  | { type: 'UNLOCK_BADGE'; badgeId: string }
  | { type: 'ADD_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'UPDATE_ACCESSIBILITY'; prefs: Partial<AccessibilityPrefs> };

const initialState: AppState = {
  user: {
    name: 'Visiteur',
    avatar: '🌳',
    points: 50,
    level: 1,
    badges: ['premier-pas'],
    completedQuests: [],
    visitedAttractions: [],
    accessibilityPrefs: {
      wheelchair: false,
      reducedMobility: false,
      visualImpairment: false,
      hearingImpairment: false,
      withChildren: false,
    },
  },
  badges: defaultBadges,
  quests: defaultQuests,
  chatMessages: [],
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
    case 'UNLOCK_BADGE': {
      if (state.user.badges.includes(action.badgeId)) return state;
      return {
        ...state,
        user: { ...state.user, badges: [...state.user.badges, action.badgeId] },
        badges: state.badges.map(b =>
          b.id === action.badgeId
            ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() }
            : b
        ),
      };
    }
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.message] };
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
