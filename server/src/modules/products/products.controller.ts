import type { Request, Response } from 'express';
import { getProductById, getProducts } from './products.service.js';
import { parseId } from '../../lib/parse-id.js';


export async function listProducts(req: Request, res: Response) {
  const { category, search } = req.query;

  let categoryId: number | undefined;

  if (category !== undefined) {
    const parsed = parseId(category);
    if (parsed === null) {
      res.status(400).json({ error: 'El parámetro "category" debe ser un ID válido' });
      return;
    }
    categoryId = parsed;
  }

  const data = await getProducts({
    categoryId,
    search: typeof search === 'string' ? search.trim() : undefined,
  });

  res.json({ data });
}

export async function getProduct(req: Request, res: Response) {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  const product = await getProductById(id);

  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  res.json({ data: product });
}