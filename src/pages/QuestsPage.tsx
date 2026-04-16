import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ChevronRight, CheckCircle2, Circle, Sparkles, MapPin, Camera } from 'lucide-react';
import { useState } from 'react';
import { attractions } from '../data/attractions';
import { Link } from 'react-router-dom';

const RANK_NAMES = ['Explorateur', 'Aventurier', 'Gardien du Jardin', 'Légende du Parc'];
const RANK_THRESHOLDS = [0, 3, 7, 15];
const RANK_ICONS = ['🌱', '⚡', '🛡️', '👑'];

function getRank(totalVisits: number) {
  let rank = 0;
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalVisits >= RANK_THRESHOLDS[i]) { rank = i; break; }
  }
  return { name: RANK_NAMES[rank], index: rank, next: rank < RANK_NAMES.length - 1 ? RANK_NAMES[rank + 1] : null, visitsToNext: rank < RANK_THRESHOLDS.length - 1 ? RANK_THRESHOLDS[rank + 1] - totalVisits : 0 };
}

const difficultyColors = {
  facile: 'bg-jardin-100 text-jardin-700',
  moyen: 'bg-gold-100 text-gold-600',
  difficile: 'bg-red-100 text-red-600',
};

const themeColors = {
  nature: 'from-jardin-400 to-emerald-500',
  aventure: 'from-purple-500 to-indigo-600',
  culture: 'from-gold-400 to-orange-500',
  famille: 'from-pink-400 to-rose-500',
};

