import { Router } from 'express';
import { submitQuote } from './quotes.controller.js';

export const quotesRouter = Router();

quotesRouter.post('/', submitQuote);