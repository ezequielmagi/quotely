# Alcance del MVP

## Usuarios
- **Cliente B2B**: navega el catálogo, arma un pedido y solicita cotización. No necesita cuenta.
- **Admin**: el dueño del negocio. Inicia sesión y gestiona productos y cotizaciones.

## Dentro del MVP

### Cliente
- Catálogo con listado y detalle de producto
- Filtro por categoría y búsqueda por nombre
- Lista de cotización: agregar productos con cantidad, editar y quitar ítems
- Envío del pedido con datos de contacto: nombre, empresa, email, teléfono y comentario
- Confirmación en pantalla al enviar

### Admin
- Login
- Listado de cotizaciones con estado: `nueva` → `en_proceso` → `respondida` → `cerrada`
- Detalle de cada cotización y cambio de estado
- Alta, baja y modificación de productos y categorías

## Fuera del MVP (a propósito)
| Funcionalidad | Por qué queda afuera |
|---|---|
| Precios, checkout y pagos | El flujo B2B es por cotización; no aplica |
| Cuentas de cliente | Agregan fricción y complejidad; ver decisión 1 |
| Emails automáticos | Valiosos, pero no esenciales para validar el flujo → v2 |
| Subida de imágenes | Requiere storage externo; por ahora se usa una URL → v2 |
| Importar productos desde una API externa | Integración aparte → v2 |

## Decisiones de alcance

### 1. Pedir cotización sin cuenta
En B2B, obligar a registrarse antes del primer contacto hace perder pedidos. Pedir solo los datos de contacto alcanza para que el admin responda.
**Trade-off:** el cliente no tiene historial de sus pedidos. Si hace falta, se agrega en una versión futura.

### 2. Catálogo sin precios
Muchas empresas B2B no publican precios porque varían según cantidad y cliente. Además simplifica el modelo de datos del MVP.
**Trade-off:** el cliente no puede estimar el costo antes de pedir. Se podría agregar un "precio de referencia" opcional más adelante.