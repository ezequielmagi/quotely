import type { NextFunction, Request, Response } from 'express';
import { and, eq, gt } from 'drizzle-orm';
import { db } from '../db/index.js';
import { sessions } from '../db/schema.js';
import { AppError } from '../lib/errors.js';
import { SESSION_COOKIE } from '../modules/auth/auth.controller.js';
import { hashToken } from '../modules/auth/auth.service.js';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  // 1. ¿Trae pulsera?
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token !== 'string') {
    throw new AppError(401, 'No autenticado');
  }

  // 2. ¿Existe en el cuaderno y no venció?
  const [session] = await db
    .select({ adminId: sessions.adminId })
    .from(sessions)
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())));

  if (!session) {
    throw new AppError(401, 'Sesión inválida o vencida');
  }

  // 3. Todo OK: anotamos quién es y lo dejamos pasar
  res.locals.adminId = session.adminId;
  next();
}