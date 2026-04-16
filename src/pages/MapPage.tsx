import { useMemo, useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { attractions, categoryLabels, categoryColors } from '../data/attractions';
import { useApp } from '../context/AppContext';
import type { Attraction } from '../data/types';
import { Route, X, ChevronUp, ChevronDown, Navigation, Clock, Trash2, Plus, LocateFixed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const PARK_CENTER: [number, number] = [48.8783, 2.2622];
const PARK_ZOOM = 16;

function createEmojiIcon(emoji: string, visited: boolean, inRoute?: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${inRoute ? '#ede9fe' : visited ? '#dcfce7' : 'white'};
      border: 2px solid ${inRoute ? '#7c3aed' : visited ? '#22c55e' : '#e5e7eb'};
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    ">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 18px; height: 18px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 2px #3b82f6, 0 2px 8px rgba(59,130,246,0.4);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function createStepIcon(step: number) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 24px; height: 24px;
      background: #7c3aed;
      color: white; font-size: 12px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(124,58,237,0.4);
      border: 2px solid white;
    ">${step}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function FlyToButton({ position }: { position: [number, number] }) {
  const map = useMap();
  map.flyTo(position, 17, { duration: 0.5 });
  return null;
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions, { padding: [40, 40], maxZoom: 17 });
    } else if (positions.length === 1) {
      map.flyTo(positions[0], 17, { duration: 0.5 });
    }
  }, [map, positions]);
  return null;
}

type PanelMode = 'hidden' | 'setup' | 'itinerary';

