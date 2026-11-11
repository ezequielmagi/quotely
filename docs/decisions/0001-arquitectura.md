# 0001 — Arquitectura: frontend SPA + API REST separada

**Estado:** aceptada
**Fecha:** 2026-11-11

## Contexto
Quotely necesita un catálogo público, una lista de cotización interactiva y un panel admin con login.
A futuro, el catálogo podría alimentarse desde APIs de proveedores y las cotizaciones podrían
enviarse a otros sistemas (CRM, notificaciones). El proyecto lo desarrolla y mantiene una sola persona.

## Opciones consideradas

### 1. Frontend SPA (React) + API REST separada (Node.js)
- ✅ La API es una pieza independiente y reutilizable: otro frontend, una app móvil o integraciones externas
- ✅ Responsabilidades separadas: frontend y backend evolucionan y se despliegan por separado
- ✅ El contrato entre cliente y servidor queda explícito y documentado
- ❌ Dos aplicaciones que configurar y deployar
- ❌ Hay que resolver CORS
- ❌ SEO limitado: el catálogo se renderiza en el navegador

### 2. Framework fullstack (Next.js)
- ✅ Un solo proyecto y un solo deploy
- ✅ Renderizado en servidor: mejor SEO para el catálogo
- ❌ La lógica de negocio queda acoplada al frontend
- ❌ Exponer la API a terceros es posible, pero queda como algo secundario y no como pieza central

### 3. Renderizado en servidor con plantillas (Express + EJS)
- ✅ Simple, buen SEO, un solo deploy
- ❌ Interactividad limitada para la lista de cotización y el panel admin
- ❌ Escala mal si el frontend se vuelve más complejo

## Decisión
Elijo la **opción 1: frontend SPA + API REST separada**.
El producto apunta a integrarse con otros sistemas, así que la API tiene que ser la pieza central
e independiente, no un complemento del frontend.

Ambas partes viven en el **mismo repositorio** (`client/` y `server/`) para mantener
el código, la documentación y el historial juntos.

## Consecuencias
- Hay que configurar CORS y manejar la URL de la API por variables de entorno
- Dos deploys: uno para el frontend y otro para la API
- El SEO del catálogo queda limitado. Es aceptable en esta etapa: en B2B los clientes llegan
  sobre todo por contacto directo y links compartidos, no por búsqueda orgánica. Si el SEO
  pasa a ser prioridad, se evalúa renderizar el catálogo en el servidor
- Los endpoints de la API se documentan, porque el frontend depende de ese contrato