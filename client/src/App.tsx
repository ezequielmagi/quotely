import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from './api';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import { QuoteForm } from './components/QuoteForm'; // NUEVO
import { QuoteSummary } from './components/QuoteSummary';
import type { Category, Product, QuoteItem } from './types';

function App() {
  // =============================================================
  // MEMORIA (estado) del componente
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

  // Lista de cotización: vive acá porque la usan las tarjetas, el panel y el formulario
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  // NUEVO: número de la última cotización enviada (null = no se envió ninguna)
  const [sentQuoteId, setSentQuoteId] = useState<number | null>(null);

  // =============================================================
  // EFECTOS: pedidos a la API
  // =============================================================

  // Categorías: se piden una sola vez
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError('No se pudieron cargar las categorías'));
  }, []);

  // Productos: se vuelven a pedir cada vez que cambia un filtro
  useEffect(() => {
    // "ignore" descarta respuestas de pedidos viejos
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

    return () => {
      ignore = true;
    };
  }, [categoryId, search]);

  // =============================================================
  // LISTA DE COTIZACIÓN (siempre se crea una lista nueva)
  // =============================================================

  // Agrega un producto con cantidad 1 (si no estaba ya)
  function addToQuote(product: Product) {
    setSentQuoteId(null); // NUEVO: si arranca un pedido nuevo, ocultamos el mensaje de éxito anterior

    setQuoteItems((items) => {
      if (items.some((item) => item.product.id === product.id)) return items;
      return [...items, { product, quantity: 1 }];
    });
  }

  // Cambia la cantidad de un producto
  function updateQuantity(productId: number, quantity: number) {
    setQuoteItems((items) =>
      items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  }

  // Quita un producto de la lista
  function removeFromQuote(productId: number) {
    setQuoteItems((items) => items.filter((item) => item.product.id !== productId));
  }

  // ¿Este producto ya está en la lista?
  function isInQuote(productId: number) {
    return quoteItems.some((item) => item.product.id === productId);
  }

  // NUEVO: se ejecuta cuando el formulario se envió con éxito
  function handleQuoteSent(quoteId: number) {
    setQuoteItems([]);         // vaciamos la lista
    setSentQuoteId(quoteId);   // guardamos el número para mostrar el mensaje
  }

  // =============================================================
  // LO QUE SE VE
  // =============================================================
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Encabezado */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Quotely</h1>
        <p className="mt-1 text-gray-600">Catálogo de productos</p>
      </header>

      {/* Dos columnas en pantallas grandes: catálogo + panel */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* ---------- Columna izquierda: catálogo ---------- */}
        <section>
          <ProductFilters
            categories={categories}
            categoryId={categoryId}
            search={search}
            onCategoryChange={setCategoryId}
            onSearchChange={setSearch}
          />

          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="text-gray-500">No hay productos que coincidan con la búsqueda.</p>
          )}

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

        {/* ---------- Columna derecha: mensaje + panel + formulario ----------
            space-y-4: separa verticalmente los elementos de adentro */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {/* NUEVO: mensaje de éxito, solo si se acaba de enviar una cotización */}
          {sentQuoteId !== null && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              ¡Listo! Recibimos tu pedido <strong>#{sentQuoteId}</strong>. Te vamos a contactar por
              email.
            </div>
          )}

          <QuoteSummary
            items={quoteItems}
            onQuantityChange={updateQuantity}
            onRemove={removeFromQuote}
          />

          {/* NUEVO: el formulario aparece solo si hay productos en la lista */}
          {quoteItems.length > 0 && <QuoteForm items={quoteItems} onSuccess={handleQuoteSent} />}
        </div>
      </div>
    </main>
  );
}

export default App;