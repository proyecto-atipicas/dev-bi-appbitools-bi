# Variables de entorno

El portal requiere **una única variable** de servidor. No hay variables de cliente
(`NEXT_PUBLIC_*`) ni cadenas de conexión a base de datos.

## Variables

| Variable | Ámbito | Obligatoria | Por defecto | Descripción |
|----------|--------|:-----------:|-------------|-------------|
| `APP_ACCESS_TOKEN` | Servidor | **Sí** | — | Token contra el que `POST /api/login` valida el acceso. Se compara aplicando `trim()`. Si no está definido, el login responde `500 { error: 'Servidor no configurado (APP_ACCESS_TOKEN)' }`. |

> Variable estándar de Node/Next disponible en runtime: `NODE_ENV`. Cuando vale
> `production`, la cookie de sesión se emite con `secure: true` (solo HTTPS). No requiere
> definirse manualmente: Next la establece según el comando (`dev`/`build`/`start`).

## Archivos

| Archivo | Uso | Versionado |
|---------|-----|:----------:|
| [.env.example](../.env.example) | Plantilla de referencia. | Sí |
| `.env` | Valores locales reales. | **No** (ignorado por `.gitignore`) |

## Configuración local

```bash
cp .env.example .env
# Edite .env y defina un valor seguro:
# APP_ACCESS_TOKEN=un_valor_seguro
```

Contenido de [.env.example](../.env.example):

```dotenv
# Token que deben ingresar los usuarios en el formulario de acceso (obligatorio)
APP_ACCESS_TOKEN=cambiar_por_un_valor_seguro
```

## Configuración en despliegue (Vercel)

`APP_ACCESS_TOKEN` debe definirse en **Project Settings → Environment Variables** del proyecto
en Vercel (entornos Production y Preview). Ver [despliegue.md](despliegue.md).

## Buenas prácticas

- **No** versionar `.env` (ya está en `.gitignore`).
- Usar un valor robusto y rotarlo periódicamente.
- Recordar la nota de seguridad de [arquitectura.md](arquitectura.md): el catálogo y sus
  credenciales viajan al cliente; el token de acceso protege el portal, no cada módulo.
