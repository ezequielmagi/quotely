# Devlog

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