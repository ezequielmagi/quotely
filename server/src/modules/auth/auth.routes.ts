import { Router } from 'express';
import { loginAdmin } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', loginAdmin);