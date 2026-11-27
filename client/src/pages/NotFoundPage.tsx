import { Link } from 'react-router';

// =============================================================
// Página "no encontrada" (cualquier dirección que no exista)
// =============================================================
export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <p className="mt-2 text-gray-600">La dirección que buscás no existe.</p>

      {/* Link: un vínculo que navega SIN recargar la página.
          Es el reemplazo de <a href="..."> dentro de una app con React Router. */}
      <Link to="/" className="mt-6 inline-block text-sm font-medium underline">
        Volver al catálogo
      </Link>
    </main>
  );
}