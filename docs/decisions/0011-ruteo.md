# 0011 — Ruteo en el frontend: React Router

**Estado:** aceptada
**Fecha:** 2026-11-27

## Contexto
El frontend necesita varias pantallas con su propia URL: catálogo, login de admin,
listado y detalle de cotizaciones. Las URLs tienen que poder compartirse, guardarse
en favoritos y funcionar con los botones atrás/adelante del navegador, sin recargar
la página ([ADR 0001](0001-arquitectura.md), SPA).

## Opciones consideradas

### 1. React Router
- ✅ La librería de ruteo más adoptada en React, con mucha documentación
- ✅ Soporta layouts compartidos y rutas anidadas
- ✅ Se puede usar de forma simple (declarativa) y crecer si hace falta
- ❌ Dependencia extra

### 2. TanStack Router
- ✅ Tipado muy fuerte de rutas y parámetros
- ❌ Menos adoptado y con más conceptos para un proyecto de este tamaño

### 3. Ruteo manual (leer la URL a mano)
- ✅ Sin dependencias
- ❌ Hay que reimplementar navegación, historial y parámetros

## Decisión
Elijo **React Router** en modo declarativo (`<Routes>` y `<Route>`).

## Consecuencias
- Cada pantalla vive en `src/pages/` y los componentes reutilizables en `src/components/`
- Un layout común contiene el encabezado y la navegación
- En producción, el servidor debe devolver `index.html` para cualquier ruta del frontend