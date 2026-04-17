import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Compass, AlertTriangle, CalendarDays, Heart, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { attractions, categoryLabels } from '../data/attractions';
import { parkEvents } from '../data/events';
import { useState, useEffect } from 'react';
import type { Attraction } from '../data/types';

const quickActions = [
  { to: '/carte', icon: Map, label: 'Carte', color: 'bg-jardin-600', desc: 'Explorer le parc' },
  { to: '/quetes', icon: Compass, label: 'Quêtes', color: 'bg-manege-dark', desc: 'Parcours gamifiés' },
  { to: '/evenements', icon: CalendarDays, label: 'Événements', color: 'bg-ferme-sky', desc: 'Agenda du parc' },
  { to: '/signaler', icon: AlertTriangle, label: 'Signaler', color: 'bg-red-500', desc: 'Urgence' },
];

export function HomePage() {
  const { state, dispatch } = useApp();
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterCategory, setFilterCategory] = useState<Attraction['category'] | 'all'>('all');

  useEffect(() => {
    if (state.announcements.length <= 1) return;
    const timer = setInterval(() => {
      setAnnouncementIdx(i => (i + 1) % state.announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [state.announcements.length]);

  const currentAnnouncement = state.announcements[announcementIdx];

  return (
    <div className="px-4 py-4 space-y-5">

      {/* Hero Banner with Photo + Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden shadow-lg"
      >
        <img
          src="/hero-jardin.jpg"
          alt="Jardin d'Acclimatation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <div className="relative z-10 p-5 pt-8 pb-4">
          <p className="text-white/80 text-sm">Bienvenue au</p>
          <h2 className="text-2xl font-bold text-white mb-1">Jardin d'Acclimatation</h2>
          <div className="flex items-center gap-3 text-white/80 text-sm mb-3">
            <span>{state.user.visitedAttractions.length} attraction{state.user.visitedAttractions.length !== 1 ? 's' : ''}</span>
            <span>·</span>
            <span>{state.user.points} pts · Niv. {state.user.level}</span>
          </div>

          {/* Announcement overlay */}
          {currentAnnouncement && (
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <div className="flex items-center justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAnnouncement.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="font-bold text-sm text-white">{currentAnnouncement.title}</p>
                    <p className="text-xs text-white/70 mt-0.5 line-clamp-1">{currentAnnouncement.content}</p>
                  </motion.div>
                </AnimatePresence>
                {state.announcements.length > 1 && (
                  <div className="flex gap-1 ml-3 shrink-0">
                    <button
                      onClick={() => setAnnouncementIdx(i => (i - 1 + state.announcements.length) % state.announcements.length)}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <ChevronLeft className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={() => setAnnouncementIdx(i => (i + 1) % state.announcements.length)}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <ChevronRight className="w-3 h-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
              {state.announcements.length > 1 && (
                <div className="flex gap-1 mt-2 justify-center">
                  {state.announcements.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === announcementIdx ? 'bg-white' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
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

      {/* Temps d'attente */}
      {(() => {
        const withWait = attractions
          .filter(a => a.waitMinutes > 0)
          .filter(a => filterCategory === 'all' || a.category === filterCategory)
          .sort((a, b) => sortAsc ? a.waitMinutes - b.waitMinutes : b.waitMinutes - a.waitMinutes);
        const favAttractions = attractions.filter(a => state.user.wishlist.includes(a.id));
        const displayed = showAll ? withWait : withWait.slice(0, 3);
        return (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800">⏱️ Temps d'attente</h3>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="flex items-center gap-1 text-xs text-jardin-600 font-medium"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortAsc ? '↑ Croissant' : '↓ Décroissant'}
              </button>
            </div>

            {/* Category filters */}
            <div className="flex gap-1.5 items-center overflow-x-auto no-scrollbar mb-3">
              <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {(['all', 'manege', 'spectacle', 'nature', 'restauration', 'jeu'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    filterCategory === cat
                      ? 'bg-jardin-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Tout' : categoryLabels[cat]}
                </button>
              ))}
            </div>

            {/* Favoris */}
            {favAttractions.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">❤️ Mes favoris</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {favAttractions.map(a => (
                    <div key={a.id} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 shrink-0">
                      <span className="text-lg">{a.image}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">{a.name}</p>
                        <p className={`text-xs font-bold ${
                          a.waitMinutes === 0 ? 'text-jardin-600' :
                          a.waitMinutes <= 10 ? 'text-jardin-600' :
                          a.waitMinutes <= 20 ? 'text-gold-600' :
                          'text-red-600'
                        }`}>
                          {a.waitMinutes === 0 ? 'Libre' : `${a.waitMinutes} min`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {displayed.map((a, i) => {
                const isFav = state.user.wishlist.includes(a.id);
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
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
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', attractionId: a.id })}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {withWait.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-2 w-full py-2 text-sm font-semibold text-jardin-600 bg-jardin-50 rounded-xl hover:bg-jardin-100 transition-colors"
              >
                {showAll ? 'Voir moins' : `Voir tout (${withWait.length})`}
              </button>
            )}
          </div>
        );
      })()}

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
                <div className="bg-gradient-to-r from-manege-light/30 to-jardin-100 rounded-xl p-4 border border-manege-light">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{quest.icon}</span>
                    <span className="font-bold text-gray-800">{quest.title}</span>
                  </div>
                  <div className="bg-white/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-manege-dark rounded-full transition-all"
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



      {/* Upcoming Events */}
      {(() => {
        const now = new Date();
        const upcoming = parkEvents
          .filter(e => (e.endDate || e.date) >= now)
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .slice(0, 3);
        if (upcoming.length === 0) return null;
        return (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800">📅 Prochains événements</h3>
              <Link to="/evenements" className="text-jardin-600 text-sm font-medium">Voir tout →</Link>
            </div>
            <div className="space-y-2">
              {upcoming.map(e => (
                <Link key={e.id} to="/evenements">
                  <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <span className="text-2xl">{e.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{e.title}</p>
                      <p className="text-xs text-gray-400">
                        {e.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        {e.endDate ? ` → ${e.endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}` : ''}
                      </p>
                    </div>
                    {e.forKids && <span className="text-xs bg-gold-50 text-gold-600 px-2 py-0.5 rounded-full font-semibold">Enfants</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

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