export function QuestsPage() {
  const { state, dispatch } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(state.activeQuestId);
  const rank = getRank(state.user.totalVisits);

  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">🧭 Quêtes & Aventure</h2>
        <p className="text-sm text-gray-500">Progressez, gagnez des récompenses et montez en rang !</p>
      </div>

      {/* Carnet d'Aventurier */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3"
      >
        <h3 className="text-sm font-bold text-gray-800">📖 Mon Carnet d'Aventurier</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Rang actuel</p>
            <p className="text-sm font-bold text-purple-600">{RANK_ICONS[rank.index]} {rank.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Visites</p>
            <p className="text-sm font-bold text-jardin-600">{state.user.totalVisits}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Streak 🔥</p>
            <p className="text-sm font-bold text-orange-500">{state.user.streak}x</p>
          </div>
        </div>
        {rank.next && (
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>{rank.name}</span>
              <span>{rank.next} (encore {rank.visitsToNext} visite{rank.visitsToNext > 1 ? 's' : ''})</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all"
                style={{ width: `${Math.min(((state.user.totalVisits - RANK_THRESHOLDS[rank.index]) / (RANK_THRESHOLDS[rank.index + 1] - RANK_THRESHOLDS[rank.index])) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {state.user.streak >= 2 && (
          <p className="text-[10px] text-gold-500 font-medium">
            🔥 Streak de {state.user.streak} visites ! {state.user.streak >= 5 ? '+50 pts bonus' : state.user.streak >= 3 ? '+25 pts bonus' : 'Encore 1 visite pour le bonus !'}
          </p>
        )}

        {/* Adopted Animal */}
        {state.user.adoptedAnimal ? (
          <div className="bg-jardin-50 rounded-xl p-3 border border-jardin-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Mon compagnon</p>
                <p className="text-sm font-bold text-jardin-700">
                  {(() => {
                    const attr = attractions.find(a => a.id === state.user.adoptedAnimal!.attractionId);
                    const animal = attr?.animals?.find(a => a.name === state.user.adoptedAnimal!.animalName);
                    return `${animal?.image || '🐾'} ${state.user.adoptedAnimal.animalName}`;
                  })()}
                </p>
                <p className="text-[10px] text-gray-400">Nourri {state.user.adoptedAnimal.feedCount} fois</p>
              </div>
              <button
                onClick={() => dispatch({ type: 'FEED_ANIMAL' })}
                className="px-3 py-1.5 rounded-lg bg-jardin-500 text-white text-xs font-bold shadow-sm"
              >
                🍎 Nourrir (+5 pts)
              </button>
            </div>
          </div>
        ) : (
          <Link to="/carte" className="block bg-purple-50 rounded-xl p-3 border border-purple-100">
            <p className="text-xs font-semibold text-purple-700">🐾 Adoptez un animal !</p>
            <p className="text-[10px] text-purple-500">Visitez la Volière ou la Ferme pour adopter un compagnon</p>
          </Link>
        )}
      </motion.div>

      {/* Quests list */}
      <div className="space-y-3">
        {state.quests.map(quest => {
          const completedSteps = quest.steps.filter(s => s.completed).length;
          const isExpanded = expandedId === quest.id;
          const isActive = state.activeQuestId === quest.id;
          const isCompleted = state.user.completedQuests.includes(quest.id);
          const progress = (completedSteps / quest.steps.length) * 100;

          return (
            <motion.div
              key={quest.id}
              layout
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                isActive ? 'border-jardin-300 ring-2 ring-jardin-100' : 'border-gray-100'
              }`}
            >
              {/* Quest Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : quest.id)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${themeColors[quest.theme]} flex items-center justify-center text-2xl shadow-sm`}>
                  {quest.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{quest.title}</h3>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-jardin-500 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${difficultyColors[quest.difficulty]}`}>
                      {quest.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">⏱ {quest.duration}</span>
                    <span className="text-xs text-gray-400">{completedSteps}/{quest.steps.length}</span>
                  </div>
                  <div className="mt-1.5 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-jardin-400 to-jardin-600 rounded-full"
                    />
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-xs text-gray-500">{quest.description}</p>

                      {/* Steps */}
                      <div className="space-y-2">
                        {quest.steps.map((step, i) => {
                          const attraction = step.attractionId
                            ? attractions.find(a => a.id === step.attractionId)
                            : null;
                          return (
                            <div
                              key={step.id}
                              className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                                step.completed ? 'bg-jardin-50' : 'bg-gray-50'
                              }`}
                            >
                              <button
                                onClick={() => {
                                  if (!step.completed) {
                                    dispatch({ type: 'COMPLETE_QUEST_STEP', questId: quest.id, stepId: step.id });
                                  }
                                }}
                                className="mt-0.5 shrink-0"
                              >
                                {step.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-jardin-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-300 hover:text-jardin-400" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold ${step.completed ? 'text-jardin-700 line-through' : 'text-gray-800'}`}>
                                  {i + 1}. {step.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                                {attraction && (
                                  <div className="flex items-center gap-1 mt-1 text-xs text-jardin-600">
                                    <MapPin className="w-3 h-3" />
                                    {attraction.name}
                                  </div>
                                )}
                                {!step.completed && (
                                  <p className="text-[10px] text-gold-500 mt-1 italic">💡 {step.hint}</p>
                                )}
                                {!step.completed && step.requiresPhoto && (
                                  <button
                                    onClick={() => dispatch({ type: 'COMPLETE_QUEST_STEP', questId: quest.id, stepId: step.id })}
                                    className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-sm"
                                  >
                                    <Camera className="w-3.5 h-3.5" />
                                    📸 Prendre une photo
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Button */}
                      {!isCompleted && (
                        <button
                          onClick={() => dispatch({ type: 'SET_ACTIVE_QUEST', questId: isActive ? null : quest.id })}
                          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isActive
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-gradient-to-r from-jardin-500 to-jardin-600 text-white shadow-md'
                          }`}
                        >
                          {isActive ? 'Mettre en pause' : '🚀 Commencer cette quête'}
                        </button>
                      )}
                      {isCompleted && (
                        <div className="flex items-center justify-center gap-2 py-2 text-sm text-jardin-600 font-semibold">
                          <Sparkles className="w-4 h-4" />
                          Quête terminée ! {quest.reward}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
