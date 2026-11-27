import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { RequireAdmin } from './components/RequireAdmin';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminQuotesPage } from './pages/AdminQuotesPage';
import { CatalogPage } from './pages/CatalogPage';
import { NotFoundPage } from './pages/NotFoundPage';

// =============================================================
// App: el "mapa" de la aplicación.
// Define qué página se muestra en cada dirección (URL).
// =============================================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Todas las páginas se muestran dentro del Layout */}
        <Route element={<Layout />}>
          {/* ---------- Públicas ---------- */}
          <Route path="/" element={<CatalogPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ---------- Protegidas ----------
              Todo lo que esté adentro pasa primero por RequireAdmin.
              Cuando sumemos más páginas del panel, van acá adentro. */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminQuotesPage />} />
          </Route>

          {/* Cualquier otra dirección */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;