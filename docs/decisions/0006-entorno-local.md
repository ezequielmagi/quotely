# 0006 — Entorno local: PostgreSQL con Docker Compose

**Estado:** aceptada
**Fecha:** 2026-11-11

## Contexto
La API necesita PostgreSQL en desarrollo ([ADR 0004](0004-base-de-datos.md)).
Cualquier persona que clone el repositorio debería poder levantar la base
con la misma versión y configuración, sin pasos manuales.

## Opciones consideradas

### 1. Instalación nativa de PostgreSQL
- ✅ Sin capas intermedias
- ❌ La versión y configuración dependen de cada máquina
- ❌ Instalación y desinstalación más engorrosas, sobre todo en Windows

### 2. Docker Compose
- ✅ Versión y configuración definidas en un archivo versionado
- ✅ Se levanta con un solo comando y queda aislado del sistema
- ✅ Fácil de resetear: se borra el volumen y se recrea la base
- ❌ Requiere Docker instalado

### 3. Base de datos gestionada en la nube desde el inicio
- ✅ Sin nada instalado localmente
- ❌ Depende de conexión a internet y comparte datos entre entornos
- ❌ Los planes gratuitos tienen límites que molestan en desarrollo

## Decisión
Elijo **Docker Compose** con la imagen oficial `postgres:17-alpine`.

## Consecuencias
- Para desarrollar hace falta Docker corriendo
- Las credenciales se leen de un `.env` (no versionado); `.env.example` documenta las variables necesarias
- Los datos persisten en un volumen de Docker (`pgdata`)
- Si en el futuro se suman servicios (por ejemplo, un servidor de emails de prueba), se agregan al mismo archivo