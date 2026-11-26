// =============================================================
// Tipos compartidos del frontend.
// Describen la forma de los datos que devuelve la API, para que
// TypeScript nos avise si usamos mal algún campo.
// =============================================================

// Una categoría, tal como la devuelve GET /api/categories
export type Category = {
  id: number;
  name: string;
};

// Un producto, tal como lo devuelve GET /api/products.
// "string | null" = el campo puede venir vacío (es opcional en la base).
export type Product = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: Category; // la categoría viene anidada dentro del producto
};

// Un ítem de la lista de cotización: qué producto y cuántas unidades.
// Este tipo es solo del frontend: la API todavía no lo conoce.
export type QuoteItem = {
  product: Product;
  quantity: number;
};