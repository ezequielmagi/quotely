import { and, asc, eq, ilike } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { categories, products } from '../../db/schema.js';

type ProductFilters = {
  categoryId?: number;
  search?: string;
};

// Campos que se exponen al frontend (reutilizados en listado y detalle)
const productFields = {
  id: products.id,
  name: products.name,
  description: products.description,
  imageUrl: products.imageUrl,
  category: {
    id: categories.id,
    name: categories.name,
  },
};

export async function getProducts(filters: ProductFilters) {
  const conditions = [eq(products.isActive, true)];

  if (filters.categoryId !== undefined) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }

  if (filters.search) {
    conditions.push(ilike(products.name, `%${filters.search}%`));
  }

  return db
    .select(productFields)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(asc(products.name));
}

export async function getProductById(id: number) {
  const [product] = await db
    .select(productFields)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.id, id), eq(products.isActive, true)));

  return product ?? null;
}