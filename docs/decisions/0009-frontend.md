# 0009 — Frontend: React + Vite

**Estado:** aceptada
**Fecha:** 2026-11-21

## Contexto
La arquitectura define un frontend SPA separado de la API ([ADR 0001](0001-arquitectura.md)),
escrito en TypeScript ([ADR 0003](0003-lenguaje.md)). Hace falta una herramienta que cree
el proyecto, lo sirva en desarrollo y genere los archivos optimizados para producción.

## Opciones consideradas

### 1. Vite
- ✅ Estándar actual para SPAs con React
- ✅ Servidor de desarrollo casi instantáneo y recarga inmediata al guardar
- ✅ Plantilla oficial con React + TypeScript
- ❌ Solo resuelve el armado: ruteo y manejo de datos se suman aparte

### 2. Create React App
- ✅ Muy difundido en proyectos existentes
- ❌ Discontinuado: sin mantenimiento ni actualizaciones

### 3. Next.js
- ✅ Framework completo con ruteo y renderizado en servidor
- ❌ Descartado para este proyecto en el ADR 0001

## Decisión
Elijo **React + Vite** con la plantilla oficial de TypeScript.

## Consecuencias
- El frontend vive en `client/`, con sus propias dependencias y scripts
- En desarrollo corre en un puerto distinto al de la API: hay que resolver la comunicación entre ambos
- Ruteo, estilos y manejo de datos se deciden por separado a medida que se necesiten