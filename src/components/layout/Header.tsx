import { useApp } from '../../context/AppContext';
import { Star } from 'lucide-react';

export function Header() {
  const { state } = useApp();

  return (
    <header className="bg-jardin-600 text-white px-4 py-2 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src="/logo-jardin.svg" alt="Jardin d'Acclimatation" className="w-9 h-9 rounded-full bg-white p-0.5" />
        <h1 className="text-lg font-bold tracking-tight">Comp'Accli</h1>
      </div>
      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
        <Star className="w-4 h-4 text-gold-400" />
        <span className="text-sm font-semibold">{state.user.points} pts</span>
        <span className="text-xs bg-gold-400 text-bark rounded-full px-1.5 py-0.5 font-bold">
          Niv. {state.user.level}
        </span>
      </div>
    </header>
  );
}
