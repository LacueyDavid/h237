import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { attractions } from '../data/attractions';
import { Heart, Clock, Navigation, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ParcoursPage() {
  const { state, dispatch } = useApp();

  const wishlistAttractions = attractions.filter(a => state.user.wishlist.includes(a.id));
  const otherAttractions = attractions.filter(a => !state.user.wishlist.includes(a.id));

  const totalWait = wishlistAttractions.reduce((sum, a) => sum + a.waitMinutes, 0);

  // Simple route optimization: sort by proximity (lat/lng)
  const optimizedRoute = [...wishlistAttractions].sort((a, b) => {
    return a.lat - b.lat || a.lng - b.lng;
  });

  return (
    <div className="px-4 py-4 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">🗺️ Mon Parcours</h2>
        <p className="text-sm text-gray-500">
          Créez votre wishlist et optimisez votre trajet dans le parc
        </p>
      </div>

      {/* Stats */}
      {wishlistAttractions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-jardin-500 to-jardin-600 rounded-2xl p-4 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Parcours optimisé</h3>
            <Navigation className="w-5 h-5" />
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <p className="text-jardin-100">Attractions</p>
              <p className="text-xl font-bold">{wishlistAttractions.length}</p>
            </div>
            <div>
              <p className="text-jardin-100">Attente estimée</p>
              <p className="text-xl font-bold">{totalWait} min</p>
            </div>
            <div>
              <p className="text-jardin-100">Durée totale</p>
              <p className="text-xl font-bold">~{totalWait + wishlistAttractions.length * 15} min</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Optimized Route */}
      {optimizedRoute.length > 0 ? (
        <div>
          <h3 className="font-bold text-gray-800 mb-3">📍 Ordre conseillé</h3>
          <div className="space-y-2">
            {optimizedRoute.map((attraction, i) => {
              const visited = state.user.visitedAttractions.includes(attraction.id);
              return (
                <motion.div
                  key={attraction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border ${
                    visited ? 'border-jardin-200 opacity-60' : 'border-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-jardin-100 flex items-center justify-center text-sm font-bold text-jardin-700 shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-2xl">{attraction.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${visited ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {attraction.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {attraction.waitMinutes > 0 && (
                        <span className={`text-xs font-semibold flex items-center gap-1 ${
                          attraction.waitMinutes <= 10 ? 'text-jardin-600' :
                          attraction.waitMinutes <= 20 ? 'text-gold-600' : 'text-red-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {attraction.waitMinutes} min
                        </span>
                      )}
                      {attraction.waitMinutes === 0 && (
                        <span className="text-xs text-jardin-600 font-semibold">Accès libre</span>
                      )}
                    </div>
                  </div>
                  {i < optimizedRoute.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', attractionId: attraction.id })}
                    className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          <Link to="/carte" className="block mt-3">
            <button className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-jardin-500 to-jardin-600 text-white shadow-md">
              🗺️ Voir sur la carte
            </button>
          </Link>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 mb-1">Votre wishlist est vide</h3>
          <p className="text-sm text-gray-400 mb-4">
            Ajoutez des attractions pour créer votre parcours personnalisé
          </p>
          <Link to="/carte" className="text-jardin-600 text-sm font-semibold">
            Explorer la carte →
          </Link>
        </div>
      )}

      {/* Add More */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Ajouter à mon parcours</h3>
        <div className="space-y-2">
          {otherAttractions.map(attraction => (
            <div
              key={attraction.id}
              className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100"
            >
              <span className="text-xl">{attraction.image}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{attraction.name}</p>
                {attraction.waitMinutes > 0 && (
                  <span className="text-xs text-gray-400">⏱ {attraction.waitMinutes} min d'attente</span>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', attractionId: attraction.id })}
                className="p-2 rounded-full bg-jardin-50 text-jardin-600 hover:bg-jardin-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
