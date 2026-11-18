import 'dotenv/config';
import { db } from '../db/index.js';
import { admins } from '../db/schema.js';
import { hashPassword } from '../lib/password.js';

const [email, password] = process.argv.slice(2);

async function main() {
  if (!email || !password) {
    console.error('Uso: npm run admin:create -- <email> <contraseña>');
    process.exit(1);
  }

  if (password.length < 10) {
    console.error('La contraseña debe tener al menos 10 caracteres');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  await db.insert(admins).values({
    email: email.trim().toLowerCase(),
    passwordHash,
  });

  console.log(`Admin creado: ${email}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});