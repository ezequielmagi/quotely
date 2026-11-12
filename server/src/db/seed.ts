import 'dotenv/config';
import { db } from './index.js';
import { categories, products } from './schema.js';

async function seed() {
  console.log('Cargando datos de prueba...');

  // Limpiar en orden: primero productos, después categorías
  await db.delete(products);
  await db.delete(categories);

  const [remeras, gorras, tazas] = await db
    .insert(categories)
    .values([{ name: 'Remeras' }, { name: 'Gorras' }, { name: 'Tazas' }])
    .returning();

  await db.insert(products).values([
    {
      categoryId: remeras.id,
      name: 'Remera algodón peinado',
      description: 'Remera 100% algodón peinado 24/1, ideal para estampar.',
      imageUrl: 'https://placehold.co/600x400?text=Remera',
    },
    {
      categoryId: remeras.id,
      name: 'Remera dry-fit',
      description: 'Tela deportiva de secado rápido.',
      imageUrl: 'https://placehold.co/600x400?text=Remera+dry-fit',
    },
    {
      categoryId: gorras.id,
      name: 'Gorra trucker',
      description: 'Frente de espuma y malla trasera, cierre regulable.',
      imageUrl: 'https://placehold.co/600x400?text=Gorra+trucker',
    },
    {
      categoryId: gorras.id,
      name: 'Gorra gabardina',
      description: 'Gabardina de algodón con visera curva.',
      imageUrl: 'https://placehold.co/600x400?text=Gorra',
    },
    {
      categoryId: tazas.id,
      name: 'Taza cerámica 325 ml',
      description: 'Taza blanca apta para sublimación.',
      imageUrl: 'https://placehold.co/600x400?text=Taza',
    },
    {
      categoryId: tazas.id,
      name: 'Taza térmica acero',
      description: 'Doble pared, mantiene la temperatura.',
      imageUrl: 'https://placehold.co/600x400?text=Taza+termica',
      isActive: false,
    },
  ]);

  console.log('Datos cargados.');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});