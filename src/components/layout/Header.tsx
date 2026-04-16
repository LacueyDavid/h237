import { useApp } from '../../context/AppContext';
import { TreePine, Star } from 'lucide-react';

export function Header() {
  const { state } = useApp();

  return (
    <header className="bg-gradient-to-r from-jardin-600 to-jardin-700 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <TreePine className="w-6 h-6" />
        <h1 className="text-lg font-bold tracking-tight">Accli'Guide</h1>
      </div>
      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
        <Star className="w-4 h-4 text-gold-300" />
        <span className="text-sm font-semibold">{state.user.points} pts</span>
        <span className="text-xs bg-gold-400 text-bark rounded-full px-1.5 py-0.5 font-bold">
          Niv. {state.user.level}
        </span>
      </div>
    </header>
  );
}
