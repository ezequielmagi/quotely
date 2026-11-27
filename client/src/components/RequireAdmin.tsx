import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { fetchMe } from '../api';

// Los tres estados posibles de la verificación.
// Un tipo hecho de textos fijos: solo puede valer uno de estos tres.
type Status = 'checking' | 'ok' | 'denied';

// =============================================================
// RequireAdmin: "patovica" del frontend.
// Se pone delante de las páginas del panel. Le pregunta a la API
// si hay una sesión válida:
//   - verificando → muestra un mensaje de espera
//   - sin sesión  → redirige al login
//   - con sesión  → muestra la página (en el lugar de <Outlet />)
//
// OJO: la seguridad real está en el backend (requireAuth).
// Esto solo evita mostrar un panel vacío a quien no inició sesión.
// =============================================================
export function RequireAdmin() {
  const [status, setStatus] = useState<Status>('checking');

  // Al aparecer, consulta GET /api/auth/me
  useEffect(() => {
    fetchMe()
      .then(() => setStatus('ok'))        // 200 → hay sesión
      .catch(() => setStatus('denied'));  // 401 (o error) → no hay sesión
  }, []);

  // Mientras espera la respuesta
  if (status === 'checking') {
    return <p className="mx-auto max-w-6xl px-4 py-10 text-gray-500">Verificando sesión...</p>;
  }

  // Sin sesión: <Navigate> redirige apenas se dibuja.
  // "replace" evita que el panel quede en el historial.
  if (status === 'denied') {
    return <Navigate to="/admin/login" replace />;
  }

  // Con sesión: muestra la página protegida
  return <Outlet />;
}