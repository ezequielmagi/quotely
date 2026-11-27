import { Link, NavLink, Outlet } from 'react-router';

// -------------------------------------------------------------
// Estilo de cada vínculo del menú.
// NavLink nos dice si su dirección es la actual (isActive),
// así podemos resaltar la página en la que estás.
// -------------------------------------------------------------
function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-900';
}

// =============================================================
// Layout: la estructura común a todas las páginas.
// El encabezado se ve siempre; <Outlet /> es el "hueco" donde
// React Router pone la página que corresponde a la dirección.
// =============================================================
export function Layout() {
  return (
    <div className="min-h-screen">
      {/* ---------- Encabezado ---------- */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          {/* Logo: vuelve al catálogo */}
          <Link to="/" className="text-xl font-bold">
            Quotely
          </Link>

          {/* Menú */}
          <nav className="flex gap-6 text-sm">
            {/* "end": solo se marca activo en "/" exacto,
                no en cualquier dirección que empiece con "/" */}
            <NavLink to="/" end className={navClass}>
              Catálogo
            </NavLink>
            <NavLink to="/admin" className={navClass}>
              Panel admin
            </NavLink>
          </nav>
        </div>
      </header>

      {/* ---------- Contenido de la página actual ---------- */}
      <Outlet />
    </div>
  );
}