import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { attractions, categoryLabels, categoryColors } from '../data/attractions';
import { useApp } from '../context/AppContext';
import type { Attraction } from '../data/types';
import 'leaflet/dist/leaflet.css';

const PARK_CENTER: [number, number] = [48.8783, 2.2622];
const PARK_ZOOM = 16;

function createEmojiIcon(emoji: string, visited: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${visited ? '#dcfce7' : 'white'};
      border: 2px solid ${visited ? '#22c55e' : '#e5e7eb'};
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    ">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });
}

function FlyToButton({ position }: { position: [number, number] }) {
  const map = useMap();
  map.flyTo(position, 17, { duration: 0.5 });
  return null;
}

export function MapPage() {
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState<Attraction['category'] | 'all'>('all');
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const filtered = useMemo(
    () => filter === 'all' ? attractions : attractions.filter(a => a.category === filter),
    [filter]
  );

  const categories: Array<Attraction['category'] | 'all'> = ['all', 'manege', 'spectacle', 'nature', 'restauration', 'jeu'];

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)]">
      {/* Category Filter */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === cat
                ? 'bg-jardin-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat === 'all' ? '🌍 Tout' : `${attractions.find(a => a.category === cat)?.icon || ''} ${categoryLabels[cat]}`}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={PARK_CENTER}
          zoom={PARK_ZOOM}
          className="h-full w-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flyTo && <FlyToButton position={flyTo} />}
          {filtered.map(attraction => {
            const visited = state.user.visitedAttractions.includes(attraction.id);
            return (
              <Marker
                key={attraction.id}
                position={[attraction.lat, attraction.lng]}
                icon={createEmojiIcon(attraction.image, visited)}
                eventHandlers={{
                  click: () => setFlyTo([attraction.lat, attraction.lng]),
                }}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{attraction.image}</span>
                      <span className="font-bold text-sm">{attraction.name}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{attraction.description}</p>
                    <div className="flex gap-2 items-center flex-wrap mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[attraction.category]}`}>
                        {categoryLabels[attraction.category]}
                      </span>
                      {attraction.waitMinutes > 0 && (
                        <span className="text-xs font-semibold text-gray-700">
                          ⏱️ {attraction.waitMinutes} min
                        </span>
                      )}
                      {attraction.accessible && (
                        <span className="text-xs">♿</span>
                      )}
                    </div>
                    {!visited && (
                      <button
                        onClick={() => dispatch({ type: 'VISIT_ATTRACTION', attractionId: attraction.id })}
                        className="w-full text-xs bg-jardin-600 text-white rounded-lg py-1.5 font-semibold hover:bg-jardin-700 transition-colors"
                      >
                        ✓ Marquer comme visité
                      </button>
                    )}
                    {visited && (
                      <div className="text-xs text-jardin-600 font-semibold text-center">✓ Déjà visité !</div>
                    )}
                    {/* Wishlist toggle */}
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', attractionId: attraction.id })}
                      className={`w-full text-xs rounded-lg py-1.5 font-semibold mt-1 transition-colors ${
                        state.user.wishlist.includes(attraction.id)
                          ? 'bg-pink-100 text-pink-600'
                          : 'bg-gray-100 text-gray-500 hover:bg-pink-50'
                      }`}
                    >
                      {state.user.wishlist.includes(attraction.id) ? '❤️ Dans ma wishlist' : '🤍 Ajouter à ma wishlist'}
                    </button>
                    {/* Animal bios */}
                    {attraction.animals && attraction.animals.length > 0 && (
                      <div className="mt-2 border-t border-gray-100 pt-2">
                        <p className="text-xs font-bold text-gray-700 mb-1">🐾 Animaux</p>
                        {attraction.animals.map(animal => (
                          <div key={animal.name} className="mb-1.5">
                            <p className="text-xs font-semibold text-gray-700">{animal.name} <span className="text-gray-400">· {animal.species}</span></p>
                            <p className="text-[10px] text-gray-500">{animal.funFact}</p>
                            {(!state.user.adoptedAnimal || state.user.adoptedAnimal.animalName !== animal.name) && (
                              <button
                                onClick={() => dispatch({ type: 'ADOPT_ANIMAL', animal: { animalName: animal.name, attractionId: attraction.id, adoptedAt: new Date(), feedCount: 0 } })}
                                className="mt-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-semibold hover:bg-purple-200"
                              >
                                🐾 Adopter {animal.name}
                              </button>
                            )}
                            {state.user.adoptedAnimal?.animalName === animal.name && (
                              <span className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full bg-jardin-100 text-jardin-600 font-semibold">
                                ✨ Mon compagnon !
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg z-[1000] text-xs">
          <p className="font-semibold text-gray-700 mb-1">Légende</p>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-jardin-200 border border-jardin-500"></span> Visité</div>
          <div className="flex items-center gap-1 mt-0.5"><span className="w-3 h-3 rounded-full bg-white border border-gray-300"></span> À découvrir</div>
        </div>
      </div>
    </div>
  );
}
