# 0003 — Lenguaje: TypeScript

**Estado:** aceptada
**Fecha:** 2026-11-11

## Contexto
Frontend y backend se desarrollan en el ecosistema JavaScript (ver [ADR 0001](0001-arquitectura.md)
y [ADR 0002](0002-framework-backend.md)). Ambos lados trabajan con las mismas entidades:
productos, categorías, cotizaciones, ítems y estados. Un error en la forma de esos datos
(un campo mal escrito, un tipo incorrecto) rompe la comunicación entre cliente y servidor.
El código lo mantiene una sola persona y va a crecer con cada versión.

## Opciones consideradas

### 1. JavaScript
- ✅ Sin paso de compilación ni configuración extra
- ✅ Arranque más rápido
- ❌ Los errores de tipo aparecen en tiempo de ejecución, muchas veces en producción
- ❌ Refactorizar es riesgoso: no hay forma automática de saber qué se rompe

### 2. TypeScript
- ✅ Los errores de tipo se detectan en el editor, antes de ejecutar el código
- ✅ Autocompletado preciso y refactors seguros
- ✅ Los tipos documentan la forma de los datos dentro del propio código
- ✅ Estándar actual en proyectos profesionales de Node.js y React
- ❌ Requiere configuración (compilación, tipos de librerías)
- ❌ Más código para escribir al principio

### 3. JavaScript con tipos en JSDoc
- ✅ Chequeo de tipos sin paso de compilación
- ❌ Sintaxis más verbosa y menos legible
- ❌ Poco adoptado en proyectos nuevos

## Decisión
Elijo **TypeScript en frontend y backend**, con el modo `strict` activado.
El costo inicial de configuración se compensa rápido: el contrato de datos entre cliente
y servidor es el punto más frágil de esta arquitectura, y TypeScript lo protege.

## Consecuencias
- Hay que configurar la compilación y ejecución de TypeScript en `client/` y `server/`
- Algunas librerías necesitan paquetes de tipos aparte (`@types/...`)
- Los tipos de las entidades se pueden compartir entre cliente y servidor (a definir
  cuando se arme la estructura del repo)
- El modo `strict` exige manejar explícitamente valores nulos o indefinidos: más código,
  menos errores