import { useState } from 'react';
import { motion } from 'framer-motion';
import { attractions, categoryLabels, categoryColors } from '../data/attractions';
import { useApp } from '../context/AppContext';
import { Clock, Filter, CheckCircle2 } from 'lucide-react';
import type { Attraction } from '../data/types';

type SortBy = 'wait' | 'name' | 'category';

export function AttractionsPage() {
  const { state, dispatch } = useApp();
  const [sortBy, setSortBy] = useState<SortBy>('wait');
  const [filterCategory, setFilterCategory] = useState<Attraction['category'] | 'all'>('all');

  const filtered = attractions
    .filter(a => filterCategory === 'all' || a.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'wait') return a.waitMinutes - b.waitMinutes;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.category.localeCompare(b.category);
    });

  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">🎡 Attractions</h2>
        <p className="text-sm text-gray-500">Temps d'attente en temps réel</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 items-center overflow-x-auto no-scrollbar">
        <Filter className="w-4 h-4 text-gray-400 shrink-0" />
        {(['all', 'manege', 'spectacle', 'nature', 'restauration', 'jeu'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterCategory === cat
                ? 'bg-jardin-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat === 'all' ? 'Tout' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2 text-xs">
        <span className="text-gray-400">Trier :</span>
        {([['wait', '⏱ Attente'], ['name', '🔤 Nom'], ['category', '📂 Catégorie']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-2 py-0.5 rounded ${sortBy === key ? 'bg-jardin-100 text-jardin-700 font-semibold' : 'text-gray-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((attraction, i) => {
          const visited = state.user.visitedAttractions.includes(attraction.id);
          return (
            <motion.div
              key={attraction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                visited ? 'border-jardin-200' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{attraction.image}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{attraction.name}</h3>
                    {visited && <CheckCircle2 className="w-4 h-4 text-jardin-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{attraction.description}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${categoryColors[attraction.category]}`}>
                      {categoryLabels[attraction.category]}
                    </span>
                    {attraction.accessible && <span className="text-[10px]">♿ Accessible</span>}
                    {attraction.minHeight && (
                      <span className="text-[10px] text-gray-400">📏 {attraction.minHeight}cm min</span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {attraction.waitMinutes > 0 ? (
                    <div className="flex flex-col items-center">
                      <Clock className={`w-4 h-4 ${
                        attraction.waitMinutes <= 10 ? 'text-jardin-500' :
                        attraction.waitMinutes <= 20 ? 'text-gold-500' :
                        'text-red-500'
                      }`} />
                      <span className={`text-lg font-bold ${
                        attraction.waitMinutes <= 10 ? 'text-jardin-600' :
                        attraction.waitMinutes <= 20 ? 'text-gold-600' :
                        'text-red-600'
                      }`}>
                        {attraction.waitMinutes}
                      </span>
                      <span className="text-[10px] text-gray-400">min</span>
                    </div>
                  ) : (
                    <span className="text-xs text-jardin-600 font-semibold">Libre</span>
                  )}
                </div>
              </div>

              {!visited && (
                <button
                  onClick={() => dispatch({ type: 'VISIT_ATTRACTION', attractionId: attraction.id })}
                  className="mt-3 w-full py-2 rounded-lg text-xs font-semibold bg-jardin-50 text-jardin-700 hover:bg-jardin-100 transition-colors"
                >
                  ✓ J'y suis allé !
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
