# 0010 — Estilos: Tailwind CSS

**Estado:** aceptada
**Fecha:** 2026-11-24

## Contexto
El frontend ([ADR 0009](0009-frontend.md)) necesita una forma de escribir estilos que sea
consistente en todas las pantallas (espaciados, colores, tipografía) y rápida de mantener
a medida que se suman componentes.

## Opciones consideradas

### 1. Tailwind CSS
- ✅ Clases utilitarias en el propio componente: el estilo está junto al markup
- ✅ Escala de diseño predefinida (espacios, colores, tamaños) que da consistencia
- ✅ Solo se incluye en el build el CSS que realmente se usa
- ✅ Muy adoptado en el ecosistema React
- ❌ El markup queda con muchas clases

### 2. CSS Modules
- ✅ CSS tradicional con nombres aislados por componente
- ❌ Hay que definir y mantener una escala de diseño propia
- ❌ Estilos y markup en archivos separados

### 3. CSS plano
- ✅ Sin herramientas extra
- ❌ Riesgo de choques de nombres y estilos inconsistentes a medida que crece

## Decisión
Elijo **Tailwind CSS**, integrado con su plugin oficial para Vite.

## Consecuencias
- Los estilos se escriben como clases en los componentes
- Los patrones que se repiten se extraen a componentes reutilizables, no a clases CSS