import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Compass, Route, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { attractions } from '../data/attractions';
import { useState, useEffect } from 'react';

const quickActions = [
  { to: '/carte', icon: Map, label: 'Carte', color: 'bg-jardin-500', desc: 'Explorer le parc' },
  { to: '/quetes', icon: Compass, label: 'Quêtes', color: 'bg-purple-500', desc: 'Parcours gamifiés' },
  { to: '/parcours', icon: Route, label: 'Mon Parcours', color: 'bg-blue-500', desc: 'Wishlist & trajet' },
  { to: '/signaler', icon: AlertTriangle, label: 'Signaler', color: 'bg-red-500', desc: 'Urgence' },
];

export function HomePage() {
  const { state } = useApp();
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  useEffect(() => {
    if (state.announcements.length <= 1) return;
    const timer = setInterval(() => {
      setAnnouncementIdx(i => (i + 1) % state.announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [state.announcements.length]);

  const topAttractions = attractions
    .filter(a => a.waitMinutes > 0)
    .sort((a, b) => a.waitMinutes - b.waitMinutes)
    .slice(0, 3);

  const currentAnnouncement = state.announcements[announcementIdx];

  return (
    <div className="px-4 py-4 space-y-5">

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
          {state.user.points} points · Niveau {state.user.level}
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Que voulez-vous faire ?</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={action.to}
                className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`${action.color} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-700 block">{action.label}</span>
                  <span className="text-[10px] text-gray-400">{action.desc}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shortest Wait Times */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">⏱️ Moins d'attente</h3>
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

      {/* Wishlist preview */}
      {state.user.wishlist.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800">❤️ Ma Wishlist</h3>
            <Link to="/parcours" className="text-jardin-600 text-sm font-medium">Voir parcours →</Link>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {state.user.wishlist.map(id => {
              const a = attractions.find(a => a.id === id);
              if (!a) return null;
              return (
                <div key={id} className="shrink-0 bg-white rounded-xl p-3 shadow-sm border border-gray-100 w-28 text-center">
                  <span className="text-2xl">{a.image}</span>
                  <p className="text-xs font-semibold text-gray-700 mt-1 truncate">{a.name}</p>
                  {a.waitMinutes > 0 && (
                    <p className="text-[10px] text-gray-400">⏱ {a.waitMinutes} min</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Announcements Banner */}
      {currentAnnouncement && (
        <motion.div
          key={currentAnnouncement.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-3 border ${
            currentAnnouncement.type === 'urgent'
              ? 'bg-red-50 border-red-200'
              : currentAnnouncement.type === 'event'
              ? 'bg-purple-50 border-purple-200'
              : 'bg-gold-50 border-gold-200'
          }`}
        >
          <p className="font-bold text-sm text-gray-800">{currentAnnouncement.title}</p>
          <p className="text-xs text-gray-600 mt-0.5">{currentAnnouncement.content}</p>
          {state.announcements.length > 1 && (
            <div className="flex gap-1 mt-2 justify-center">
              {state.announcements.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === announcementIdx ? 'bg-jardin-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
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
