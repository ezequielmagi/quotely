import 'dotenv/config';
import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';
import { categoriesRouter } from './modules/categories/categories.routes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get('/health', async (_req, res) => {
  await db.execute(sql`SELECT 1`);
  res.json({ status: 'ok', database: 'ok' });
});

app.use('/api/categories', categoriesRouter);

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});