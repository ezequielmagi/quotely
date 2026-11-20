import { Router } from 'express';
import { changeQuoteStatus, getQuote, listQuotes, submitQuote } from './quotes.controller.js';

// Rutas públicas: las usa el cliente
export const quotesRouter = Router();
quotesRouter.post('/', submitQuote);

// Rutas del panel: las usa el admin
export const adminQuotesRouter = Router();
adminQuotesRouter.get('/', listQuotes);
adminQuotesRouter.get('/:id', getQuote);
adminQuotesRouter.patch('/:id/status', changeQuoteStatus);