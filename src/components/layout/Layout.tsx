import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="flex flex-col min-h-dvh max-w-md mx-auto bg-white relative shadow-lg">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
