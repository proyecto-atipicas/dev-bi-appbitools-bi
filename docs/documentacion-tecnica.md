# Documentación técnica

## 1. Stack tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | [Next.js](https://nextjs.org/) (App Router) | `16.1.4` |
| Librería UI | React / React DOM | `19.2.3` |
| Lenguaje | TypeScript | `^5` |
| Estilos | Tailwind CSS (`@tailwindcss/postcss`) | `^4` |
| Iconografía | `lucide-react` | `^0.563.0` |
| Linting | ESLint + `eslint-config-next` | `^9` / `16.1.4` |
| Runtime | Node.js | 20+ (recomendado 22) |

### Dependencias de producción (`dependencies`)

| Paquete | Uso en el proyecto |
|---------|--------------------|
| `next` | Framework, App Router, Route Handlers, `next/image`, `next/font`. |
| `react`, `react-dom` | Componentes e hooks (`useState`, `useEffect`, `useId`, `useMemo`, `useRef`). |
| `lucide-react` | Iconos de las tiles, modal, tabs y controles (`Lock`, `Eye`, `Star`, etc.). |

### Dependencias de desarrollo (`devDependencies`)

| Paquete | Uso |
|---------|-----|
| `tailwindcss`, `@tailwindcss/postcss` | Motor de estilos (Tailwind v4 vía PostCSS). |
| `typescript` | Tipado estático. |
| `@types/node`, `@types/react`, `@types/react-dom` | Tipos. |
| `eslint`, `eslint-config-next` | Análisis estático. |

> El catálogo completo y bloqueado de versiones está en `package.json` y `package-lock.json`.

## 2. Archivos de configuración

| Archivo | Propósito |
|---------|-----------|
| [next.config.ts](../next.config.ts) | Configuración de Next.js (actualmente por defecto, sin overrides). |
| [tsconfig.json](../tsconfig.json) | TypeScript: `strict: true`, alias `@/*` → `./src/*`, `moduleResolution: bundler`, target `ES2017`. |
| [eslint.config.mjs](../eslint.config.mjs) | ESLint plano: `core-web-vitals` + `typescript`, con `globalIgnores`. |
| [postcss.config.mjs](../postcss.config.mjs) | Habilita el plugin `@tailwindcss/postcss`. |
| [.gitignore](../.gitignore) | Ignora `node_modules`, `.next`, `.env*` (excepto `.env.example`), `*.tsbuildinfo`, etc. |
| [.env.example](../.env.example) | Plantilla de variables de entorno. |

> **Despliegue:** se realiza en **Vercel** mediante integración Git (sin archivo de pipeline
> en el repositorio). Ver [despliegue.md](despliegue.md).

> **Nota:** `.gitignore` contiene entradas heredadas del *template* de Next.js que **no
> aplican** a este proyecto (`/src/generated/prisma`, `*.db`, `*.db-journal`). No hay Prisma
> ni base de datos; pueden conservarse sin efecto o limpiarse.

## 3. Estructura de `src`

```
src/
├── app/
│   ├── api/
│   │   ├── login/route.ts     # POST: valida token, emite cookie
│   │   └── logout/route.ts    # POST: borra cookie
│   ├── favicon.ico
│   ├── globals.css            # Tailwind + animaciones del launcher + tema
│   ├── layout.tsx             # RootLayout + init de tema
│   └── page.tsx               # Login + AppLauncherMenu
├── components/
│   └── AppLauncherMenu.tsx    # Launcher completo (catálogo, UI, lógica)
└── lib/
    └── constants.ts           # SESSION_COOKIE, SESSION_MAX_AGE, API
```

Descripción detallada en [estructura-proyecto.md](estructura-proyecto.md).

## 4. Servicios / API (Route Handlers)

El proyecto expone **dos endpoints**, ambos `POST`, definidos como Route Handlers del App
Router.

### `POST /api/login`

[src/app/api/login/route.ts](../src/app/api/login/route.ts)

- **Entrada:** JSON `{ "token": string }`.
- **Lógica:** lee `process.env.APP_ACCESS_TOKEN`; compara (con `trim()`) contra el token
  recibido.
- **Salida (éxito):** `200 { success: true }` + cabecera `Set-Cookie` con la cookie de
  sesión.
- **Salida (error):** `500` (no configurado), `400` (cuerpo inválido / token vacío),
  `401` (token incorrecto).

