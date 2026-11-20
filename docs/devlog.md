# Devlog

## 2026-11-20

### Hecho
- Autenticación del panel admin con sesiones y cookie `httpOnly` ([ADR 0008](decisions/0008-autenticacion.md)).
- Contraseñas guardadas como hash con scrypt y script `npm run admin:create` para crear admins.
- Tabla `sessions`: se guarda la huella del token, no el token.
- Endpoints de auth: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`.
- Middleware `requireAuth` que protege las rutas del panel.
- Panel admin: listar cotizaciones, ver detalle con ítems y cambiar estado.

### Problemas y soluciones
- **Drizzle Studio no arrancaba (`EADDRINUSE`)**: ya había una instancia abierta en otra terminal → reutilizar la existente.

### Próximo
- Frontend: catálogo y formulario de cotización.

## 2026-11-17

### Hecho
- Endpoints del catálogo: `GET /api/categories`, `GET /api/products` (filtros por categoría y búsqueda) y `GET /api/products/:id`.
- Seed con datos de prueba.
- `POST /api/quotes`: validación con Zod ([ADR 0007](decisions/0007-validacion.md)), transacción (contacto + cotización + ítems) y reutilización de contactos por email.
- Manejador central de errores: los errores inesperados ya no exponen detalles técnicos.
- Pruebas de la API con REST Client (`server/requests/quotes.http`).

### Problemas y soluciones
- **`ECONNREFUSED` al conectar**: Docker Desktop no estaba abierto, así que la base no corría → abrir Docker y `docker compose up -d`.

### Próximo
- Panel admin: login y endpoints protegidos para gestionar cotizaciones.

## 2026-11-12

### Hecho
- Servidor Express 5 + TypeScript con endpoint `/health` que verifica la conexión a la base.
- PostgreSQL 17 con Docker Compose ([ADR 0006](decisions/0006-entorno-local.md)).
- Conexión con Drizzle ORM y variables de entorno por aplicación.
- Esquema completo (6 tablas) y migración inicial → [modelo de datos](modelo-de-datos.md).

### Problemas y soluciones
- **Docker no arrancaba en Windows**: faltaba WSL → `wsl --install --no-distribution`.
- **Error de autenticación (`28P01`) al conectar**: un PostgreSQL instalado en Windows ocupaba el puerto 5432 y recibía las conexiones → contenedor mapeado al puerto 5433 y servicio local desactivado.

### Próximo
- Endpoints del catálogo: categorías y productos.

## 2026-11-11

### Hecho
- Creé el repo y la estructura de documentación (README, ADRs, devlog).
- Definí el alcance del MVP: usuarios, funcionalidades incluidas y lo que queda afuera a propósito → [alcance](alcance.md).
- [ADR 0001](decisions/0001-arquitectura.md): arquitectura con frontend SPA + API REST separada, en un mismo repo.
- [ADR 0002](decisions/0002-framework-backend.md): Express 5 como framework de backend, con estructura en capas (routes → controllers → services).
- Configuré Git Bash como terminal por defecto en VS Code.

### Problemas y soluciones
- **Push rechazado** por cambios hechos en GitHub que no estaban en local → `git pull --no-rebase` para combinar y después push.
  Convención: los archivos se editan solo en local.

### Próximo
- ADR 0003: lenguaje (JavaScript o TypeScript).
- ADR 0004: base de datos.