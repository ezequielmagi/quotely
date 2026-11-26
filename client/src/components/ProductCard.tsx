import type { Product } from '../types';

// -------------------------------------------------------------
// Props: los datos que recibe la tarjeta desde App
// -------------------------------------------------------------
type ProductCardProps = {
  product: Product;                    // el producto a mostrar
  inQuote: boolean;                    // ¿ya está en la lista de cotización?
  onAdd: (product: Product) => void;   // "señal" para avisarle a App que lo agregue
};

// -------------------------------------------------------------
// Tarjeta de un producto del catálogo.
// No guarda memoria propia: solo muestra lo que recibe por props
// y avisa a App cuando se toca el botón.
// -------------------------------------------------------------
export function ProductCard({ product, inQuote, onAdd }: ProductCardProps) {
  return (
    // flex flex-col: los elementos se apilan en columna.
    // hover:...: la tarjeta sube un poco y agranda la sombra al pasar el mouse.
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Imagen: solo se muestra si el producto tiene una URL cargada */}
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-[3/2] w-full object-cover"
        />
      )}

      {/* Contenido de texto. flex-1 hace que ocupe todo el alto disponible */}
      <div className="flex flex-1 flex-col p-4">

        {/* Categoría: texto chico, en mayúsculas */}
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {product.category.name}
        </span>

        {/* Nombre del producto */}
        <h3 className="mt-1 font-semibold">{product.name}</h3>

        {/* Descripción: solo si existe */}
        {product.description && (
          <p className="mt-2 text-sm text-gray-600">{product.description}</p>
        )}

        {/* Botón. El contenedor con mt-auto lo empuja al fondo de la
            tarjeta, para que todos los botones queden alineados aunque
            las descripciones tengan distinto largo */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => onAdd(product)}   // al tocar: avisa a App
            disabled={inQuote}               // si ya está agregado, se desactiva
            className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-500"
          >
            {/* El texto cambia según si ya está en la lista */}
            {inQuote ? 'Agregado ✓' : 'Agregar a la cotización'}
          </button>
        </div>
      </div>
    </article>
  );
}