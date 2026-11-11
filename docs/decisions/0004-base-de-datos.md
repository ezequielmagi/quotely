# 0004 — Base de datos: PostgreSQL

**Estado:** aceptada
**Fecha:** 2026-11-11

## Contexto
Según el [alcance del MVP](../alcance.md), Quotely maneja estas entidades:

- **Categoría** → tiene muchos **Productos**
- **Contacto** → identificado por email, tiene muchas **Cotizaciones**
- **Cotización** → tiene muchos **Ítems de cotización**
- **Ítem de cotización** → referencia un **Producto** y guarda la cantidad
- **Admin** → usuarios del panel de gestión

Los datos son **relacionales** y su integridad es crítica: un ítem no puede apuntar a un producto
inexistente, y una cotización tiene que conservar su contenido aunque el catálogo cambie.
Además, crear una cotización implica guardar la cotización y todos sus ítems juntos:
o se guarda todo, o nada.

## Opciones consideradas

### 1. PostgreSQL
- ✅ Relacional: claves foráneas y restricciones garantizan la integridad a nivel base de datos
- ✅ Transacciones confiables para guardar cotización + ítems de forma atómica
- ✅ Funcionalidades avanzadas cuando hagan falta: tipos enum, JSONB, búsqueda de texto
- ✅ Amplia oferta de hosting gestionado con planes gratuitos
- ❌ Requiere un servidor de base de datos (local y en producción)

### 2. MySQL
- ✅ Relacional, muy difundida, presente en casi cualquier hosting
- ✅ Cubre bien las necesidades del MVP
- ❌ Menos funcionalidades avanzadas que PostgreSQL (tipos, JSON, extensiones)
- ❌ Menor adopción en el ecosistema Node.js moderno

### 3. MongoDB
- ✅ Esquema flexible, se integra natural con objetos JavaScript
- ❌ Las relaciones (cotización → ítems → producto) se resuelven a mano en el código
- ❌ La integridad referencial no la garantiza la base: queda en manos de la aplicación
- ❌ El modelo de datos de Quotely no aprovecha la flexibilidad de esquema

### 4. SQLite
- ✅ Cero configuración: la base es un archivo
- ❌ Escrituras concurrentes limitadas
- ❌ Muchas plataformas de deploy tienen disco efímero: el archivo se pierde al redeployar

## Decisión
Elijo **PostgreSQL**. El modelo de Quotely es relacional por naturaleza, y PostgreSQL garantiza
la integridad de esas relaciones en la propia base de datos, no solo en el código.

## Consecuencias
- Hace falta PostgreSQL corriendo en local para desarrollo (a definir: instalación o contenedor)
- Hace falta una base gestionada para producción (a definir en el deploy)
- El esquema evoluciona con **migraciones** versionadas, no con cambios manuales
- Los ítems de cotización guardan una copia del nombre del producto al momento de cotizar,
  para que editar o borrar un producto no altere cotizaciones existentes