export function MapPage() {
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState<Attraction['category'] | 'all'>('all');
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('hidden');
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState(false);

  const filtered = useMemo(
    () => filter === 'all' ? attractions : attractions.filter(a => a.category === filter),
    [filter]
  );

  const categories: Array<Attraction['category'] | 'all'> = ['all', 'manege', 'spectacle', 'nature', 'restauration', 'jeu'];

  const wishlistAttractions = useMemo(
    () => attractions.filter(a => state.user.wishlist.includes(a.id)),
    [state.user.wishlist]
  );

  // Waze-style route optimization
  const optimizedRoute = useMemo(() => {
    const wl = wishlistAttractions;
    if (wl.length <= 1) return [...wl];

    const dist = (a: typeof wl[0], b: typeof wl[0]) =>
      Math.sqrt((a.lat - b.lat) ** 2 + (a.lng - b.lng) ** 2);

    const seed = state.user.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      + state.user.totalVisits * 7 + state.user.points * 3;
    const startIdx = seed % wl.length;

    const visited = new Set<string>();
    const route: typeof wl = [];
    let current = wl[startIdx];

    while (route.length < wl.length) {
      route.push(current);
      visited.add(current.id);
      let best: typeof current | null = null;
      let bestScore = Infinity;
      for (const a of wl) {
        if (visited.has(a.id)) continue;
        const score = dist(current, a) * 10000 + a.waitMinutes * 2;
        if (score < bestScore) { bestScore = score; best = a; }
      }
      if (best) current = best;
    }
    return route;
  }, [wishlistAttractions, state.user.name, state.user.totalVisits, state.user.points]);

  const totalWait = wishlistAttractions.reduce((sum, a) => sum + a.waitMinutes, 0);

  const routePositions = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = [];
    if (panelMode === 'itinerary' && userPos) pts.push(userPos);
    for (const a of optimizedRoute) pts.push([a.lat, a.lng]);
    return pts;
  }, [optimizedRoute, panelMode, userPos]);

  // Geolocation
  const requestGeo = useCallback(() => {
    if (!navigator.geolocation) { setGeoError(true); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setGeoError(false);
      },
      () => setGeoError(true),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Watch position when in itinerary mode
  useEffect(() => {
    if (panelMode !== 'itinerary') return;
    if (!navigator.geolocation) { setGeoError(true); return; }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setGeoError(false);
      },
      () => setGeoError(true),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [panelMode]);

  const startItinerary = () => {
    requestGeo();
    setPanelMode('itinerary');
    setPanelExpanded(false);
  };

  const otherAttractions = useMemo(
    () => attractions.filter(a => !state.user.wishlist.includes(a.id)),
    [state.user.wishlist]
  );

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
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {flyTo && <FlyToButton position={flyTo} />}
          {panelMode === 'itinerary' && routePositions.length >= 2 && (
            <>
              <FitBounds positions={routePositions} />
              <Polyline
                positions={routePositions}
                pathOptions={{ color: '#7c3aed', weight: 4, dashArray: '8 8', opacity: 0.8 }}
              />
            </>
          )}

          {/* User position marker */}
          {panelMode === 'itinerary' && userPos && (
            <Marker position={userPos} icon={createUserIcon()}>
              <Popup><span className="text-xs font-semibold">📍 Vous êtes ici</span></Popup>
            </Marker>
          )}

          {/* Step number markers on route */}
          {panelMode === 'itinerary' && optimizedRoute.map((a, i) => (
            <Marker key={`step-${a.id}`} position={[a.lat, a.lng]} icon={createStepIcon(i + 1)} />
          ))}

          {filtered.map(attraction => {
            const visited = state.user.visitedAttractions.includes(attraction.id);
            const inRoute = panelMode !== 'hidden' && state.user.wishlist.includes(attraction.id);
            return (
              <Marker
                key={attraction.id}
                position={[attraction.lat, attraction.lng]}
                icon={createEmojiIcon(attraction.image, visited, inRoute)}
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
                        <span className="text-xs font-semibold text-gray-700">⏱️ {attraction.waitMinutes} min</span>
                      )}
                      {attraction.accessible && <span className="text-xs">♿</span>}
                    </div>
                    {!visited && (
                      <button
                        onClick={() => dispatch({ type: 'VISIT_ATTRACTION', attractionId: attraction.id })}
                        className="w-full text-xs bg-jardin-600 text-white rounded-lg py-1.5 font-semibold hover:bg-jardin-700 transition-colors"
                      >
                        ✓ Marquer comme visité
                      </button>
                    )}
                    {visited && <div className="text-xs text-jardin-600 font-semibold text-center">✓ Déjà visité !</div>}
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', attractionId: attraction.id })}
                      className={`w-full text-xs rounded-lg py-1.5 font-semibold mt-1 transition-colors ${
                        state.user.wishlist.includes(attraction.id)
                          ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500 hover:bg-pink-50'
                      }`}
                    >
                      {state.user.wishlist.includes(attraction.id) ? '❤️ Dans mon parcours' : '🤍 Ajouter au parcours'}
                    </button>
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
        {panelMode === 'hidden' && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg z-[1000] text-xs">
            <p className="font-semibold text-gray-700 mb-1">Légende</p>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-jardin-200 border border-jardin-500"></span> Visité</div>
            <div className="flex items-center gap-1 mt-0.5"><span className="w-3 h-3 rounded-full bg-white border border-gray-300"></span> À découvrir</div>
          </div>
        )}

        {/* Floating Parcours Button */}
        {panelMode === 'hidden' && (
          <button
            onClick={() => { setPanelMode('setup'); setPanelExpanded(true); }}
            className="absolute bottom-4 right-4 z-[1000] bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <Route className="w-6 h-6" />
            {wishlistAttractions.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistAttractions.length}
              </span>
            )}
          </button>
        )}

        {/* Parcours Panel */}
        <AnimatePresence>
          {panelMode !== 'hidden' && (
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-2xl shadow-2xl border-t border-gray-200"
              style={{ maxHeight: panelExpanded ? '60vh' : 'auto' }}
            >
              {/* Panel Handle */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-sm text-gray-800">
                    {panelMode === 'setup' ? 'Mon Parcours' : 'Itinéraire'}
                  </h3>
                  {wishlistAttractions.length > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
                      {wishlistAttractions.length} étape{wishlistAttractions.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPanelExpanded(!panelExpanded)} className="p-1 text-gray-400">
                    {panelExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => { setPanelMode('hidden'); setPanelExpanded(true); }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {panelExpanded && (
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 52px)' }}>
                  {panelMode === 'setup' && (
                    <div className="px-4 py-3 space-y-3">
                      {/* Stats bar */}
                      {wishlistAttractions.length > 0 && (
                        <div className="flex gap-3 text-xs">
                          <div className="flex-1 bg-purple-50 rounded-xl p-2.5 text-center">
                            <p className="text-purple-400">Attractions</p>
                            <p className="text-lg font-bold text-purple-600">{wishlistAttractions.length}</p>
                          </div>
                          <div className="flex-1 bg-blue-50 rounded-xl p-2.5 text-center">
                            <p className="text-blue-400">Attente</p>
                            <p className="text-lg font-bold text-blue-600">{totalWait} min</p>
                          </div>
                          <div className="flex-1 bg-jardin-50 rounded-xl p-2.5 text-center">
                            <p className="text-jardin-400">Durée totale</p>
                            <p className="text-lg font-bold text-jardin-600">~{totalWait + wishlistAttractions.length * 15} min</p>
                          </div>
                        </div>
                      )}

                      {/* Route steps */}
                      {optimizedRoute.length > 0 ? (
                        <>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ordre optimisé</p>
                          <div className="space-y-1.5">
                            {optimizedRoute.map((attraction, i) => {
                              const visited = state.user.visitedAttractions.includes(attraction.id);
                              return (
                                <div
                                  key={attraction.id}
                                  className={`flex items-center gap-2.5 rounded-xl p-2.5 ${
                                    visited ? 'bg-jardin-50 opacity-60' : 'bg-gray-50'
                                  }`}
                                >
                                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                    {i + 1}
                                  </div>
                                  <span className="text-lg">{attraction.image}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-xs ${visited ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                      {attraction.name}
                                    </p>
                                    {attraction.waitMinutes > 0 && (
                                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                        <Clock className="w-2.5 h-2.5" /> {attraction.waitMinutes} min
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', attractionId: attraction.id })}
                                    className="p-1 text-red-300 hover:text-red-500"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          {/* Start itinerary */}
                          <button
                            onClick={startItinerary}
                            className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md flex items-center justify-center gap-2"
                          >
                            <Navigation className="w-4 h-4" />
                            Lancer l'itinéraire
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500 mb-1">Aucune attraction sélectionnée</p>
                          <p className="text-xs text-gray-400">Cliquez sur une attraction et ajoutez-la au parcours</p>
                        </div>
                      )}

                      {/* Add more */}
                      {otherAttractions.length > 0 && (
                        <>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ajouter</p>
                          <div className="space-y-1">
                            {otherAttractions.slice(0, 5).map(a => (
                              <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                                <span className="text-lg">{a.image}</span>
                                <p className="flex-1 text-xs font-medium text-gray-700 truncate">{a.name}</p>
                                <button
                                  onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', attractionId: a.id })}
                                  className="p-1 rounded-full bg-jardin-50 text-jardin-600 hover:bg-jardin-100"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {panelMode === 'itinerary' && (
                    <div className="px-4 py-3 space-y-3">
                      {/* Geo status */}
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                        userPos ? 'bg-blue-50 text-blue-600' : geoError ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-500'
                      }`}>
                        <LocateFixed className="w-4 h-4" />
                        {userPos
                          ? 'Position GPS active — itinéraire en temps réel'
                          : geoError
                            ? 'GPS indisponible — trajectoire affichée sans position'
                            : 'Recherche de votre position…'
                        }
                      </div>

                      {/* Steps */}
                      <div className="space-y-1.5">
                        {optimizedRoute.map((attraction, i) => {
                          const visited = state.user.visitedAttractions.includes(attraction.id);
                          return (
                            <div
                              key={attraction.id}
                              className={`flex items-center gap-2.5 rounded-xl p-2.5 ${
                                visited ? 'bg-jardin-50' : 'bg-gray-50'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                                visited ? 'bg-jardin-500' : 'bg-purple-600'
                              }`}>
                                {visited ? '✓' : i + 1}
                              </div>
                              <span className="text-lg">{attraction.image}</span>
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-xs ${visited ? 'text-jardin-600' : 'text-gray-800'}`}>
                                  {attraction.name}
                                </p>
                                {!visited && attraction.waitMinutes > 0 && (
                                  <span className="text-[10px] text-gray-400">⏱ {attraction.waitMinutes} min</span>
                                )}
                                {visited && <span className="text-[10px] text-jardin-500">Fait !</span>}
                              </div>
                              {!visited && (
                                <button
                                  onClick={() => {
                                    dispatch({ type: 'VISIT_ATTRACTION', attractionId: attraction.id });
                                    setFlyTo([attraction.lat, attraction.lng]);
                                  }}
                                  className="text-[10px] px-2 py-1 bg-jardin-500 text-white rounded-lg font-semibold"
                                >
                                  Fait ✓
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Back to setup */}
                      <button
                        onClick={() => setPanelMode('setup')}
                        className="w-full py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600"
                      >
                        ← Modifier le parcours
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
