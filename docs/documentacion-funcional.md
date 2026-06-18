# Documentación funcional

## 1. Propósito

El portal **Herramientas Data BI - CNE** centraliza el acceso a las herramientas del área de
Data BI. Un usuario autorizado ingresa un **token de acceso** y obtiene un menú visual desde
el que puede previsualizar y abrir cada herramienta, además de copiar rápidamente las
credenciales asociadas.

## 2. Usuarios

- **Usuario operativo del área Data BI / CNE**: ingresa con el token compartido del portal y
  consume los módulos.

No hay roles, perfiles ni gestión de usuarios: el acceso es binario (con token válido / sin
él).

## 3. Funcionalidades

### 3.1 Inicio de sesión por token

- Pantalla de login con fondo (`fondo.jpeg`) y logo (`appbi-stacked.svg`).
- Campo de token con opción **mostrar/ocultar**.
- Validación contra el servidor (`POST /api/login`). Si el token es incorrecto se muestra
  "Token incorrecto. Intente nuevamente."
- Al validar correctamente, se emite la cookie de sesión y se muestra el menú.

### 3.2 Menú / launcher de módulos

- Disposición tipo **home screen** (cuadrícula de tiles con icono y nombre).
- **Pestañas**:
  - **Favoritos**: subconjunto destacado de módulos.
  - **Todas las apps**: todas las secciones (General y *Ojo de Águila*).
- La pestaña activa se recuerda entre sesiones del navegador (`localStorage`).
- **Tema claro/oscuro** conmutables; por defecto oscuro.
- Tiles con **tooltip** (nombre + descripción) y badge de llave cuando el módulo tiene
  credenciales.
- Módulos marcados como **"Próximamente"** aparecen deshabilitados.

### 3.3 Previsualización y apertura de un módulo

- Al hacer clic en una tile se abre un **modal** con:
  - **Vista previa** del sitio en un `iframe`.
  - Botón **"Abrir en nueva pestaña"**.
  - **Credenciales** (si las tiene), con mostrar/ocultar y copiar.
- Si el sitio no permite ser embebido, se indica abrir en una pestaña nueva.

### 3.4 Copia automática de credenciales

- Al abrir un módulo con credenciales sensibles, la **contraseña/token se copia
  automáticamente** al portapapeles y se notifica con un *toast*
  ("… copiada — pega con Ctrl+V en el login").
- Por seguridad del navegador, no se autocompleta el formulario del sitio destino; la
  credencial queda lista para pegar.

### 3.5 Cierre de sesión

- Botón **"Cerrar sesión"** en la barra superior. Invoca `POST /api/logout`, borra la cookie
  y regresa a la pantalla de login.

## 4. Catálogo de módulos

Los módulos se definen en
[src/components/AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx)
(`BASE_SECTIONS`). Estado vigente:

### Sección "General"

| Módulo | `id` | URL | Credenciales | Estado |
|--------|------|-----|--------------|--------|
| SIMAE | `simae` | https://simae.actoreselectorales.com/ | Contraseña | Activo |
| Portafolio de Servicios | `portafolio` | https://portafolio-servicios-bi.vercel.app/ | — | Activo |
| AppBI | `appbi` | https://appbi.actoreselectorales.com/ | Usuario + Contraseña | Activo |
| Seguimiento Data | `seguimiento-pmo` | https://seguimiento-data.actoreselectorales.com/ | Usuario + Contraseña | Activo |
| Embebido Público Presidencia 2026 | `embebido-publico-presidencia-2026` | https://presidencia2026.actoreselectorales.com/ | Token | Activo |
| Sistema CNE Presidencia | `sistema-cne-presidencia` | https://actoreselectoralespresidencia.cne.gov.co/auth/login | — | Activo |
| Repositorio de Tableros | `repositorio-tableros` | app.fabric.microsoft.com (Power BI) | — | Activo |
| Bot Tráfico | `bot-trafico` | https://botbi.actoreselectorales.com/ | Token | Activo |
| Descarga de Credenciales | `descarga-credenciales` | https://credenciales.actoreselectorales.com/ | Contraseña | Activo |
| Documentación Área | `documentacion-area` | https://documentacionbi.vercel.app/ | — | Activo |
| Actividades BI | `actividades-bi` | https://proyecto-atipicas.github.io/dev-bi-cronograma-actividades-v1/ | — | Activo |
| Configuración | `configuracion` | — | — | Próximamente |

### Sección "Ojo de Águila"

| Módulo | `id` | URL | Credenciales | Estado |
|--------|------|-----|--------------|--------|
| Analítica de Presidencia | `analitica-presidencia` | https://analisis-presidencia-colombia.vercel.app/ | — | Activo |
| Analítica Congreso | `analitica-congreso` | — | — | Próximamente |
| Analítica Territorial | `analitica-territorial` | https://analitica-palo-viedo.vercel.app/ | — | Activo |

### Favoritos

Subconjunto destacado, en este orden (`FAVORITE_IDS`):

1. Embebido Público Presidencia 2026
2. SIMAE
3. AppBI
4. Portafolio de Servicios
5. Descarga de Credenciales
6. Sistema CNE Presidencia

> Los valores concretos de credenciales se documentan como ejemplos de estructura en
> [datos-muestra.md](datos-muestra.md). **Las credenciales reales viven en el código**
> ([AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx)); manténgalas actualizadas y
> tenga en cuenta la nota de seguridad de [arquitectura.md](arquitectura.md).

## 5. Reglas de negocio

- Un módulo **sin `href`** o marcado `comingSoon: true` se muestra **deshabilitado**
  ("Próximamente") y no es navegable.
- La **credencial auto-copiada** sigue la prioridad `contraseña` > `token` > `password`.
- Las credenciales con etiqueta `contraseña`, `token` o `password` se consideran
  **sensibles**: se enmascaran por defecto y requieren acción explícita para revelarse.
- La sesión dura **8 horas** (duración de la cookie); sin embargo, el estado de
  autenticación del cliente se reinicia al refrescar la página (ver nota de seguridad).

## 6. Mantenimiento funcional habitual

| Tarea | Dónde |
|-------|-------|
| Agregar / quitar / editar un módulo | `BASE_SECTIONS` en [AppLauncherMenu.tsx](../src/components/AppLauncherMenu.tsx) |
| Cambiar el orden o el set de favoritos | `FAVORITE_IDS` en el mismo archivo |
| Cambiar el token de acceso | Variable `APP_ACCESS_TOKEN` (ver [variables-entorno.md](variables-entorno.md)) |
| Cambiar logos / fondo del login | Archivos en `public/` (ver [README](../README.md)) |
