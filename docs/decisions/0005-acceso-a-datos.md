# 0005 — Acceso a datos: Drizzle ORM

**Estado:** aceptada
**Fecha:** 2026-11-11

## Contexto
La API se escribe en TypeScript ([ADR 0003](0003-lenguaje.md)) y usa PostgreSQL
([ADR 0004](0004-base-de-datos.md)). Hace falta definir cómo el código consulta la base,
cómo se define el esquema y cómo se versionan sus cambios (migraciones).
Requisitos clave: tipado de punta a punta, soporte de transacciones (cotización + ítems
se guardan juntos) y migraciones legibles y versionadas en el repositorio.

## Opciones consideradas

### 1. SQL directo (driver `pg`)
- ✅ Control total y sin abstracciones
- ✅ Sin dependencias extra
- ❌ Los resultados no están tipados: los errores de columnas aparecen en ejecución
- ❌ Migraciones y mapeo de resultados a mano

### 2. Drizzle ORM
- ✅ API con forma de SQL: las consultas se leen como lo que ejecutan
- ✅ Esquema definido en TypeScript: los tipos se infieren sin paso de generación
- ✅ Migraciones en archivos SQL legibles, versionadas en el repo (drizzle-kit)
- ✅ Liviano, con buen soporte de transacciones y relaciones
- ❌ Más joven que Prisma: comunidad y material más chicos

### 3. Prisma
- ✅ El ORM más adoptado de Node.js, con documentación muy completa
- ✅ API de alto nivel muy cómoda para casos comunes
- ❌ Esquema en un lenguaje propio (Prisma Schema), separado del código TypeScript
- ❌ Requiere un paso de generación de código cada vez que cambia el esquema
- ❌ Abstrae el SQL: las consultas complejas son menos transparentes

## Decisión
Elijo **Drizzle ORM**. Da tipado de punta a punta sin esconder el SQL, y el esquema vive
en TypeScript junto al resto del código, lo que facilita compartir tipos con el frontend.

## Consecuencias
- El esquema de la base se define en archivos TypeScript dentro de `server/`
- Los cambios de esquema se hacen con migraciones generadas por drizzle-kit y se commitean
- Las operaciones que tocan varias tablas (crear cotización + ítems) usan transacciones
- Si aparece un caso que Drizzle no resuelve bien, se puede escribir SQL directo dentro del propio Drizzle