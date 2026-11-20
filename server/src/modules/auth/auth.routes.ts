import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth.js';
import { getMe, loginAdmin, logoutAdmin } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', loginAdmin);
authRouter.get('/me', requireAuth, getMe);
authRouter.post('/logout', requireAuth, logoutAdmin);