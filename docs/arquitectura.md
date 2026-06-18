# Arquitectura del sistema

## 1. Visión general

**Herramientas Data BI - CNE** es un **portal de acceso unificado** construido como una
aplicación Next.js (App Router). Su responsabilidad es única y acotada:

1. **Autenticar** el acceso mediante un token compartido.
2. **Presentar** un catálogo de herramientas (módulos) externas en un *launcher* visual.
3. **Facilitar el acceso** a esos módulos (previsualización en iframe, apertura en nueva
   pestaña y copia de credenciales).

El portal **no ejecuta lógica de negocio de las herramientas** ni almacena información de
ellas: cada módulo es una aplicación independiente alojada en su propio dominio. El portal
es, esencialmente, una **fachada de navegación** con una capa mínima de autenticación.

```
                        ┌─────────────────────────────────────────┐
                        │          Navegador del usuario            │
                        │  (React Client Component: page.tsx)       │
                        └───────────────┬───────────────────────────┘
                                        │  POST /api/login { token }
                                        ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                  Portal Next.js (App Router)                    │
        │                                                                 │
        │   ┌───────────────┐   valida    ┌──────────────────────────┐   │
        │   │ /api/login     │────────────▶│ process.env.             │   │
        │   │ (Route Handler)│             │ APP_ACCESS_TOKEN         │   │
        │   └──────┬─────────┘             └──────────────────────────┘   │
        │          │ Set-Cookie pb_session=1 (httpOnly, 8h)               │
        │          ▼                                                       │
        │   ┌──────────────────────────────────────────────────────┐     │
        │   │ AppLauncherMenu (catálogo en código: BASE_SECTIONS)    │     │
        │   └──────────────────────────────────────────────────────┘     │
        │   ┌───────────────┐                                             │
        │   │ /api/logout    │  Set-Cookie pb_session='' (maxAge 0)        │
        │   └───────────────┘                                             │
        └──────────────────────────────────┬─────────────────────────────┘
                                            │  enlaces / iframe
                                            ▼
        ┌──────────────────────────────────────────────────────────────┐
        │  Módulos externos (dominios independientes)                     │
        │  simae.* · appbi.* · seguimiento-data.* · presidencia2026.*     │
        │  credenciales.* · botbi.* · *.vercel.app · cne.gov.co · Fabric  │
        └──────────────────────────────────────────────────────────────┘
```

## 2. Estilo arquitectónico

- **Aplicación monolítica de frontend** con un puñado de *Route Handlers* (API) para la
  autenticación. No hay backend separado ni microservicios propios.
- **Renderizado**: la página principal ([src/app/page.tsx](../src/app/page.tsx)) es un
  **Client Component** (`'use client'`). El estado de sesión (`isAuthenticated`) vive en
  memoria del cliente.
- **Sin capa de datos**: no hay base de datos, ORM ni almacenamiento persistente del lado
  servidor. El catálogo de módulos está **codificado** en
  [src/components/AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx). Ver
  [database.md](database.md).
- **Configuración por entorno**: el único secreto/parámetro de servidor es
  `APP_ACCESS_TOKEN`.

## 3. Componentes principales

| Componente | Tipo | Responsabilidad |
|------------|------|-----------------|
| `RootLayout` ([layout.tsx](../src/app/layout.tsx)) | Server Component | HTML raíz, fuente Geist, script de inicialización del tema (claro/oscuro). |
| `Page` ([page.tsx](../src/app/page.tsx)) | Client Component | Formulario de login y, tras autenticar, render de `AppLauncherMenu`. |
| `AppLauncherMenu` ([AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx)) | Client Component | Catálogo de módulos, pestañas (Favoritos / Todas), modal de previsualización, gestión de credenciales, tema y cierre de sesión. |
| `POST /api/login` ([route.ts](../src/app/api/login/route.ts)) | Route Handler | Valida el token contra `APP_ACCESS_TOKEN` y emite la cookie de sesión. |
| `POST /api/logout` ([route.ts](../src/app/api/logout/route.ts)) | Route Handler | Invalida la cookie de sesión. |
| `constants.ts` ([constants.ts](../src/lib/constants.ts)) | Módulo | Nombre y duración de la cookie y rutas de API. |

## 4. Flujo de autenticación

