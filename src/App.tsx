import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { QuestsPage } from './pages/QuestsPage';
import { AttractionsPage } from './pages/AttractionsPage';
import { ParcoursPage } from './pages/ParcoursPage';
import { ReportPage } from './pages/ReportPage';

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
            <Route path="/parcours" element={<ParcoursPage />} />
            <Route path="/signaler" element={<ReportPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
