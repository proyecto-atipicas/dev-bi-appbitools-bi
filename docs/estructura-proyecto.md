# Estructura del proyecto

Árbol del repositorio con la función de cada directorio y archivo relevante. Refleja el
estado vigente del código.

```
Proj_System_Master/
├── public/                        # Recursos estáticos servidos tal cual
│   ├── fondo.jpeg                 # Fondo de la pantalla de login
│   ├── appbi-stacked.svg          # Logo del login
│   ├── appbi-logo.svg             # Logo de la barra superior del menú
│   ├── Logo-LinkTIC.png           # Logo (NO referenciado por el código actual)
│   └── herraminetas_imagenes_videos/   # Material gráfico/de documentación (no consumido por la app)
│       ├── appbi/
│       ├── bot-bi/
│       ├── credenciales/
│       ├── historico_presidencia_ojodeaguila/
│       ├── historico_territoriales_ojodeaguila/
│       ├── Portafio_servicios/
│       ├── seguimiento-data/
│       ├── Tablero SIMAE/
│       └── tableros_elecciones_powerbi/
│
├── src/
│   ├── app/                       # App Router de Next.js
│   │   ├── api/
│   │   │   ├── login/route.ts     # POST: valida APP_ACCESS_TOKEN y emite cookie pb_session
│   │   │   └── logout/route.ts    # POST: borra la cookie pb_session
│   │   ├── favicon.ico            # Favicon
│   │   ├── globals.css            # Tailwind v4 + variables de tema + animaciones del launcher
│   │   ├── layout.tsx             # RootLayout: HTML raíz, fuente Geist, init de tema (claro/oscuro)
│   │   └── page.tsx               # Login (token) + render de AppLauncherMenu
│   │
│   ├── components/
│   │   └── AppLauncherMenu.tsx    # Launcher completo: catálogo (BASE_SECTIONS), tabs, tiles,
│   │                              #   modal de previsualización, credenciales, tema, toasts
│   │
│   └── lib/
│       └── constants.ts           # SESSION_COOKIE, SESSION_MAX_AGE, rutas API
│
├── .env                           # Variables locales (NO versionado)
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore                     # Exclusiones de Git
├── eslint.config.mjs              # Configuración de ESLint (flat config)
├── next.config.ts                 # Configuración de Next.js (por defecto)
├── next-env.d.ts                  # Tipos de Next.js (generado)
├── package.json                   # Dependencias y scripts
├── package-lock.json              # Lockfile
├── postcss.config.mjs             # PostCSS con @tailwindcss/postcss
├── tsconfig.json                  # Configuración de TypeScript
├── README.md                      # Documentación principal
└── docs/                          # Documentación extendida (esta carpeta)
    ├── arquitectura.md
    ├── documentacion-tecnica.md
    ├── documentacion-funcional.md
    ├── database.md
    ├── diccionario-datos.md
    ├── datos-muestra.md
    ├── estructura-proyecto.md
    ├── variables-entorno.md
    └── despliegue.md
```

> Generados/no versionados (no listados arriba): `node_modules/`, `.next/`,
> `*.tsbuildinfo`. Ver [.gitignore](../.gitignore).

## Directorios principales

| Directorio | Función |
|------------|---------|
| `public/` | Activos estáticos servidos en la raíz del sitio (logos, fondo, material gráfico). |
| `src/app/` | Rutas, layout, estilos globales y endpoints API (App Router). |
| `src/app/api/` | **Servicios** (Route Handlers): autenticación (`login`/`logout`). |
| `src/components/` | **Componentes** de UI (el launcher y todas sus piezas). |
| `src/lib/` | **Módulos** utilitarios y constantes compartidas. |
| `docs/` | Documentación técnica y funcional del proyecto. |

## Mapa rápido por tipo de elemento

| Tipo | Ubicación |
|------|-----------|
| **Páginas** | [src/app/page.tsx](../src/app/page.tsx), [src/app/layout.tsx](../src/app/layout.tsx) |
| **Componentes** | [src/components/AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx) |
| **Servicios / API** | [src/app/api/login/route.ts](../src/app/api/login/route.ts), [src/app/api/logout/route.ts](../src/app/api/logout/route.ts) |
| **Modelos / tipos de datos** | `LauncherItem`, `LauncherSection`, `Credential`, `Tab` (en `AppLauncherMenu.tsx`) |
| **Constantes / config en código** | [src/lib/constants.ts](../src/lib/constants.ts) |
| **Estilos** | [src/app/globals.css](../src/app/globals.css) |
| **Scripts (npm)** | [package.json](../package.json) |
| **Configuraciones** | `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` |
| **Despliegue** | Vercel (integración Git, sin archivo de CI en el repo). Ver [despliegue.md](despliegue.md). |

> El proyecto **no contiene** carpetas de base de datos, migraciones, ni un directorio de
> "scripts" propios más allá de los scripts npm de [package.json](../package.json).
