import type { QuoteItem } from '../types';

// -------------------------------------------------------------
// Props: lo que recibe el panel desde App
// -------------------------------------------------------------
type QuoteSummaryProps = {
  items: QuoteItem[];                                              // la lista actual
  onQuantityChange: (productId: number, quantity: number) => void; // señal: cambiar cantidad
  onRemove: (productId: number) => void;                           // señal: quitar producto
};

// -------------------------------------------------------------
// Panel lateral "Tu cotización".
// Muestra los productos elegidos y permite cambiar cantidades o
// quitarlos. No modifica la lista él mismo: le avisa a App.
// -------------------------------------------------------------
export function QuoteSummary({ items, onQuantityChange, onRemove }: QuoteSummaryProps) {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Tu cotización</h2>

      {/* "Si / sino" dentro del JSX:
          si la lista está vacía → mensaje; si no → la lista */}
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">Todavía no agregaste productos.</p>
      ) : (
        // divide-y: dibuja una línea divisoria entre cada elemento
        <ul className="mt-4 divide-y divide-gray-100">

          {/* Una fila por cada ítem. { product, quantity } saca esos
              dos datos directamente de cada ítem */}
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-3 py-3">

              {/* Nombre: flex-1 hace que ocupe el espacio sobrante */}
              <span className="flex-1 text-sm">{product.name}</span>

              {/* Cantidad editable.
                  Number(...) convierte el texto del input en número.
                  "|| 1" usa 1 si el resultado es 0 o inválido (input vacío).
                  Math.max(1, ...) asegura que nunca sea menor a 1,
                  la misma regla que valida el backend (quantity > 0). */}
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) =>
                  onQuantityChange(product.id, Math.max(1, Number(event.target.value) || 1))
                }
                className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                aria-label={`Cantidad de ${product.name}`}  // descripción para lectores de pantalla
              />

              {/* Quitar de la lista */}
              <button
                type="button"
                onClick={() => onRemove(product.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}