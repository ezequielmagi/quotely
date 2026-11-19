import type { Request, Response } from 'express';
import { z } from 'zod';
import { createQuoteSchema } from './quotes.schema.js';
import { createQuote, getQuoteById, getQuotes } from './quotes.service.js';
import { parseId } from '../../lib/parse-id.js';

export async function submitQuote(req: Request, res: Response) {
  const result = createQuoteSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: 'Datos inválidos',
      details: z.flattenError(result.error).fieldErrors,
    });
    return;
  }

  const quote = await createQuote(result.data);

  res.status(201).json({ data: quote });
}

export async function listQuotes(_req: Request, res: Response) {
  const data = await getQuotes();
  res.json({ data });
}

export async function getQuote(req: Request, res: Response) {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  const quote = await getQuoteById(id);

  if (!quote) {
    res.status(404).json({ error: 'Cotización no encontrada' });
    return;
  }

  res.json({ data: quote });
}