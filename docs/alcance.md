# Alcance del MVP

## Usuarios
- **Cliente B2B**: navega el catálogo, arma un pedido y solicita cotización dejando sus datos de contacto. No necesita registrarse ni iniciar sesión.
- **Admin**: el dueño del negocio. Inicia sesión y gestiona productos, cotizaciones y contactos.

## Dentro del MVP

### Cliente
- Catálogo con listado y detalle de producto
- Filtro por categoría y búsqueda por nombre
- Lista de cotización: agregar productos con cantidad, editar y quitar ítems
- Envío del pedido con datos de contacto:
  - **Obligatorios:** nombre y email
  - **Opcionales:** empresa, teléfono y comentario
  - Aceptación de la política de privacidad
- Confirmación en pantalla al enviar

### Admin
- Login
- Listado de cotizaciones con estado: `nueva` → `en_proceso` → `respondida` → `cerrada`
- Detalle de cada cotización (con los datos del contacto) y cambio de estado
- Alta, baja y modificación de productos y categorías

## Fuera del MVP (a propósito)
| Funcionalidad | Por qué queda afuera |
|---|---|
| Precios, checkout y pagos | El flujo B2B es por cotización; no aplica |
| Cuentas de cliente con login | Agregan fricción y complejidad; ver decisión 1 |
| Listado de contactos en el panel | Los datos ya se guardan; la vista dedicada llega en v2 |
| Emails automáticos | Valiosos, pero no esenciales para validar el flujo → v2 |
| Subida de imágenes | Requiere storage externo; por ahora se usa una URL → v2 |
| Importar productos desde una API externa | Integración aparte → v2 |

## Decisiones de alcance

### 1. Cotizar sin registrarse, pero dejando datos de contacto
En B2B, obligar a crear una cuenta antes del primer contacto hace perder pedidos.
Pedir solo nombre y email alcanza para responder la cotización.
**Trade-off:** el cliente no puede ver el historial de sus pedidos. Se puede agregar más adelante.

### 2. Contactos como entidad propia, identificados por email
Cada cotización se asocia a un contacto. Si el email ya existe, se reutiliza el contacto
y se actualizan sus datos. Así cada cliente tiene su historial de cotizaciones y el negocio
construye su base de contactos.
**Trade-off:** el email no se verifica en el MVP; alguien podría usar un email ajeno.
El riesgo es bajo porque el formulario no expone ningún dato existente.

### 3. Catálogo sin precios
Muchas empresas B2B no publican precios porque varían según cantidad y cliente.
Además simplifica el modelo de datos del MVP.
**Trade-off:** el cliente no puede estimar el costo antes de pedir.