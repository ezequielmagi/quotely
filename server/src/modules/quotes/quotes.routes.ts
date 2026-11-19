import { Router } from 'express';
import { listQuotes, submitQuote } from './quotes.controller.js';

// Rutas públicas: las usa el cliente
export const quotesRouter = Router();
quotesRouter.post('/', submitQuote);

// Rutas del panel: las usa el admin
export const adminQuotesRouter = Router();
adminQuotesRouter.get('/', listQuotes);