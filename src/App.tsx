import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { QuestsPage } from './pages/QuestsPage';
import { AttractionsPage } from './pages/AttractionsPage';
import { ChatPage } from './pages/ChatPage';
import { ARPage } from './pages/ARPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/carte" element={<MapPage />} />
            <Route path="/quetes" element={<QuestsPage />} />
            <Route path="/attractions" element={<AttractionsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/ar" element={<ARPage />} />
            <Route path="/profil" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