```
Usuario              page.tsx                 /api/login            Navegador
  │  escribe token      │                          │                    │
  ├────────────────────▶│                          │                    │
  │                     │  POST {token}            │                    │
  │                     ├─────────────────────────▶│                    │
  │                     │                          │ token === env?     │
  │                     │                          ├───────┐            │
  │                     │                          │  sí   │            │
  │                     │                          │◀──────┘            │
  │                     │   200 {success:true}     │  Set-Cookie        │
  │                     │   + Set-Cookie pb_session│  pb_session=1      │
  │                     │◀─────────────────────────┤  (httpOnly, 8h)    │
  │                     │  setIsAuthenticated(true)│                    │
  │   ve el menú        │                          │                    │
  │◀────────────────────┤                          │                    │
```

Respuestas de `/api/login`:

| Situación | HTTP | Cuerpo |
|-----------|------|--------|
| `APP_ACCESS_TOKEN` no configurado en el servidor | `500` | `{ error: 'Servidor no configurado (APP_ACCESS_TOKEN)' }` |
| Cuerpo JSON inválido | `400` | `{ error: 'Cuerpo inválido' }` |
| Token vacío | `400` | `{ error: 'Token requerido' }` |
| Token incorrecto | `401` | `{ error: 'Token incorrecto' }` |
| Token correcto | `200` | `{ success: true }` + `Set-Cookie pb_session` |

**Cierre de sesión:** `POST /api/logout` reescribe la cookie con `maxAge: 0` y el cliente
restablece `isAuthenticated = false`.

### Nota de seguridad (estado actual)

> El control de acceso es **principalmente del lado del cliente**: `isAuthenticated` es un
> estado de React en memoria. La cookie `pb_session` se emite en el login y se borra en el
> logout, pero **no existe middleware ni validación en servidor que proteja las rutas con
> base en esa cookie**. En consecuencia:
> - Al refrescar la página, el estado se reinicia y se vuelve a pedir el token.
> - El catálogo de módulos (URLs y credenciales) está embebido en el bundle de cliente.
>
> Esto es adecuado para un portal interno con un token compartido, pero **no debe tratarse
> como un control de seguridad fuerte**. Si se requiere endurecer el acceso, considerar un
> `middleware.ts` que valide `pb_session` y mover credenciales sensibles fuera del cliente.

## 5. Flujo de navegación (launcher)

```
                       ┌──────────────────────┐
                       │   AppLauncherMenu     │
                       │  tab: Favoritos/Todas │
                       └──────────┬───────────┘
            click en una tile     │
                                  ▼
                   ┌─────────────────────────────┐
                   │ handleOpenPreview(item)      │
                   │  1. abre AppPreviewModal      │
                   │  2. autoCopyCredential()      │ ──▶ copia contraseña/token
                   └──────────────┬──────────────┘     al portapapeles (toast)
                                  ▼
                   ┌─────────────────────────────┐
                   │ AppPreviewModal              │
                   │  • iframe con item.href       │
                   │  • lista de credenciales      │
                   │  • "Abrir en nueva pestaña"   │
                   └─────────────────────────────┘
```

- Las pestañas (`TABS`) y el tab activo se **persisten en `localStorage`**
  (`app-launcher-tab`).
- El tema (claro/oscuro) se persiste en `localStorage` (`theme`); por defecto **oscuro**.
- El catálogo se organiza en secciones (`BASE_SECTIONS`) y una sección virtual de
  **Favoritos** derivada de `FAVORITE_IDS`.

## 6. Decisiones y restricciones

- **Sin base de datos por diseño**: el conjunto de módulos cambia con poca frecuencia y se
  versiona junto al código. Un cambio de catálogo = un commit + un despliegue.
- **Credenciales en el catálogo**: por practicidad operativa, algunas tiles incluyen
  credenciales de los módulos. Son **visibles en el cliente** (ver nota de seguridad).
- **Apertura en iframe**: la previsualización depende de que el sitio destino permita ser
  embebido (`X-Frame-Options`/`CSP`). Si no carga, se ofrece abrir en nueva pestaña.
- **Despliegue cloud**: Vercel (integración Git, sin contenedores). Ver [despliegue.md](despliegue.md).

## 7. Diagrama de despliegue (alto nivel)

```
   Repositorio Git ──(push)──▶ Vercel (integración Git)
                                   │
                                   ├── rama de producción ─▶ Deploy de Producción (HTTPS)
                                   └── otra rama / PR ──────▶ Deploy de Preview (URL temporal)
                                                                        │
                                                                        ▼
                                                                  Usuarios (HTTPS)

   Sin contenedores ni pipeline externo: Vercel ejecuta `next build` y aloja la app.
   Ver despliegue.md.
```
