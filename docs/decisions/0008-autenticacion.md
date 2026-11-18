# 0008 — Autenticación del panel admin: sesiones con cookie

**Estado:** aceptada
**Fecha:** 2026-11-18

## Contexto
El panel admin permite ver y gestionar cotizaciones con datos de contacto de clientes.
Solo usuarios admin pueden acceder. Hace falta identificar al admin en cada request
y poder cerrar su acceso cuando haga logout o si una sesión se ve comprometida.

## Opciones consideradas

### 1. Sesiones guardadas en la base + cookie httpOnly
- ✅ El logout invalida la sesión de inmediato (se borra de la base)
- ✅ La cookie `httpOnly` no es accesible desde JavaScript: protege contra robo por XSS
- ✅ Concepto simple: un identificador aleatorio que apunta a una fila en la base
- ❌ Requiere una tabla de sesiones y una consulta por request protegida
- ❌ Frontend y API deben compartir dominio (por ejemplo, subdominios) para que la cookie viaje

### 2. JWT
- ✅ Sin estado en el servidor: no requiere tabla
- ❌ No se puede invalidar antes de que venza sin agregar infraestructura extra
- ❌ Guardado en localStorage queda expuesto a scripts maliciosos (XSS)

## Decisión
Elijo **sesiones guardadas en PostgreSQL con cookie `httpOnly`**.
Para un panel admin, poder invalidar sesiones y proteger el identificador del acceso
desde JavaScript pesa más que evitar una consulta por request.

Las contraseñas se almacenan como hash con **scrypt** (incluido en `node:crypto`),
un algoritmo recomendado para contraseñas que no requiere dependencias extra.

## Consecuencias
- Nueva tabla `sessions` con fecha de vencimiento
- Las rutas del panel pasan por un middleware que valida la sesión y responde `401` si no es válida
- En producción, frontend y API se publican bajo el mismo dominio (subdominios)
- El primer admin se crea con un script, no desde la web