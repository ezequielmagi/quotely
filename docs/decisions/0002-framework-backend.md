# 0002 — Framework de backend: Express

**Estado:** aceptada
**Fecha:** 2026-11-11

## Contexto
La API (ver [ADR 0001](0001-arquitectura.md)) expone endpoints REST para el catálogo,
los pedidos de cotización y el panel admin con autenticación. Se desarrolla en Node.js para
usar el mismo lenguaje en frontend y backend. El MVP tiene un alcance acotado
(ver [alcance](../alcance.md)) y lo mantiene una sola persona.

## Opciones consideradas

### 1. Express
- ✅ El framework más adoptado de Node.js: ecosistema enorme, documentación y soluciones para casi todo
- ✅ Minimalista: se adapta al tamaño del proyecto sin agregar capas innecesarias
- ✅ La versión 5 maneja errores en funciones async de forma nativa
- ❌ No impone estructura: hay que definir y respetar convenciones propias
- ❌ No incluye validación de datos: requiere una librería aparte

### 2. Fastify
- ✅ Mejor rendimiento
- ✅ Validación con JSON Schema y logging incluidos
- ❌ Ecosistema y comunidad más chicos
- ❌ Sistema de plugins propio con su propia curva de adopción
- ❌ La ventaja de rendimiento no es relevante para el volumen de tráfico esperado

### 3. NestJS
- ✅ Arquitectura definida (módulos, controladores, servicios) que escala bien con equipos grandes
- ✅ TypeScript como base
- ❌ Mucho código repetitivo y abstracciones para un MVP de este tamaño
- ❌ Más tiempo para tener las primeras funcionalidades andando

## Decisión
Elijo **Express 5**. Para el alcance del MVP, su simplicidad y su ecosistema pesan más que
el rendimiento de Fastify o la estructura de NestJS.

Para compensar la falta de estructura impuesta, la API se organiza en capas con
responsabilidades claras:
- **routes**: definen los endpoints
- **controllers**: reciben la request y arman la respuesta
- **services**: contienen la lógica de negocio

## Consecuencias
- Las convenciones de estructura quedan documentadas y hay que respetarlas
- La validación de datos de entrada se resuelve con una librería aparte (decisión pendiente)
- Si el proyecto crece a un equipo de varias personas, conviene reevaluar NestJS