# Modelo de datos

## 0. Aclaración importante

**Este proyecto NO utiliza una base de datos relacional ni ningún motor de persistencia**
(no hay PostgreSQL, MySQL, MongoDB, SQLite, Prisma, etc.). No existen tablas físicas, ni
conexiones a BD, ni `DATABASE_URL`.

> Las entradas `*.db`, `*.db-journal` y `/src/generated/prisma` que aparecen en
> [.gitignore](../.gitignore) son **residuos del template de Next.js** y no corresponden a
> nada implementado.

El "modelo de datos" del sistema está compuesto por **tres fuentes**:

| Fuente | Persistencia | Descripción |
|--------|--------------|-------------|
| **Catálogo de módulos** | Código fuente (compilado en el bundle) | Entidades `LauncherSection`, `LauncherItem`, `Credential`, `Tab`. |
| **Sesión** | Cookie del navegador (`pb_session`) | Estado de autenticación. |
| **Configuración** | Variable de entorno (`APP_ACCESS_TOKEN`) | Token de acceso del servidor. |

Este documento modela esas fuentes **como si fueran entidades** (con clave primaria, claves
foráneas, relaciones, "índices" y columnas) para facilitar su comprensión y mantenimiento,
aunque su materialización real sea código y cookies, no tablas SQL.

Fuente de verdad del catálogo:
[src/components/AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx).
Fuente de la sesión: [src/lib/constants.ts](../src/lib/constants.ts) y
[src/app/api/login/route.ts](../src/app/api/login/route.ts).

---

## 1. Diagrama lógico (entidad–relación)

```
            ┌────────────────────────────┐
            │       LauncherSection       │
            │────────────────────────────│
            │ PK  id            string     │
            │     title?        string     │
            └──────────────┬─────────────┘
                           │ 1
                           │
                           │ N
            ┌──────────────┴─────────────────────────────┐
            │              LauncherItem                    │
            │─────────────────────────────────────────────│
            │ PK  id            string                      │
            │     title         string                      │
            │     description   string                      │
            │     icon          LucideIcon                  │
            │     iconClass     string                      │
            │     logoSrc?      string                      │
            │     logoAlt?      string                      │
            │     href?         string (URL)                │
            │     comingSoon?   boolean                     │
            └──────────────┬───────────────┬───────────────┘
                           │ 1             │ 0..1 (autorreferencia lógica)
                           │               │
                           │ 0..N          ▼
            ┌──────────────┴───────┐   ┌──────────────────────────────┐
            │     Credential        │   │  FAVORITE_IDS (lista de FKs)  │
            │───────────────────────│   │  referencia a LauncherItem.id │
            │     label   string    │   └──────────────────────────────┘
            │     value   string    │
            └───────────────────────┘

            ┌────────────────────────────┐      ┌──────────────────────────────┐
            │            Tab              │      │      Session (cookie)         │
            │────────────────────────────│      │──────────────────────────────│
            │ PK  id          string      │      │ PK  name   'pb_session'       │
            │     label       string      │      │     value  '1'                │
            │     icon        LucideIcon   │      │     maxAge 28800 s (8 h)      │
            │     sectionIds  string[] (FK)│──┐   │     httpOnly / sameSite=lax   │
            └────────────────────────────┘  │   └──────────────────────────────┘
                                            │
                          referencia N:M a LauncherSection.id

            ┌────────────────────────────┐
            │   Config (entorno)          │
            │────────────────────────────│
            │     APP_ACCESS_TOKEN string │  (secreto de servidor; valida login)
            └────────────────────────────┘
```

Relaciones:

- `LauncherSection` **1 — N** `LauncherItem` (una sección agrupa varios módulos).
- `LauncherItem` **1 — 0..N** `Credential` (un módulo puede tener 0 o más credenciales).
- `Tab` **N — M** `LauncherSection` (cada tab referencia una o más secciones por `sectionIds`).
- `FAVORITE_IDS` es una **lista de claves foráneas** a `LauncherItem.id` (la sección virtual
  "Favoritos" se construye resolviendo esos ids).

---

## 2. "Tablas" (entidades) del catálogo

### 2.1 `LauncherSection`

- **Propósito:** agrupar módulos relacionados en una sección del menú.
- **Clave primaria:** `id`.
- **Claves foráneas:** ninguna.
- **Relaciones:** 1—N con `LauncherItem` (contiene `items`).
- **Índices:** acceso secuencial dentro de `BASE_SECTIONS` (no indexado).

| Columna | Tipo | Obligatorio | Descripción | Restricciones |
|---------|------|:-----------:|-------------|---------------|
| `id` | `string` | Sí | Identificador de la sección. | Único. Valores actuales: `general`, `ojo-aguila`, `favoritos`. |
| `title` | `string` | No | Título visible de la sección (encabezado). | Opcional; si falta no se muestra encabezado. |
| `items` | `LauncherItem[]` | Sí | Módulos contenidos. | Array (puede estar vacío). |

### 2.2 `LauncherItem`

- **Propósito:** representar un módulo/herramienta del portal (una tile).
- **Clave primaria:** `id`.
- **Claves foráneas:** ninguna directa; es referenciado por `FAVORITE_IDS`.
- **Relaciones:** N—1 con `LauncherSection`; 1—N con `Credential`.
- **Índices:** `ITEMS_BY_ID` — *lookup* plano `Record<id, LauncherItem>` construido en código
  para reutilizar items entre secciones (favoritos). Equivale a un índice por clave primaria.