Cookie emitida:

```ts
res.cookies.set(SESSION_COOKIE /* 'pb_session' */, '1', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: SESSION_MAX_AGE /* 60*60*8 = 8 horas */,
  path: '/',
});
```

### `POST /api/logout`

[src/app/api/logout/route.ts](../src/app/api/logout/route.ts)

- **Entrada:** ninguna.
- **Lógica:** reescribe `pb_session` con valor vacío y `maxAge: 0`.
- **Salida:** `200 { success: true }`.

> No existen otros endpoints, ni `middleware.ts`, ni acceso a datos. Las constantes de la
> cookie y las rutas viven en [src/lib/constants.ts](../src/lib/constants.ts).

## 5. Componentes y módulos de UI

Todos los componentes de UI residen en
[src/components/AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx) (un único archivo
que agrupa el launcher y sus piezas) y en [src/app/page.tsx](../src/app/page.tsx).

| Pieza | Tipo | Función |
|-------|------|---------|
| `Page` | Componente página | Login y conmutación a `AppLauncherMenu`. |
| `AppLauncherMenu` | Componente exportado | Orquesta tabs, secciones, tiles, modal, tema, toasts y logout. |
| `LauncherTile` | Componente | Tile estilo *home screen* (icono + título, badge de credenciales, tooltip, ripple). |
| `AppPreviewModal` | Componente | Modal con iframe de previsualización y listado de credenciales. |
| `TabBar` | Componente | Pestañas "Favoritos" / "Todas las apps" con indicador deslizante. |
| `LauncherMark` | Componente | Marca visual: logo externo (`logoSrc`) o icono Lucide. |
| `ThemeSwitch` | Componente | Interruptor claro/oscuro. |
| `ToastViewport` | Componente | Render de toasts efímeros. |
| `LauncherTileTooltip` | Componente | Tooltip de cada tile. |
| `LauncherAmbientParticles` | Componente | Partículas decorativas del fondo. |

### Hooks personalizados

| Hook | Función |
|------|---------|
| `useTheme()` | Lee/escribe el tema en `localStorage` y mantiene la clase `dark` en `<html>`. Por defecto oscuro. |
| `useActiveTab()` | Tab activo con persistencia en `localStorage` (`app-launcher-tab`). |
| `useToasts(duration)` | Cola de toasts con auto-cierre. |

### Funciones auxiliares relevantes

| Función | Función |
|---------|---------|
| `getCopyableCredential(item)` | Elige la credencial sensible a auto-copiar; prioridad `contraseña` > `token` > `password`. |
| `copyToClipboard(value)` | Envuelve `navigator.clipboard.writeText`. |
| `getTileBg(iconClass)` / `getIconDark(iconClass)` | Mapean el color del icono a fondo de tile y color en modo oscuro. |

## 6. Modelo de datos en código

El catálogo de módulos se define mediante tipos y arreglos en `AppLauncherMenu.tsx`:

- `LauncherItem` — un módulo del portal.
- `LauncherSection` — agrupación de módulos.
- `BASE_SECTIONS` — secciones base (`general`, `ojo-aguila`).
- `FAVORITE_IDS` — ids marcados como favoritos.
- `TABS` — pestañas de navegación.

El detalle del modelo, diccionario y ejemplos está en:
- [database.md](database.md) — modelo de datos y diagrama lógico.
- [diccionario-datos.md](diccionario-datos.md) — diccionario de campos.
- [datos-muestra.md](datos-muestra.md) — registros de ejemplo.

## 7. Estilos y theming

- Tailwind CSS v4 importado en [globals.css](../src/app/globals.css) con `@import "tailwindcss"`.
- Variante `dark` personalizada: `@custom-variant dark (&:where(.dark, .dark *))`.
- Variables CSS `--background` / `--foreground` para claro y oscuro.
- Animaciones del launcher (`launcher-fade-up`, `launcher-tile-in`, ripple, partículas,
  blobs) definidas en `globals.css`.
- El tema se inicializa **antes del render** mediante un script inline en `layout.tsx`
  (evita parpadeo); por defecto **oscuro** salvo que el usuario haya elegido claro.

## 8. Convenciones

- Alias de importación `@/*` para `src/*`.
- Componentes de cliente marcados con `'use client'`.
- TypeScript en modo `strict`.
- Idioma de la UI y los textos: **español**.
