import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ApiError, login } from '../api';

// Clases compartidas por los inputs
const inputClass =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none';

// =============================================================
// Página de login del admin (dirección: "/admin/login")
// =============================================================
export function AdminLoginPage() {
  // Campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ¿Se está enviando? (para desactivar el botón)
  const [sending, setSending] = useState(false);

  // Mensaje de error, si el login falla
  const [error, setError] = useState<string | null>(null);

  // useNavigate devuelve una función para cambiar de página desde el código
  // (no con un clic en un Link, sino cuando algo pasa: por ejemplo, el login salió bien)
  const navigate = useNavigate();

  // Se ejecuta al enviar el formulario
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // evita que el form recargue la página

    setSending(true);
    setError(null);

    try {
      // Si los datos están bien, la API manda la cookie de sesión
      await login(email, password);

      // Vamos al panel. "replace" reemplaza el login en el historial:
      // si después tocás "atrás", no volvés al formulario de login.
      navigate('/admin', { replace: true });
    } catch (err) {
      // 401 = email o contraseña incorrectos (el mensaje viene de la API)
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Ingreso al panel</h1>
      <p className="mt-1 text-sm text-gray-600">Acceso solo para administradores.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Email */}
        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            autoComplete="email"   // permite que el navegador sugiera emails guardados
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </label>

        {/* Contraseña: type="password" oculta lo que escribís */}
        <label className="block text-sm">
          Contraseña
          <input
            type="password"
            required
            autoComplete="current-password" // permite usar el gestor de contraseñas
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </label>

        {/* Error: solo si hay */}
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {/* Botón: desactivado mientras se envía */}
        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {sending ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
}