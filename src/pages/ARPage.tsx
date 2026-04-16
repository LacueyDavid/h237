import { motion } from 'framer-motion';
import { Camera, Scan, Sparkles, TreePine } from 'lucide-react';
import { useState } from 'react';

export function ARPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="px-4 py-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">📸 Réalité Augmentée</h2>
        <p className="text-sm text-gray-500">Pointez votre caméra pour découvrir des surprises !</p>
      </div>

      {/* AR Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl aspect-[3/4] relative overflow-hidden shadow-lg"
      >
        {!showDemo ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <Camera className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">Caméra AR</h3>
            <p className="text-sm text-gray-400 text-center px-8 mb-6">
              Pointez votre caméra vers les attractions pour révéler des personnages et des histoires cachées
            </p>
            <button
              onClick={() => setShowDemo(true)}
              className="bg-jardin-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-jardin-700 transition-colors flex items-center gap-2"
            >
              <Scan className="w-5 h-5" />
              Lancer la démo
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-jardin-800 to-emerald-900 flex flex-col items-center justify-center text-white p-6">
            {/* Simulated AR Experience */}
            <div className="relative w-full h-full">
              {/* Fake camera feed background */}
              <div className="absolute inset-0 bg-gradient-to-b from-jardin-700/30 to-emerald-800/50 rounded-lg" />

              {/* Scanning animation */}
              <motion.div
                animate={{ y: [0, 200, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute left-4 right-4 h-0.5 bg-jardin-400/60 rounded-full shadow-lg shadow-jardin-400/30"
              />

              {/* AR Elements */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center">
                  <span className="text-4xl">🦜</span>
                  <p className="text-xs font-bold text-gray-800 mt-1">Ara Bleu</p>
                  <p className="text-[10px] text-gray-500">Grande Volière</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="absolute bottom-1/3 right-8"
              >
                <div className="bg-gold-400/90 backdrop-blur-sm rounded-xl p-3 shadow-lg text-center">
                  <Sparkles className="w-6 h-6 text-white mx-auto" />
                  <p className="text-[10px] font-bold text-white mt-1">+50 pts!</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: 'spring' }}
                className="absolute bottom-1/4 left-8"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg text-center">
                  <TreePine className="w-8 h-8 text-jardin-600 mx-auto" />
                  <p className="text-[10px] font-bold text-gray-800 mt-1">Platane centenaire</p>
                  <p className="text-[10px] text-gray-500">Planté en 1862</p>
                </div>
              </motion.div>

              {/* Scanning corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-jardin-400 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-jardin-400 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-jardin-400 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-jardin-400 rounded-br-lg" />
            </div>

            <button
              onClick={() => setShowDemo(false)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              Fermer la démo
            </button>
          </div>
        )}
      </motion.div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800">Fonctionnalités AR</h3>
        {[
          { icon: '🦜', title: 'Animaux virtuels', desc: 'Découvrez des animaux en AR près de chaque attraction' },
          { icon: '📖', title: 'Histoires cachées', desc: 'Scannez les bâtiments historiques pour révéler leur passé' },
          { icon: '🎮', title: 'Mini-jeux AR', desc: 'Collectez des étoiles virtuelles dans tout le parc' },
          { icon: '📸', title: 'Photos souvenirs', desc: 'Prenez des photos avec les personnages AR du Jardin' },
        ].map(feature => (
          <div key={feature.title} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <span className="text-2xl">{feature.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">{feature.title}</p>
              <p className="text-xs text-gray-500">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
