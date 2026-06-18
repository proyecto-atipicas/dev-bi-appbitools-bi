# Instalación y despliegue (cloud)

## 1. Requisitos

- **Node.js 20 o superior** (recomendado 22).
- npm (incluido con Node.js).
- Variable `APP_ACCESS_TOKEN` definida (ver [variables-entorno.md](variables-entorno.md)).

## 2. Instalación y ejecución local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar el token de acceso
cp .env.example .env
# editar .env → APP_ACCESS_TOKEN=...

# 3. Desarrollo
npm run dev        # http://localhost:3000

# 4. Producción local
npm run build      # genera el build de producción (.next)
npm run start      # sirve el build en el puerto 3000

# 5. Calidad
npm run lint       # ESLint
```

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `next dev` | Servidor de desarrollo con recarga en caliente. |
| `build` | `next build` | Compila la aplicación para producción. |
| `start` | `next start` | Sirve el resultado de `build` (solo para ejecución local; en Vercel no se usa). |
| `lint` | `eslint` | Análisis estático. |

## 3. Despliegue en Vercel

El despliegue se realiza en **[Vercel](https://vercel.com/)**, la plataforma nativa para
Next.js. Vercel detecta Next.js automáticamente: no requiere `Dockerfile` ni configuración de
build manual.

### 3.1 Configuración del proyecto (una sola vez)

1. En el panel de Vercel: **Add New → Project** e **importar el repositorio** Git.
2. Vercel autodetecta el framework como **Next.js**. Ajustes por defecto (no es necesario
   cambiarlos):
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Install Command:** `npm install`
   - **Output:** gestionado por Vercel (no aplica `next start`).
3. **Variables de entorno** → agregar `APP_ACCESS_TOKEN` con un valor seguro, para los
   entornos **Production**, **Preview** y (si se desea) **Development**. Ver
   [variables-entorno.md](variables-entorno.md).

### 3.2 Flujo de despliegue (automático por Git)

```
   git push  ──▶  Vercel (integración Git)
                      │
                      ├── Push a la rama de producción ──▶  Deploy de Producción
                      └── Push a otra rama / Pull Request ─▶ Deploy de Preview (URL temporal)
```

- **Producción:** cada push a la rama configurada como *Production Branch* publica una nueva
  versión en el dominio de producción.
- **Preview:** cada push a otra rama o PR genera un *Preview Deployment* con URL propia para
  validación.
- No se requiere pipeline externo (Azure Pipelines / AWS) ni contenedores.

### 3.3 Despliegue manual con Vercel CLI (opcional)

```bash
npm i -g vercel        # instalar la CLI (una vez)
vercel                 # crea un deploy de preview
vercel --prod          # publica a producción
```

> Para CI propio se puede invocar `vercel --prod --token=$VERCEL_TOKEN`, pero con la
> integración Git de Vercel normalmente **no es necesario**.

## 4. Variables en el entorno de ejecución

`APP_ACCESS_TOKEN` debe configurarse en **Project Settings → Environment Variables** de
Vercel (entornos Production/Preview). Sin ella, el login responde `500`. Ver
[variables-entorno.md](variables-entorno.md).

## 5. Notas

- El proyecto **no incluye `Dockerfile`** ni pipeline de Azure/AWS: el despliegue es
  íntegramente en Vercel.
- Tras importar el repo y definir `APP_ACCESS_TOKEN`, los despliegues son automáticos en cada
  push.
- Varios módulos del catálogo ya se alojan en Vercel (`*.vercel.app`), por lo que el modelo es
  consistente con el resto del ecosistema.