| Columna | Tipo | Obligatorio | Descripción | Restricciones |
|---------|------|:-----------:|-------------|---------------|
| `id` | `string` | Sí | Identificador único del módulo. | Único en todo el catálogo (clave de `ITEMS_BY_ID`). |
| `title` | `string` | Sí | Nombre visible de la tile. | — |
| `description` | `string` | Sí | Descripción mostrada en tooltip/modal. | — |
| `icon` | `LucideIcon` | Sí | Icono Lucide por defecto. | Componente de `lucide-react`. |
| `iconClass` | `string` | Sí | Clase de color Tailwind del icono. | Debe existir en `TILE_BG_BY_ICON`/`ICON_DARK_BY_LIGHT` para color óptimo. |
| `logoSrc` | `string` | No | Logo externo que reemplaza al icono. | URL/ruta de imagen. |
| `logoAlt` | `string` | No | Texto alternativo del logo. | Por defecto usa `title`. |
| `href` | `string` (URL) | No | Destino del módulo. | Si falta → tile deshabilitada. |
| `comingSoon` | `boolean` | No | Marca el módulo como "Próximamente". | Si `true` → deshabilitado. |
| `credentials` | `Credential[]` | No | Credenciales asociadas. | Si presente, longitud ≥ 1. |

### 2.3 `Credential`

- **Propósito:** par etiqueta/valor de acceso a un módulo.
- **Clave primaria:** no tiene id propio; se identifica por `label` dentro del `LauncherItem`.
- **Claves foráneas:** pertenece a un `LauncherItem` (composición).
- **Relaciones:** N—1 con `LauncherItem`.

| Columna | Tipo | Obligatorio | Descripción | Restricciones |
|---------|------|:-----------:|-------------|---------------|
| `label` | `string` | Sí | Etiqueta de la credencial. | Sensible si ∈ {`Contraseña`, `Token`, `Password`} (case-insensitive). |
| `value` | `string` | Sí | Valor de la credencial. | Se enmascara en UI si la etiqueta es sensible. |

### 2.4 `Tab`

- **Propósito:** pestaña de navegación del launcher.
- **Clave primaria:** `id`.
- **Claves foráneas:** `sectionIds` → `LauncherSection.id` (N—M).
- **Definida en:** constante `TABS` (solo lectura).

| Columna | Tipo | Obligatorio | Descripción | Restricciones |
|---------|------|:-----------:|-------------|---------------|
| `id` | `string` | Sí | Identificador del tab. | Único. Valores: `favoritos`, `todas`. |
| `label` | `string` | Sí | Texto visible del tab. | — |
| `icon` | `LucideIcon` | Sí | Icono del tab. | — |
| `sectionIds` | `string[]` | Sí | Secciones que muestra el tab. | Cada valor referencia `LauncherSection.id`. |

---

## 3. "Tablas" de sesión y configuración

### 3.1 `Session` (cookie `pb_session`)

- **Propósito:** indicar que el cliente superó el login.
- **Clave primaria:** `name` (`pb_session`).
- **Persistencia:** cookie del navegador (no servidor).
- **Definida en:** [constants.ts](../src/lib/constants.ts) y
  [api/login/route.ts](../src/app/api/login/route.ts).

| Atributo | Valor | Descripción |
|----------|-------|-------------|
| `name` | `pb_session` | Nombre de la cookie (`SESSION_COOKIE`). |
| `value` | `'1'` (login) / `''` (logout) | Marca de sesión. |
| `maxAge` | `28800` (8 h) en login / `0` en logout | Duración (`SESSION_MAX_AGE = 60*60*8`). |
| `httpOnly` | `true` | No accesible desde JS del cliente. |
| `secure` | `true` en producción | Solo HTTPS en producción. |
| `sameSite` | `lax` | Política de envío entre sitios. |
| `path` | `/` | Alcance. |

> **Regla de negocio:** la cookie se emite/borra pero **no se valida en servidor** (no hay
> middleware). El control de acceso efectivo es el estado de cliente `isAuthenticated`. Ver
> nota de seguridad en [arquitectura.md](arquitectura.md).

### 3.2 `Config` (variable de entorno)

| Atributo | Tipo | Obligatorio | Descripción | Restricciones |
|----------|------|:-----------:|-------------|---------------|
| `APP_ACCESS_TOKEN` | `string` | Sí (servidor) | Token contra el que se valida el login. | Si falta, `/api/login` responde `500`. Se compara con `trim()`. |

Detalle en [variables-entorno.md](variables-entorno.md).

---

## 4. Resumen de relaciones

| Origen | Cardinalidad | Destino | Mecanismo |
|--------|:------------:|---------|-----------|
| `LauncherSection` | 1 — N | `LauncherItem` | propiedad `items` |
| `LauncherItem` | 1 — 0..N | `Credential` | propiedad `credentials` |
| `Tab` | N — M | `LauncherSection` | propiedad `sectionIds` |
| `FAVORITE_IDS` | N — 1 | `LauncherItem` | resolución por `id` vía `ITEMS_BY_ID` |

Ver el diccionario campo a campo en [diccionario-datos.md](diccionario-datos.md) y ejemplos
en [datos-muestra.md](datos-muestra.md).
