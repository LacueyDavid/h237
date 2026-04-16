import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Compass, Clock, MessageCircle, Camera, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { attractions } from '../data/attractions';

const quickActions = [
  { to: '/carte', icon: Map, label: 'Carte', color: 'bg-jardin-500', desc: 'Explorer le parc' },
  { to: '/quetes', icon: Compass, label: 'Quêtes', color: 'bg-purple-500', desc: 'Parcours gamifiés' },
  { to: '/attractions', icon: Clock, label: 'Attentes', color: 'bg-blue-500', desc: 'Temps réel' },
  { to: '/chat', icon: MessageCircle, label: 'Guide IA', color: 'bg-gold-500', desc: 'Posez vos questions' },
  { to: '/ar', icon: Camera, label: 'AR', color: 'bg-pink-500', desc: 'Réalité augmentée' },
  { to: '/profil', icon: Trophy, label: 'Badges', color: 'bg-orange-500', desc: 'Vos récompenses' },
];

export function HomePage() {
  const { state } = useApp();

  const topAttractions = attractions
    .filter(a => a.waitMinutes > 0)
    .sort((a, b) => a.waitMinutes - b.waitMinutes)
    .slice(0, 3);

  return (
    <div className="px-4 py-4 space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-jardin-500 to-jardin-700 rounded-2xl p-5 text-white shadow-lg"
      >
        <p className="text-jardin-100 text-sm">Bienvenue au</p>
        <h2 className="text-2xl font-bold mb-1">Jardin d'Acclimatation</h2>
        <p className="text-jardin-100 text-sm">
          {state.user.visitedAttractions.length} attraction{state.user.visitedAttractions.length !== 1 ? 's' : ''} visitée{state.user.visitedAttractions.length !== 1 ? 's' : ''} · {state.user.completedQuests.length} quête{state.user.completedQuests.length !== 1 ? 's' : ''} terminée{state.user.completedQuests.length !== 1 ? 's' : ''}
        </p>
        <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((state.user.points % 100), 100)}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gold-400 rounded-full"
          />
        </div>
        <p className="text-xs text-jardin-100 mt-1">
          {100 - (state.user.points % 100)} pts avant le niveau {state.user.level + 1}
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Que voulez-vous faire ?</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={action.to}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`${action.color} w-10 h-10 rounded-full flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-700">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shortest Wait Times */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">⏱️ Moins d'attente</h3>
          <Link to="/attractions" className="text-jardin-600 text-sm font-medium">
            Voir tout →
          </Link>
        </div>
        <div className="space-y-2">
          {topAttractions.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100"
            >
              <span className="text-2xl">{a.image}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{a.name}</p>
                <p className="text-xs text-gray-500">{a.category}</p>
              </div>
              <div className={`text-sm font-bold px-2 py-1 rounded-lg ${
                a.waitMinutes <= 10 ? 'bg-jardin-100 text-jardin-700' :
                a.waitMinutes <= 20 ? 'bg-gold-100 text-gold-600' :
                'bg-red-100 text-red-600'
              }`}>
                {a.waitMinutes} min
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Quest */}
      {state.activeQuestId && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">🧭 Quête en cours</h3>
          <Link to="/quetes">
            {(() => {
              const quest = state.quests.find(q => q.id === state.activeQuestId);
              if (!quest) return null;
              const done = quest.steps.filter(s => s.completed).length;
              return (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{quest.icon}</span>
                    <span className="font-bold text-gray-800">{quest.title}</span>
                  </div>
                  <div className="bg-white/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${(done / quest.steps.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{done}/{quest.steps.length} étapes</p>
                </div>
              );
            })()}
          </Link>
        </div>
      )}

      {/* Fun Fact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gold-50 border border-gold-200 rounded-xl p-4"
      >
        <p className="text-sm font-semibold text-gold-600 mb-1">💡 Le saviez-vous ?</p>
        <p className="text-sm text-gray-600">
          Le Jardin d'Acclimatation a été inauguré par Napoléon III en 1860.
          C'est le plus ancien parc de loisirs de France !
        </p>
      </motion.div>
    </div>
  );
}
