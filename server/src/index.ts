import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';
import { AppError } from './lib/errors.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { categoriesRouter } from './modules/categories/categories.routes.js';
import { productsRouter } from './modules/products/products.routes.js';
import { quotesRouter } from './modules/quotes/quotes.routes.js';

import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use(cookieParser());

app.get('/health', async (_req, res) => {
  await db.execute(sql`SELECT 1`);
  res.json({ status: 'ok', database: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/quotes', quotesRouter);

// Manejador central de errores: siempre al final
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});