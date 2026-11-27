import type { Category, CreateQuotePayload, Product } from './types';

// =============================================================
// Comunicación con la API.
// Los componentes no usan fetch directamente: llaman a estas
// funciones. Si cambia algo de la API, se cambia solo acá.
//
// Las cookies (la "pulsera" de la sesión) viajan solas en cada
// request, porque frontend y API comparten dominio gracias al
// proxy de Vite.
// =============================================================

// -------------------------------------------------------------
// Error de la API: guarda el código HTTP y el detalle por campo
// -------------------------------------------------------------
export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>; // ej.: { email: ["Email inválido"] }

  constructor(status: number, message: string, details?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Forma de una respuesta de la API: { data } si salió bien, { error, details } si no
type ApiResponse<T> = {
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
};

// -------------------------------------------------------------
// Función base para PEDIR datos (GET)
// -------------------------------------------------------------
async function getData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || body.data === undefined) {
    throw new ApiError(response.status, body.error ?? `Error ${response.status}`, body.details);
  }

  return body.data;
}

// -------------------------------------------------------------
// Función base para MANDAR datos (POST con JSON)
// "payload: unknown" = acepta cualquier objeto; se convierte a JSON
// -------------------------------------------------------------
async function postData<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || body.data === undefined) {
    throw new ApiError(response.status, body.error ?? `Error ${response.status}`, body.details);
  }

  return body.data;
}

// =============================================================
// CATÁLOGO
// =============================================================

type ProductFilters = {
  categoryId?: number;
  search?: string;
};

// Productos, con filtros opcionales.
// URLSearchParams arma la parte después del "?": "category=2&search=gorra"
export function fetchProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();

  if (filters.categoryId) params.set('category', String(filters.categoryId));
  if (filters.search) params.set('search', filters.search);

  const query = params.toString();
  return getData<Product[]>(`/api/products${query ? `?${query}` : ''}`);
}

// Categorías
export function fetchCategories() {
  return getData<Category[]>('/api/categories');
}

// Crear una cotización
export function createQuote(payload: CreateQuotePayload) {
  return postData<{ id: number; status: string; createdAt: string }>('/api/quotes', payload);
}

// =============================================================
// AUTENTICACIÓN DEL ADMIN
// =============================================================

// Datos del admin que devuelve la API
export type Admin = {
  id: number;
  email: string;
};

// Login: si sale bien, la API manda la cookie de sesión
// y el navegador la guarda solo
export function login(email: string, password: string) {
  return postData<{ email: string }>('/api/auth/login', { email, password });
}

// ¿Quién soy? Si hay sesión válida devuelve el admin; si no, lanza ApiError 401
export function fetchMe() {
  return getData<Admin>('/api/auth/me');
}

// Logout: la API borra la sesión y la cookie.
// Responde 204 (sin body), por eso no usamos postData.
export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
}