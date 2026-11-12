import { asc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { categories } from '../../db/schema.js';

export async function getAllCategories() {
  return db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(asc(categories.name));
}