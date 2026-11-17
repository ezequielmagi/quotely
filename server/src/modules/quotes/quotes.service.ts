import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { contacts, products, quoteItems, quotes } from '../../db/schema.js';
import { AppError } from '../../lib/errors.js';
import type { CreateQuoteInput } from './quotes.schema.js';

export async function createQuote(input: CreateQuoteInput) {
  return db.transaction(async (tx) => {
    // 1. Verificar que todos los productos existan y estén activos
    const productIds = input.items.map((item) => item.productId);

    const foundProducts = await tx
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(and(inArray(products.id, productIds), eq(products.isActive, true)));

    const nameById = new Map(foundProducts.map((p) => [p.id, p.name]));
    const missing = productIds.filter((id) => !nameById.has(id));

    if (missing.length > 0) {
      throw new AppError(422, `Productos no disponibles: ${missing.join(', ')}`);
    }

    // 2. Crear el contacto o actualizarlo si el email ya existe
    const { name, email, company, phone } = input.contact;

    const [contact] = await tx
      .insert(contacts)
      .values({ name, email, company: company || null, phone: phone || null })
      .onConflictDoUpdate({
        target: contacts.email,
        set: {
          name,
          ...(company ? { company } : {}),
          ...(phone ? { phone } : {}),
          updatedAt: new Date(),
        },
      })
      .returning({ id: contacts.id });

    // 3. Crear la cotización
    const [quote] = await tx
      .insert(quotes)
      .values({
        contactId: contact.id,
        comment: input.comment || null,
        privacyAcceptedAt: new Date(),
      })
      .returning({ id: quotes.id, status: quotes.status, createdAt: quotes.createdAt });

    // 4. Crear los ítems, con la copia del nombre del producto
    await tx.insert(quoteItems).values(
      input.items.map((item) => ({
        quoteId: quote.id,
        productId: item.productId,
        productName: nameById.get(item.productId)!, // validado en el paso 1
        quantity: item.quantity,
      })),
    );

    return quote;
  });
}