import { Router } from 'express';
import { getProduct, listProducts } from './products.controller.js';

export const productsRouter = Router();

productsRouter.get('/', listProducts);
productsRouter.get('/:id', getProduct);