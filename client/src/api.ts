import type { Category, Product } from './types';

// Función base: pide una URL a la API y devuelve el contenido de "data"
async function getData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error ${response.status} al pedir ${url}`);
  }

  const body = (await response.json()) as { data: T };
  return body.data;
}

type ProductFilters = {
  categoryId?: number;
  search?: string;
};

export function fetchProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();

  if (filters.categoryId) params.set('category', String(filters.categoryId));
  if (filters.search) params.set('search', filters.search);

  const query = params.toString();
  return getData<Product[]>(`/api/products${query ? `?${query}` : ''}`);
}

export function fetchCategories() {
  return getData<Category[]>('/api/categories');
}