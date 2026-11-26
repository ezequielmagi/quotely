import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from './api';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import { QuoteSummary } from './components/QuoteSummary';
import type { Category, Product, QuoteItem } from './types';

function App() {
  // =============================================================
  // MEMORIA (estado) del componente
  // Cada useState guarda un dato. Cuando cambia, React redibuja.
  // =============================================================

  // Datos que vienen de la API
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filtros elegidos por el usuario
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined); // undefined = todas
  const [search, setSearch] = useState('');

  // Estado de la carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lista de cotización: vive acá porque la usan las tarjetas Y el panel
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  // =============================================================
  // EFECTOS: pedidos a la API
  // =============================================================

  // Categorías: se piden UNA sola vez, cuando aparece la página ([] vacío)
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError('No se pudieron cargar las categorías'));
  }, []);

  // Productos: se vuelven a pedir cada vez que cambia un filtro
  useEffect(() => {
    // "ignore" descarta respuestas de pedidos viejos.
    // Ej.: si escribís rápido "gor", salen 3 pedidos (g, go, gor).
    // Si el de "g" llega último, no debe pisar al de "gor".
    let ignore = false;

    fetchProducts({ categoryId, search })
      .then((data) => {
        if (!ignore) {
          setProducts(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!ignore) setError('No se pudieron cargar los productos');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    // Esta función se ejecuta ANTES del próximo pedido:
    // marca el pedido actual como "viejo" para ignorar su respuesta.
    return () => {
      ignore = true;
    };
  }, [categoryId, search]); // ← se re-ejecuta cuando cambia alguno de estos

  // =============================================================
  // LISTA DE COTIZACIÓN
  // Regla de React: nunca modificar la lista existente, siempre
  // crear una nueva. Por eso se usa [...], .map y .filter.
  //
  // setQuoteItems((items) => ...) recibe la lista ACTUAL y devuelve
  // la nueva. Así siempre trabajamos con la versión más reciente.
  // =============================================================

  // Agrega un producto con cantidad 1 (si no estaba ya)
  function addToQuote(product: Product) {
    setQuoteItems((items) => {
      // .some = "¿hay alguno que cumpla esto?" → si ya está, no cambia nada
      if (items.some((item) => item.product.id === product.id)) return items;

      // Lista nueva: todos los anteriores + el nuevo al final
      return [...items, { product, quantity: 1 }];
    });
  }

  // Cambia la cantidad de un producto
  function updateQuantity(productId: number, quantity: number) {
    setQuoteItems((items) =>
      // .map recorre todos y devuelve una lista nueva:
      // al que coincide le copia todo ({ ...item }) y le cambia la cantidad;
      // a los demás los deja igual
      items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  }

  // Quita un producto de la lista
  function removeFromQuote(productId: number) {
    setQuoteItems((items) =>
      // .filter devuelve una lista nueva con todos MENOS el que coincide
      items.filter((item) => item.product.id !== productId),
    );
  }

  // ¿Este producto ya está en la lista? (para el botón de cada tarjeta)
  function isInQuote(productId: number) {
    return quoteItems.some((item) => item.product.id === productId);
  }

  // =============================================================
  // LO QUE SE VE
  // =============================================================
  return (
    // Contenedor centrado, con ancho máximo y aire alrededor
    <main className="mx-auto max-w-6xl px-4 py-10">

      {/* Encabezado */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Quotely</h1>
        <p className="mt-1 text-gray-600">Catálogo de productos</p>
      </header>

      {/* Dos columnas en pantallas grandes (lg):
          catálogo a la izquierda (1fr = todo el espacio libre)
          y panel de cotización a la derecha (320px fijos).
          En pantallas chicas, todo en una sola columna. */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

        {/* ---------- Columna izquierda: catálogo ---------- */}
        <section>
          {/* Filtros: reciben los valores actuales y las "señales" para cambiarlos */}
          <ProductFilters
            categories={categories}
            categoryId={categoryId}
            search={search}
            onCategoryChange={setCategoryId}
            onSearchChange={setSearch}
          />

          {/* Mensajes de estado */}
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Búsqueda sin resultados */}
          {!loading && !error && products.length === 0 && (
            <p className="text-gray-500">No hay productos que coincidan con la búsqueda.</p>
          )}

          {/* Grilla de tarjetas: 1 columna en celular, 2 en sm, 3 en xl */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                inQuote={isInQuote(product.id)}
                onAdd={addToQuote}
              />
            ))}
          </div>
        </section>

        {/* ---------- Columna derecha: panel de cotización ----------
            lg:sticky + lg:top-6: el panel queda fijo al scrollear.
            lg:self-start: necesario para que sticky funcione dentro del grid. */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <QuoteSummary
            items={quoteItems}
            onQuantityChange={updateQuantity}
            onRemove={removeFromQuote}
          />
        </div>
      </div>
    </main>
  );
}

export default App;