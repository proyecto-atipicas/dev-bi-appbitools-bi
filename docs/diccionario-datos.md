# Diccionario de datos

Diccionario de los campos que componen el modelo de datos del portal. Como el sistema **no
usa base de datos**, los "campos" corresponden a las propiedades de las entidades en código
([AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx)), a la cookie de sesión y a la
variable de entorno. Ver el modelo completo en [database.md](database.md).

Convenciones:
- **Tipo**: tipo TypeScript / tipo lógico.
- **Long.**: longitud máxima orientativa (no hay restricción física; aplica como guía).
- **Obl.**: obligatorio (Sí/No).

---

## 1. Entidad `LauncherItem` (módulo)

| Campo | Tipo | Long. | Obl. | Descripción funcional | Valores permitidos | Restricciones | Ejemplo |
|-------|------|:-----:|:----:|-----------------------|--------------------|---------------|---------|
| `id` | `string` | ~40 | Sí | Identificador único del módulo. | kebab-case | Único en todo el catálogo. | `embebido-publico-presidencia-2026` |
| `title` | `string` | ~60 | Sí | Nombre visible de la tile. | Texto libre | — | `AppBI` |
| `description` | `string` | ~160 | Sí | Descripción en tooltip y modal. | Texto libre | — | `Aplicación de monitoreo interno.` |
| `icon` | `LucideIcon` | — | Sí | Icono por defecto. | Iconos de `lucide-react` | Debe importarse. | `LineChart` |
| `iconClass` | `string` | ~20 | Sí | Color Tailwind del icono. | `text-{color}-600` / `text-gray-400` | Idealmente con entrada en `TILE_BG_BY_ICON`. | `text-emerald-600` |
| `logoSrc` | `string` | ~255 | No | Logo externo (reemplaza icono). | URL / ruta | — | `/appbi-logo.svg` |
| `logoAlt` | `string` | ~60 | No | Alt del logo. | Texto libre | Por defecto = `title`. | `AppBI` |
| `href` | `string` (URL) | ~2048 | No | URL destino del módulo. | URL `https://…` | Sin `href` ⇒ deshabilitado. | `https://appbi.actoreselectorales.com/` |
| `comingSoon` | `boolean` | — | No | Marca "Próximamente". | `true` / `false` | `true` ⇒ deshabilitado. | `true` |
| `credentials` | `Credential[]` | — | No | Credenciales del módulo. | Array de `Credential` | Si presente, longitud ≥ 1. | `[{ label: 'Token', value: '…' }]` |

## 2. Entidad `Credential`

| Campo | Tipo | Long. | Obl. | Descripción funcional | Valores permitidos | Restricciones | Ejemplo |
|-------|------|:-----:|:----:|-----------------------|--------------------|---------------|---------|
| `label` | `string` | ~20 | Sí | Etiqueta de la credencial. | Texto libre | Sensible si ∈ {`Contraseña`,`Token`,`Password`}. | `Contraseña` |
| `value` | `string` | ~80 | Sí | Valor de la credencial. | Texto libre | Enmascarado en UI si `label` es sensible. | `Admin123!` |

## 3. Entidad `LauncherSection`

| Campo | Tipo | Long. | Obl. | Descripción funcional | Valores permitidos | Restricciones | Ejemplo |
|-------|------|:-----:|:----:|-----------------------|--------------------|---------------|---------|
| `id` | `string` | ~20 | Sí | Identificador de la sección. | kebab-case | Único. | `ojo-aguila` |
| `title` | `string` | ~40 | No | Encabezado visible. | Texto libre | Si falta, no se muestra encabezado. | `Ojo de Águila` |
| `items` | `LauncherItem[]` | — | Sí | Módulos de la sección. | Array | Puede estar vacío. | `[ {…}, {…} ]` |

## 4. Entidad `Tab` (pestaña)

| Campo | Tipo | Long. | Obl. | Descripción funcional | Valores permitidos | Restricciones | Ejemplo |
|-------|------|:-----:|:----:|-----------------------|--------------------|---------------|---------|
| `id` | `string` | ~12 | Sí | Identificador del tab. | `favoritos`, `todas` | Único. | `favoritos` |
| `label` | `string` | ~20 | Sí | Texto visible. | Texto libre | — | `Todas las apps` |
| `icon` | `LucideIcon` | — | Sí | Icono del tab. | Iconos `lucide-react` | — | `LayoutGrid` |
| `sectionIds` | `string[]` | — | Sí | Secciones que muestra. | `LauncherSection.id[]` | FK lógica. | `['general','ojo-aguila']` |

## 5. Sesión — cookie `pb_session`

| Campo | Tipo | Long. | Obl. | Descripción funcional | Valores permitidos | Restricciones | Ejemplo |
|-------|------|:-----:|:----:|-----------------------|--------------------|---------------|---------|
| `name` | `string` | — | Sí | Nombre de la cookie (`SESSION_COOKIE`). | `pb_session` | Constante. | `pb_session` |
| `value` | `string` | 1 | Sí | Marca de sesión. | `'1'` / `''` | `'1'` activa; `''` cierra. | `1` |
| `maxAge` | `number` (s) | — | Sí | Vigencia en segundos. | `28800` / `0` | 8 h en login; 0 en logout. | `28800` |
| `httpOnly` | `boolean` | — | Sí | Inaccesible desde JS. | `true` | — | `true` |
| `secure` | `boolean` | — | Sí | Solo HTTPS en prod. | `true`/`false` | `true` si `NODE_ENV=production`. | `true` |
| `sameSite` | `string` | — | Sí | Política cross-site. | `lax` | — | `lax` |
| `path` | `string` | — | Sí | Alcance de la cookie. | `/` | — | `/` |

## 6. Configuración — variables de entorno

| Campo | Tipo | Long. | Obl. | Descripción funcional | Valores permitidos | Restricciones | Ejemplo |
|-------|------|:-----:|:----:|-----------------------|--------------------|---------------|---------|
| `APP_ACCESS_TOKEN` | `string` | ~64 | Sí (servidor) | Token de acceso del portal. | Texto secreto | Sin él, login responde `500`. Comparado con `trim()`. | `Congreso2026*` |

## 7. Llaves de almacenamiento del cliente (`localStorage`)

| Clave | Tipo | Descripción | Valores |
|-------|------|-------------|---------|
| `theme` | `string` | Preferencia de tema. | `light` / `dark` (por defecto `dark`). |
| `app-launcher-tab` | `string` | Última pestaña activa. | `favoritos` / `todas`. |

> Constantes de respaldo: `SESSION_COOKIE`, `SESSION_MAX_AGE` y `API` en
> [src/lib/constants.ts](../src/lib/constants.ts); `TAB_STORAGE_KEY` y `DEFAULT_TAB` en
> [AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx).
