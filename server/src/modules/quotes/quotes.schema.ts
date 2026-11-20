import { z } from 'zod';
import { quoteStatus } from '../../db/schema.js';

export const createQuoteSchema = z.object({
  contact: z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').max(150),
    email: z.string().trim().toLowerCase().pipe(z.email('Email inválido')),
    company: z.string().trim().max(150).optional(),
    phone: z.string().trim().max(50).optional(),
  }),
  comment: z.string().trim().max(2000).optional(),
  privacyAccepted: z.literal(true, 'Hay que aceptar la política de privacidad'),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive().max(100000),
      }),
    )
    .min(1, 'La cotización debe tener al menos un producto')
    .max(50)
    .refine(
      (items) => new Set(items.map((item) => item.productId)).size === items.length,
      'Hay productos repetidos',
    ),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;

export const updateStatusSchema = z.object({
  status: z.enum(quoteStatus.enumValues),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;