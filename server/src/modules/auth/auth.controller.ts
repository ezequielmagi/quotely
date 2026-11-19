import type { Request, Response } from 'express';
import { z } from 'zod';
import { loginSchema } from './auth.schema.js';
import { login } from './auth.service.js';

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