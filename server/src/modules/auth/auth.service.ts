import { createHash, randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { admins, sessions } from '../../db/schema.js';
import { AppError } from '../../lib/errors.js';
import { verifyPassword } from '../../lib/password.js';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function login(email: string, password: string) {
  const [admin] = await db.select().from(admins).where(eq(admins.email, email));

  const isValid = admin ? await verifyPassword(password, admin.passwordHash) : false;

  if (!admin || !isValid) {
    throw new AppError(401, 'Email o contraseña incorrectos');
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(sessions).values({
    id: hashToken(token),
    adminId: admin.id,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function getAdminById(id: number) {
  const [admin] = await db
    .select({ id: admins.id, email: admins.email })
    .from(admins)
    .where(eq(admins.id, id));

  return admin ?? null;
}

export async function logout(token: string) {
  await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
}