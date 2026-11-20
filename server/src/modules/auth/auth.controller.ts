import type { Request, Response } from 'express';
import { z } from 'zod';
import { loginSchema } from './auth.schema.js';
import { getAdminById, login, logout } from './auth.service.js';

export const SESSION_COOKIE = 'quotely_session';

export async function loginAdmin(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: 'Datos inválidos',
      details: z.flattenError(result.error).fieldErrors,
    });
    return;
  }

  const { token, expiresAt } = await login(result.data.email, result.data.password);

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  res.json({ data: { email: result.data.email } });
}

export async function getMe(_req: Request, res: Response) {
  const admin = await getAdminById(res.locals.adminId);
  res.json({ data: admin });
}

export async function logoutAdmin(req: Request, res: Response) {
  const token = req.cookies?.[SESSION_COOKIE];

  if (typeof token === 'string') {
    await logout(token);
  }

  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.status(204).end();
}