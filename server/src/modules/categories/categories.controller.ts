import type { Request, Response } from 'express';
import { getAllCategories } from './categories.service.js';

export async function listCategories(_req: Request, res: Response) {
  const data = await getAllCategories();
  res.json({ data });
}