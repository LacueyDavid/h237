import { NavLink } from 'react-router-dom';
import { Home, Map, Compass, Route, AlertTriangle } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/carte', icon: Map, label: 'Carte' },
  { to: '/quetes', icon: Compass, label: 'Quêtes' },
  { to: '/parcours', icon: Route, label: 'Parcours' },
  { to: '/signaler', icon: AlertTriangle, label: 'Signaler' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center py-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 px-3 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-jardin-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
