import type { Category, CreateQuotePayload, Product } from './types';

// =============================================================
// Comunicación con la API.
// Los componentes no usan fetch directamente: llaman a estas
// funciones. Así, si cambia algo de la API, se cambia solo acá.
// =============================================================

// -------------------------------------------------------------
// Error de la API.
// Guarda el código HTTP y, si vino, el detalle de qué campo falló
// (lo que arma z.flattenError en el backend).
// -------------------------------------------------------------
export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>; // ej.: { contact: ["Email inválido"] }

  constructor(status: number, message: string, details?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// -------------------------------------------------------------
// Función base para PEDIR datos (GET).
// <T> es un "hueco" de tipo: getData<Product[]> devuelve productos,
// getData<Category[]> devuelve categorías.
// -------------------------------------------------------------
async function getData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  // response.ok es true si el código fue 2xx
  if (!response.ok) {
    throw new ApiError(response.status, `Error ${response.status} al pedir ${url}`);
  }

  // La API siempre responde { data: ... }: devolvemos solo "data"
  const body = (await response.json()) as { data: T };
  return body.data;
}

// -------------------------------------------------------------
// Productos (con filtros opcionales)
// -------------------------------------------------------------
type ProductFilters = {
  categoryId?: number;
  search?: string;
};

export function fetchProducts(filters: ProductFilters = {}) {
  // URLSearchParams arma la parte de la URL después del "?"
  // Ej.: { categoryId: 2, search: "gorra" } → "category=2&search=gorra"
  const params = new URLSearchParams();

  if (filters.categoryId) params.set('category', String(filters.categoryId));
  if (filters.search) params.set('search', filters.search);

  const query = params.toString();
  return getData<Product[]>(`/api/products${query ? `?${query}` : ''}`);
}

// -------------------------------------------------------------
// Categorías
// -------------------------------------------------------------
export function fetchCategories() {
  return getData<Category[]>('/api/categories');
}

// -------------------------------------------------------------
// Crear una cotización (POST /api/quotes)
// -------------------------------------------------------------
export async function createQuote(payload: CreateQuotePayload) {
  const response = await fetch('/api/quotes', {
    method: 'POST',                                   // estamos creando algo
    headers: { 'Content-Type': 'application/json' },  // "lo que mando es JSON"
    body: JSON.stringify(payload),                    // objeto → texto JSON
  });

  // La respuesta puede ser éxito ({ data }) o error ({ error, details })
  const body = (await response.json()) as {
    data?: { id: number; status: string; createdAt: string };
    error?: string;
    details?: Record<string, string[]>;
  };

  // Si la API respondió 400, 422 o 500, lanzamos un ApiError con el detalle
  if (!response.ok || !body.data) {
    throw new ApiError(response.status, body.error ?? 'Error al enviar la cotización', body.details);
  }

  return body.data;
}