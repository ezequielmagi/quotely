import { useNavigate } from 'react-router';
import { logout } from '../api';

// =============================================================
// Página del panel admin (dirección: "/admin")
// Protegida por RequireAdmin: solo se ve con sesión iniciada.
// Por ahora tiene el botón de logout; el listado viene después.
// =============================================================
export function AdminQuotesPage() {
  const navigate = useNavigate();

  // Cierra la sesión y vuelve al login
  async function handleLogout() {
    await logout();                               // la API borra la sesión y la cookie
    navigate('/admin/login', { replace: true });  // volvemos al login
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Título + botón, uno a cada lado (justify-between) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cotizaciones</h1>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Cerrar sesión
        </button>
      </div>

      <p className="mt-2 text-gray-600">Próximamente: listado de cotizaciones.</p>
    </main>
  );
}