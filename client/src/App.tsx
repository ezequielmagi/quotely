import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from './api';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import type { Category, Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categorías: se piden una sola vez
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError('No se pudieron cargar las categorías'));
  }, []);

  // Productos: se piden de nuevo cada vez que cambia un filtro
  useEffect(() => {
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

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Quotely</h1>
        <p className="mt-1 text-gray-600">Catálogo de productos</p>
      </header>

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

export default App;