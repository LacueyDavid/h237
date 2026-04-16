import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Filter, Star, Clock } from 'lucide-react';
import { parkEvents, eventCategoryLabels, eventCategoryColors } from '../data/events';
import type { ParkEvent } from '../data/types';

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

type ViewMode = 'mois' | 'liste';

export function EventsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedCategory, setSelectedCategory] = useState<ParkEvent['category'] | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('mois');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const categories: Array<ParkEvent['category'] | 'all'> = ['all', 'fete', 'spectacle', 'atelier', 'nature', 'musique'];

  const filteredEvents = useMemo(() => {
    return parkEvents
      .filter(e => selectedCategory === 'all' || e.category === selectedCategory)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [selectedCategory]);

  const monthEvents = useMemo(() => {
    return filteredEvents.filter(e => {
      const start = e.date;
      const end = e.endDate || e.date;
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      return start <= monthEnd && end >= monthStart;
    });
  }, [filteredEvents, year, month]);

  const todayEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return filteredEvents.filter(e => {
      const start = new Date(e.date); start.setHours(0, 0, 0, 0);
      const end = e.endDate ? new Date(e.endDate) : new Date(e.date); end.setHours(23, 59, 59);
      return start <= today && end >= today;
    });
  }, [filteredEvents]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return filteredEvents
      .filter(e => {
        const end = e.endDate || e.date;
        return end >= today;
      })
      .slice(0, 10);
  }, [filteredEvents]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0

  const getEventsForDay = (day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return filteredEvents.filter(e => {
      const start = new Date(e.date); start.setHours(0, 0, 0, 0);
      const end = e.endDate ? new Date(e.endDate) : new Date(e.date); end.setHours(23, 59, 59);
      return start <= date && end >= date;
    });
  };

  const isToday = (day: number) => {
    return day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  };

  const formatDateRange = (e: ParkEvent) => {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    if (e.endDate && e.endDate.getTime() !== e.date.getTime()) {
      return `${e.date.toLocaleDateString('fr-FR', opts)} → ${e.endDate.toLocaleDateString('fr-FR', opts)}`;
    }
    return e.date.toLocaleDateString('fr-FR', { ...opts, year: 'numeric' });
  };

  const renderEventCard = (event: ParkEvent) => {
    const isExpanded = expandedEvent === event.id;
    const isPast = (event.endDate || event.date) < now;
    return (
      <motion.div
        key={event.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl border shadow-sm overflow-hidden ${isPast ? 'opacity-50 border-gray-100' : 'border-gray-100'}`}
      >
        <button
          onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
          className="w-full p-3 flex items-start gap-3 text-left"
        >
          <span className="text-2xl mt-0.5">{event.image}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-gray-800">{event.title}</h4>
              {isToday(event.date.getDate()) && event.date.getMonth() === now.getMonth() && !isPast && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white font-bold animate-pulse">AUJOURD'HUI</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${eventCategoryColors[event.category]}`}>
                {eventCategoryLabels[event.category]}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDateRange(event)}
              </span>
            </div>
          </div>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-2">
                <p className="text-xs text-gray-600">{event.description}</p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {event.ageRange && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
                      👶 {event.ageRange}
                    </span>
                  )}
                  {event.location && (
                    <span className="px-2 py-0.5 rounded-full bg-jardin-50 text-jardin-600 font-semibold">
                      📍 {event.location}
                    </span>
                  )}
                  {event.forKids && (
                    <span className="px-2 py-0.5 rounded-full bg-gold-50 text-gold-600 font-semibold">
                      ⭐ Pour les enfants
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">📅 Événements</h2>
        <p className="text-sm text-gray-500">Ne manquez rien au Jardin d'Acclimatation</p>
      </div>

      {/* Today highlight */}
      {todayEvents.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" />
            <h3 className="font-bold">Aujourd'hui au parc</h3>
          </div>
          <div className="space-y-1">
            {todayEvents.map(e => (
              <div key={e.id} className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
                <span>{e.image}</span>
                <span className="text-sm font-medium">{e.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-jardin-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat === 'all' ? '🌍 Tout' : eventCategoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('mois')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'mois' ? 'bg-jardin-600 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 inline mr-1" />
          Calendrier
        </button>
        <button
          onClick={() => setViewMode('liste')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'liste' ? 'bg-jardin-600 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <Filter className="w-3.5 h-3.5 inline mr-1" />
          Liste
        </button>
      </div>

      {viewMode === 'mois' ? (
        <>
          {/* Month Navigator */}
          <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h3 className="font-bold text-gray-800">{MONTHS_FR[month]} {year}</h3>
              <p className="text-xs text-gray-400">{monthEvents.length} événement{monthEvents.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mini Calendar Grid */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 font-semibold mb-1">
              {['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'].map(d => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const today = isToday(day);
                return (
                  <div
                    key={day}
                    className={`relative p-1 text-center text-xs rounded-lg ${
                      today ? 'bg-jardin-600 text-white font-bold' :
                      dayEvents.length > 0 ? 'bg-purple-50 font-semibold text-purple-700' :
                      'text-gray-600'
                    }`}
                  >
                    {day}
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 justify-center mt-0.5">
                        {dayEvents.slice(0, 3).map(e => (
                          <span key={e.id} className="text-[6px]">{e.image}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Month Events List */}
          <div className="space-y-2">
            {monthEvents.length > 0 ? (
              monthEvents.map(renderEventCard)
            ) : (
              <div className="text-center py-6 text-gray-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Pas d'événement ce mois-ci</p>
                <p className="text-xs mt-1">Essayez un autre mois ou changez le filtre</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* List View - upcoming */
        <div className="space-y-2">
          <h3 className="font-bold text-gray-800">📋 Prochains événements</h3>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(renderEventCard)
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">Aucun événement trouvé pour cette catégorie</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
