import type { Product } from './types';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');

  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos');
  }

  const body = (await response.json()) as { data: Product[] };
  return body.data;
}