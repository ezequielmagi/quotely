# 0007 — Validación de datos: Zod

**Estado:** aceptada
**Fecha:** 2026-11-13

## Contexto
La API recibe datos del cliente (por ejemplo, un pedido de cotización) que no se pueden asumir correctos:
pueden faltar campos, tener tipos incorrectos o valores fuera de rango.
Express no valida datos de entrada ([ADR 0002](0002-framework-backend.md)) y el proyecto usa
TypeScript ([ADR 0003](0003-lenguaje.md)), por lo que conviene que validación y tipos no se dupliquen.

## Opciones consideradas

### 1. Zod
- ✅ Diseñado para TypeScript: infiere el tipo a partir del esquema (una sola fuente de verdad)
- ✅ API declarativa y legible
- ✅ Funciona igual en el navegador: el mismo esquema puede validar el formulario del frontend
- ❌ Dependencia extra

### 2. Joi
- ✅ Maduro y muy completo
- ❌ No infiere tipos de TypeScript: hay que escribir validación y tipos por separado

### 3. express-validator
- ✅ Integrado como middleware de Express
- ❌ Acoplado a Express: no se puede reutilizar en el frontend
- ❌ Estilo imperativo, más difícil de leer con objetos anidados

### 4. Validación manual
- ✅ Sin dependencias
- ❌ Mucho código repetitivo y propenso a errores

## Decisión
Elijo **Zod**. Cada esquema define a la vez las reglas de validación y el tipo de TypeScript
de los datos validados.

## Consecuencias
- Cada endpoint que recibe datos define su esquema en un archivo `*.schema.ts` de su módulo
- Los datos inválidos se rechazan con `400` y el detalle de qué campo falló
- A futuro, los esquemas pueden compartirse con el frontend