import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Trophy, MapPin, Compass, Star, Settings, Accessibility } from 'lucide-react';
import { useState } from 'react';

const categoryIcons: Record<string, string> = {
  exploration: '🗺️',
  quete: '🧭',
  social: '🦋',
  defi: '🏆',
};

export function ProfilePage() {
  const { state, dispatch } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  const unlockedBadges = state.badges.filter(b => b.unlocked);
  const lockedBadges = state.badges.filter(b => !b.unlocked);

  return (
    <div className="px-4 py-4 space-y-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-jardin-500 to-jardin-700 rounded-2xl p-5 text-white text-center shadow-lg"
      >
        <div className="text-5xl mb-2">{state.user.avatar}</div>
        <h2 className="text-xl font-bold">{state.user.name}</h2>
        <p className="text-jardin-100 text-sm">Niveau {state.user.level} · {state.user.points} points</p>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/20 rounded-xl py-2">
            <MapPin className="w-5 h-5 mx-auto mb-1" />
            <p className="text-lg font-bold">{state.user.visitedAttractions.length}</p>
            <p className="text-[10px] text-jardin-100">Visites</p>
          </div>
          <div className="bg-white/20 rounded-xl py-2">
            <Compass className="w-5 h-5 mx-auto mb-1" />
            <p className="text-lg font-bold">{state.user.completedQuests.length}</p>
            <p className="text-[10px] text-jardin-100">Quêtes</p>
          </div>
          <div className="bg-white/20 rounded-xl py-2">
            <Trophy className="w-5 h-5 mx-auto mb-1" />
            <p className="text-lg font-bold">{unlockedBadges.length}</p>
            <p className="text-[10px] text-jardin-100">Badges</p>
          </div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">🏅 Badges débloqués</h3>
        {unlockedBadges.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {unlockedBadges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-1 p-2 bg-white rounded-xl shadow-sm border border-jardin-100"
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">Aucun badge pour le moment</p>
        )}
      </div>

      {/* Locked Badges */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">🔒 À débloquer</h3>
        <div className="grid grid-cols-4 gap-3">
          {lockedBadges.map(badge => (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl border border-gray-100 opacity-50"
            >
              <span className="text-2xl grayscale">{badge.icon}</span>
              <span className="text-[10px] font-semibold text-gray-500 text-center leading-tight">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Settings */}
      <div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3"
        >
          <Accessibility className="w-5 h-5" />
          Accessibilité
          <Settings className={`w-4 h-4 text-gray-400 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
        </button>

        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="space-y-3 bg-white rounded-xl p-4 border border-gray-100"
          >
            {[
              { key: 'wheelchair' as const, label: '♿ Fauteuil roulant', desc: 'Afficher uniquement les attractions accessibles' },
              { key: 'reducedMobility' as const, label: '🦯 Mobilité réduite', desc: 'Parcours adaptés et raccourcis' },
              { key: 'visualImpairment' as const, label: '👁️ Déficience visuelle', desc: 'Descriptions audio augmentées' },
              { key: 'hearingImpairment' as const, label: '👂 Déficience auditive', desc: 'Sous-titres et alertes visuelles' },
              { key: 'withChildren' as const, label: '👶 Avec enfants', desc: 'Recommandations adaptées à l\'âge' },
            ].map(pref => (
              <label key={pref.key} className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{pref.label}</p>
                  <p className="text-xs text-gray-400">{pref.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={state.user.accessibilityPrefs[pref.key] as boolean}
                  onChange={e => dispatch({ type: 'UPDATE_ACCESSIBILITY', prefs: { [pref.key]: e.target.checked } })}
                  className="w-5 h-5 rounded text-jardin-600 focus:ring-jardin-500"
                />
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-gold-50 to-orange-50 rounded-xl p-4 border border-gold-200">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-gold-500" />
          <h3 className="font-bold text-gray-800">Statistiques de visite</h3>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <p>📍 {state.user.visitedAttractions.length}/10 attractions visitées</p>
          <p>🧭 {state.user.completedQuests.length}/4 quêtes terminées</p>
          <p>🏅 {unlockedBadges.length}/{state.badges.length} badges débloqués</p>
          <p>⭐ {state.user.points} points cumulés</p>
        </div>
      </div>
    </div>
  );
}
