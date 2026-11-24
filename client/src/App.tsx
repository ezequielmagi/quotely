import { useEffect, useState } from 'react';
import { fetchProducts } from './api';
import type { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('No se pudieron cargar los productos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <h1>Quotely</h1>
      <h2>Catálogo de productos</h2>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> — {product.category.name}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;