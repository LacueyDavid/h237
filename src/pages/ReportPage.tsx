import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Wrench, ShieldAlert, Baby, HelpCircle, CheckCircle2, Send } from 'lucide-react';
import type { Report } from '../data/types';
import { attractions } from '../data/attractions';

const reportTypes: Array<{ type: Report['type']; icon: typeof AlertTriangle; label: string; color: string; desc: string }> = [
  { type: 'enfant_perdu', icon: Baby, label: 'Enfant égaré', color: 'bg-red-500', desc: 'Signalez un enfant seul ou perdu dans le parc' },
  { type: 'comportement', icon: ShieldAlert, label: 'Comportement', color: 'bg-orange-500', desc: 'Comportement inapproprié ou dangereux' },
  { type: 'maintenance', icon: Wrench, label: 'Maintenance', color: 'bg-blue-500', desc: 'Toilette en panne, banc cassé, déchet...' },
  { type: 'autre', icon: HelpCircle, label: 'Autre', color: 'bg-gray-500', desc: 'Autre type de signalement' },
];

export function ReportPage() {
  const { state, dispatch } = useApp();
  const [selectedType, setSelectedType] = useState<Report['type'] | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!selectedType || !description.trim()) return;

    const report: Report = {
      id: `report-${Date.now()}`,
      type: selectedType,
      description: description.trim(),
      location: location || undefined,
      timestamp: new Date(),
      status: 'envoyé',
    };
    dispatch({ type: 'ADD_REPORT', report });
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelectedType(null);
      setDescription('');
      setLocation('');
    }, 3000);
  };

  return (
    <div className="px-4 py-4 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">🚨 Signaler</h2>
        <p className="text-sm text-gray-500">
          Aidez-nous à garder le parc sûr et agréable pour tous
        </p>
      </div>

      {/* Urgent banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
        <Baby className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-red-700">Enfant égaré ?</p>
          <p className="text-xs text-red-600">
            En cas d'urgence, alertez immédiatement un membre du personnel ou appelez le point accueil au 01 40 67 90 85.
          </p>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-2 gap-3">
        {reportTypes.map(rt => {
          const Icon = rt.icon;
          const isSelected = selectedType === rt.type;
          return (
            <button
              key={rt.type}
              onClick={() => setSelectedType(rt.type)}
              className={`p-4 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-white border-jardin-300 ring-2 ring-jardin-100 shadow-md'
                  : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${rt.color} flex items-center justify-center mb-2`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-800">{rt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{rt.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Report Form */}
      <AnimatePresence>
        {selectedType && !sent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <div>
              <label className="text-sm font-semibold text-gray-700">Description *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={
                  selectedType === 'enfant_perdu'
                    ? "Décrivez l'enfant (âge, vêtements, dernière localisation connue...)"
                    : "Décrivez la situation..."
                }
                className="mt-1 w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-jardin-300 resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Localisation</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="mt-1 w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-jardin-300"
              >
                <option value="">— Sélectionner un lieu —</option>
                {attractions.map(a => (
                  <option key={a.id} value={a.name}>{a.image} {a.name}</option>
                ))}
                <option value="Entrée principale">🚪 Entrée principale</option>
                <option value="Toilettes">🚻 Toilettes</option>
                <option value="Parking">🅿️ Parking</option>
                <option value="Autre">📍 Autre</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!description.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer le signalement
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sent Confirmation */}
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-jardin-50 border border-jardin-200 rounded-xl p-6 text-center"
          >
            <CheckCircle2 className="w-12 h-12 text-jardin-500 mx-auto mb-2" />
            <h3 className="font-bold text-jardin-700">Signalement envoyé !</h3>
            <p className="text-sm text-jardin-600 mt-1">L'équipe du parc a été notifiée et intervient au plus vite.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Previous Reports */}
      {state.reports.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Mes signalements</h3>
          <div className="space-y-2">
            {[...state.reports].reverse().map(report => (
              <div key={report.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold-100 text-gold-600">
                    {report.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {report.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{report.description}</p>
                {report.location && <p className="text-xs text-gray-400 mt-1">📍 {report.location}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
