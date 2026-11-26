import { useState, type FormEvent } from 'react';
import { ApiError, createQuote } from '../api';
import type { QuoteItem } from '../types';

// -------------------------------------------------------------
// Props
// -------------------------------------------------------------
type QuoteFormProps = {
  items: QuoteItem[];                    // los productos a cotizar
  onSuccess: (quoteId: number) => void;  // señal para App: "se envió, este es el número"
};

// Clases de los inputs: se repiten en todos, así que las guardamos en una constante
const inputClass =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none';

// Valores iniciales del formulario (todo vacío)
const emptyForm = {
  name: '',
  email: '',
  company: '',
  phone: '',
  comment: '',
  privacyAccepted: false,
};

// -------------------------------------------------------------
// Formulario de datos de contacto + envío de la cotización
// -------------------------------------------------------------
export function QuoteForm({ items, onSuccess }: QuoteFormProps) {
  // Todos los campos en un solo objeto de memoria
  const [form, setForm] = useState(emptyForm);

  // ¿Se está enviando? Sirve para desactivar el botón y evitar duplicados
  const [sending, setSending] = useState(false);

  // Mensajes de error para mostrar debajo del formulario
  const [errors, setErrors] = useState<string[]>([]);

  // Actualiza UN campo del formulario.
  // { ...current } copia todos los campos; [field]: value reemplaza solo el indicado.
  // keyof typeof emptyForm = "uno de los nombres de campo válidos" (name, email, ...)
  function updateField(field: keyof typeof emptyForm, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  // Se ejecuta al apretar "Enviar cotización"
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Por defecto, un <form> recarga la página al enviarse. Esto lo evita.
    event.preventDefault();

    setSending(true);  // desactiva el botón
    setErrors([]);     // limpia errores anteriores

    try {
      // Armamos lo que espera la API.
      // "|| undefined": si un campo opcional está vacío, no lo mandamos.
      const quote = await createQuote({
        contact: {
          name: form.name,
          email: form.email,
          company: form.company || undefined,
          phone: form.phone || undefined,
        },
        comment: form.comment || undefined,
        privacyAccepted: form.privacyAccepted,
        // De cada ítem mandamos solo el ID del producto y la cantidad
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      // Éxito: limpiamos el formulario y le avisamos a App
      setForm(emptyForm);
      onSuccess(quote.id);
    } catch (error) {
      if (error instanceof ApiError) {
        // Si el backend mandó detalle por campo, mostramos todos esos mensajes.
        // Object.values(...).flat() junta todas las listas en una sola.
        setErrors(error.details ? Object.values(error.details).flat() : [error.message]);
      } else {
        // Error inesperado (ej.: la API no responde)
        setErrors(['No se pudo enviar la cotización. Probá de nuevo.']);
      }
    } finally {
      // Pase lo que pase, el botón se vuelve a activar
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Tus datos</h2>

      {/* Nombre (obligatorio).
          "required" hace que el navegador no deje enviar si está vacío.
          Es solo comodidad: la validación real la hace el backend. */}
      <label className="block text-sm">
        Nombre *
        <input
          type="text"
          required
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          className={inputClass}
        />
      </label>

      {/* Email (obligatorio). type="email" hace que el navegador chequee el formato */}
      <label className="block text-sm">
        Email *
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          className={inputClass}
        />
      </label>

      {/* Empresa (opcional) */}
      <label className="block text-sm">
        Empresa
        <input
          type="text"
          value={form.company}
          onChange={(event) => updateField('company', event.target.value)}
          className={inputClass}
        />
      </label>

      {/* Teléfono (opcional). type="tel" muestra el teclado numérico en celulares */}
      <label className="block text-sm">
        Teléfono
        <input
          type="tel"
          value={form.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          className={inputClass}
        />
      </label>

      {/* Comentario (opcional) */}
      <label className="block text-sm">
        Comentario
        <textarea
          rows={3}
          value={form.comment}
          onChange={(event) => updateField('comment', event.target.value)}
          className={inputClass}
        />
      </label>

      {/* Aceptación de privacidad (obligatoria).
          En un checkbox se usa "checked" en lugar de "value" */}
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          required
          checked={form.privacyAccepted}
          onChange={(event) => updateField('privacyAccepted', event.target.checked)}
          className="mt-0.5"
        />
        Acepto la política de privacidad y que me contacten por esta cotización.
      </label>

      {/* Errores: solo se muestran si hay alguno */}
      {errors.length > 0 && (
        <ul className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      {/* Botón de envío.
          type="submit" dispara el onSubmit del <form>.
          Se desactiva mientras se envía (evita pedidos duplicados)
          o si la lista está vacía. */}
      <button
        type="submit"
        disabled={sending || items.length === 0}
        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {sending ? 'Enviando...' : 'Enviar cotización'}
      </button>
    </form>
  );
}