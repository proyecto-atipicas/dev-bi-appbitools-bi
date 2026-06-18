# Datos de muestra

Ejemplos representativos de la información que maneja el portal. Como el sistema **no usa
base de datos**, estos "registros" reflejan la estructura real de las entidades en código
(ver [database.md](database.md) y [diccionario-datos.md](diccionario-datos.md)).

> ⚠️ **Datos ficticios/anonimizados.** Las credenciales mostradas aquí **no son reales**; se
> usan solo para ilustrar la estructura. Las credenciales reales viven en
> [src/components/AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx).

---

## 1. `LauncherItem` (módulos) — 10 ejemplos

```jsonc
[
  {
    "id": "tablero-resultados",
    "title": "Tablero de Resultados",
    "description": "Tablero de monitoreo y analítica electoral.",
    "iconClass": "text-violet-600",
    "href": "https://ejemplo-tablero.dominio.com/",
    "credentials": [{ "label": "Contraseña", "value": "Ejemplo2026*" }]
  },
  {
    "id": "portafolio-demo",
    "title": "Portafolio de Servicios",
    "description": "Portafolio de servicios del área.",
    "iconClass": "text-violet-600",
    "href": "https://ejemplo-portafolio.vercel.app/"
  },
  {
    "id": "app-administrativa",
    "title": "App Administrativa",
    "description": "Aplicación transversal de gestión administrativa.",
    "iconClass": "text-violet-600",
    "href": "https://ejemplo-app.dominio.com/",
    "credentials": [
      { "label": "Usuario", "value": "usuario.demo" },
      { "label": "Contraseña", "value": "Demo123!" }
    ]
  },
  {
    "id": "monitoreo-interno",
    "title": "Monitoreo Interno",
    "description": "Aplicación de monitoreo interno.",
    "iconClass": "text-emerald-600",
    "href": "https://ejemplo-monitoreo.dominio.com/",
    "credentials": [
      { "label": "Usuario", "value": "admin.demo" },
      { "label": "Contraseña", "value": "Demo123!" }
    ]
  },
  {
    "id": "embebido-publico",
    "title": "Embebido Público",
    "description": "Tableros de Power BI embebidos para consulta pública.",
    "iconClass": "text-sky-600",
    "href": "https://ejemplo-embebido.dominio.com/",
    "credentials": [{ "label": "Token", "value": "TokenDemo2026*" }]
  },
  {
    "id": "portal-institucional",
    "title": "Portal Institucional",
    "description": "Portal de autenticación institucional.",
    "iconClass": "text-indigo-600",
    "href": "https://ejemplo-institucional.gov.co/auth/login"
  },
  {
    "id": "repositorio-bi",
    "title": "Repositorio de Tableros",
    "description": "Repositorio centralizado de tableros de Power BI.",
    "iconClass": "text-yellow-600",
    "href": "https://ejemplo-fabric.microsoft.com/view?r=XXXX"
  },
  {
    "id": "bot-demo",
    "title": "Bot de Tráfico",
    "description": "Generador de tráfico para capacitaciones.",
    "iconClass": "text-amber-600",
    "href": "https://ejemplo-bot.dominio.com/",
    "credentials": [{ "label": "Token", "value": "BotDemo123!" }]
  },
  {
    "id": "descarga-docs",
    "title": "Descarga de Documentos",
    "description": "Herramienta de descarga de resoluciones y credenciales.",
    "iconClass": "text-teal-600",
    "href": "https://ejemplo-descargas.dominio.com/",
    "credentials": [{ "label": "Contraseña", "value": "Descarga123!" }]
  },
  {
    "id": "modulo-en-construccion",
    "title": "Módulo en Construcción",
    "description": "En definición.",
    "iconClass": "text-gray-400",
    "comingSoon": true
  }
]
```

## 2. `Credential` — 6 ejemplos

| `label` | `value` (ficticio) | Sensible | Se enmascara en UI |
|---------|--------------------|:--------:|:------------------:|
| `Contraseña` | `Ejemplo2026*` | Sí | Sí |
| `Token` | `TokenDemo2026*` | Sí | Sí |
| `Password` | `P4ssDemo!` | Sí | Sí |
| `Usuario` | `usuario.demo` | No | No |
| `Usuario` | `admin.demo` | No | No |
| `Token` | `BotDemo123!` | Sí | Sí |

## 3. `LauncherSection` — 3 ejemplos

```jsonc
[
  { "id": "general", "title": null, "items": ["… N módulos …"] },
  { "id": "ojo-aguila", "title": "Ojo de Águila", "items": ["… 3 módulos …"] },
  { "id": "favoritos", "title": "Favoritos", "items": ["… derivado de FAVORITE_IDS …"] }
]
```

## 4. `Tab` — 2 ejemplos (set completo)

```jsonc
[
  { "id": "favoritos", "label": "Favoritos",      "icon": "Star",       "sectionIds": ["favoritos"] },
  { "id": "todas",     "label": "Todas las apps", "icon": "LayoutGrid", "sectionIds": ["general", "ojo-aguila"] }
]
```

## 5. `FAVORITE_IDS` — ejemplo (lista de FKs)

```jsonc
[
  "embebido-publico-presidencia-2026",
  "simae",
  "appbi",
  "portafolio",
  "descarga-credenciales",
  "sistema-cne-presidencia"
]
```

## 6. Sesión — cookie `pb_session`

| Escenario | `name` | `value` | `maxAge` | `httpOnly` | `secure` | `sameSite` | `path` |
|-----------|--------|---------|----------|:----------:|:--------:|:----------:|:------:|
| Login exitoso | `pb_session` | `1` | `28800` | `true` | `true` (prod) | `lax` | `/` |
| Logout | `pb_session` | `` (vacío) | `0` | `true` | `true` (prod) | `lax` | `/` |

## 7. Configuración — `.env`

```dotenv
# Token de acceso (valor ficticio de ejemplo)
APP_ACCESS_TOKEN=Ejemplo_Token_Seguro_2026*
```

## 8. `localStorage` (cliente)

| Clave | Valor de ejemplo |
|-------|------------------|
| `theme` | `dark` |
| `app-launcher-tab` | `favoritos` |
