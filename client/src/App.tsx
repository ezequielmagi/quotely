import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
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
    // BrowserRouter: activa el ruteo usando la barra de direcciones del navegador
    <BrowserRouter>
      <Routes>
        {/* Ruta "contenedora": todas las de adentro se muestran
            dentro del Layout, en el lugar de su <Outlet /> */}
        <Route element={<Layout />}>
          {/* Catálogo: la página principal */}
          <Route path="/" element={<CatalogPage />} />

          {/* Panel admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminQuotesPage />} />

          {/* "*" = cualquier otra dirección que no coincida con las de arriba */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;