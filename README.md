# Herramientas Data BI - CNE — Portal

Aplicación web (Next.js) que actúa como **portal de acceso unificado** a las herramientas
del área de Data BI del Consejo Nacional Electoral (CNE). El acceso se protege con un
**token único** y, una vez dentro, se muestra un *launcher* tipo "home screen" con los
módulos disponibles (SIMAE, AppBI, Seguimiento Data, embebidos públicos, Ojo de Águila,
descarga de credenciales, etc.).

Cada módulo se puede **previsualizar** dentro del portal (iframe) y **abrir en una nueva
pestaña**. Los módulos con credenciales muestran usuario/contraseña/token con copia rápida
al portapapeles.

> El portal **no almacena datos en una base de datos**: el catálogo de módulos vive en el
> código y la sesión es una cookie. Ver [docs/database.md](docs/database.md) para el modelo
> de datos real.

---

## Stack

| Capa            | Tecnología |
|-----------------|------------|
| Framework       | Next.js `16.1.4` (App Router) |
| UI              | React `19.2.3`, React DOM `19.2.3` |
| Estilos         | Tailwind CSS `v4` (`@tailwindcss/postcss`) |
| Iconos          | `lucide-react` |
| Lenguaje        | TypeScript `5` |
| Runtime         | Node.js 20+ (recomendado 22) |

## Requisitos

- **Node.js 20 o superior** (recomendado 22).
- npm (incluido con Node.js).

## Configuración

1. Copie `.env.example` a `.env` y defina el token de acceso:

   ```bash
   cp .env.example .env
   ```

   | Variable           | Obligatoria | Descripción |
   |--------------------|:-----------:|-------------|
   | `APP_ACCESS_TOKEN` | Sí          | Token que el usuario debe ingresar en el login. Se valida en el servidor (`/api/login`). |

   Detalle completo en [docs/variables-entorno.md](docs/variables-entorno.md).

2. Recursos estáticos en `public/` usados por la aplicación:

   - `fondo.jpeg` — imagen de fondo de la pantalla de login.
   - `appbi-stacked.svg` — logo mostrado en el login.
   - `appbi-logo.svg` — logo de la barra superior del menú.
   - `favicon.ico` — favicon (en `src/app/`).

   > Los archivos bajo `public/herraminetas_imagenes_videos/` son material gráfico/de
   > documentación y **no son consumidos por el código** de la aplicación.

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # entorno de desarrollo — http://localhost:3000
npm run build    # build de producción
npm run start    # servir el build de producción
npm run lint     # análisis estático con ESLint
```

## Estructura relevante

```
src/
├── app/
│   ├── api/login/route.ts    # valida el token y emite la cookie de sesión
│   ├── api/logout/route.ts   # borra la cookie de sesión
│   ├── layout.tsx            # layout raíz + tema (claro/oscuro)
│   ├── page.tsx              # login + render del menú
│   └── globals.css           # estilos globales y animaciones
├── components/
│   └── AppLauncherMenu.tsx   # launcher: catálogo de módulos, tabs, modal, credenciales
└── lib/
    └── constants.ts          # nombre/duración de cookie y rutas de API
```

Estructura completa en [docs/estructura-proyecto.md](docs/estructura-proyecto.md).

Para agregar, quitar o editar módulos (enlaces, textos, credenciales), edite los arreglos
`BASE_SECTIONS` y `FAVORITE_IDS` en
[src/components/AppLauncherMenu.tsx](src/components/AppLauncherMenu.tsx).

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [docs/arquitectura.md](docs/arquitectura.md) | Arquitectura del sistema, flujos de autenticación y navegación, diagramas. |
| [docs/documentacion-tecnica.md](docs/documentacion-tecnica.md) | Stack, dependencias, módulos, componentes, servicios y API. |
| [docs/documentacion-funcional.md](docs/documentacion-funcional.md) | Funcionalidad del portal y catálogo de módulos. |
| [docs/database.md](docs/database.md) | Modelo de datos real (catálogo en código, cookie, env) y diagrama lógico. |
| [docs/diccionario-datos.md](docs/diccionario-datos.md) | Diccionario de datos (campos, tipos, restricciones, ejemplos). |
| [docs/datos-muestra.md](docs/datos-muestra.md) | Ejemplos representativos de los datos del sistema. |
| [docs/estructura-proyecto.md](docs/estructura-proyecto.md) | Estructura de directorios y archivos con su función. |
| [docs/variables-entorno.md](docs/variables-entorno.md) | Variables de entorno. |
| [docs/despliegue.md](docs/despliegue.md) | Instalación, build, despliegue y CI/CD (cloud). |

## Despliegue

El despliegue se realiza en **[Vercel](https://vercel.com/)** mediante integración Git
(deploy automático en cada push). Solo requiere definir `APP_ACCESS_TOKEN` en las variables
de entorno del proyecto. Consulte [docs/despliegue.md](docs/despliegue.md) para el detalle.
