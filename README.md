# Xiaomi CarTech Checkout

## Deploy final en Vercel

Este repo quedó preparado para desplegar frontend (Vite) + funciones API nativas de Vercel (`/api/*`).

### Variables de entorno que debes crear en Vercel (Production y Preview)

- `APP_URL=https://xiaomicartech.com.co`
- `WOMPI_PUBLIC_KEY=pub_prod_...`
- `WOMPI_PRIVATE_KEY=prv_prod_...`
- `WOMPI_INTEGRITY_SECRET=prod_integrity_...`
- `WOMPI_EVENTS_SECRET=prod_events_...`
- `RESEND_API_KEY=re_...`
- `RESEND_FROM_EMAIL=ventas@xiaomicartech.com.co`
- `RESEND_ADMIN_EMAIL=ventas@xiaomicartech.com.co`

> Si usas un dominio alterno temporal de Vercel, actualiza `APP_URL` al dominio activo y luego vuelve a `https://xiaomicartech.com.co` cuando conectes el dominio final.

## Webhook Wompi (producción)

En Wompi configura la URL de eventos así:

`https://xiaomicartech.com.co/api/wompi/webhook`

## Verificación post-deploy

1. Verifica integraciones:

```bash
curl https://xiaomicartech.com.co/api/health/integrations
```

2. Debe responder:
- `wompi.publicKeyConfigured: true`
- `wompi.integritySecretConfigured: true`
- `resend.apiKeyConfigured: true`

3. Flujo esperado:
- `POST /api/orders` crea orden `PENDING`.
- Wompi confirma por webhook (`transaction.updated`).
- Orden pasa a `APPROVED`.
- Se envía correo por Resend al cliente + copia admin.


## Arquitectura de despliegue (final)

- Frontend: build estático de Vite.
- Backend: función serverless en `api/index.ts` que reutiliza `app` de Express.
- Se eliminó configuración legacy `vercel.json` con `builds` para evitar desalineaciones de settings en Vercel.

## Solución de error en Vercel por símbolos duplicados en `server.ts`

Si Vercel muestra errores como `wompiPublicKey has already been declared`, significa que en `main` quedó una versión duplicada de `server.ts` por merge conflict.

Checklist:

1. Verifica que solo exista una declaración de cada símbolo:
   - `wompiPublicKey`
   - `wompiIntegritySecret`
   - `wompiEventsSecret`
   - `appUrl`
   - `addBusinessDays`
2. Ejecuta localmente:

```bash
rg -n "const wompiPublicKey|const wompiIntegritySecret|const wompiEventsSecret|const appUrl|const addBusinessDays" server.ts
npm run build
```

Cada `const` debe salir solo una vez y el build debe finalizar sin errores.
3. Sube ese commit a `main` y vuelve a desplegar en Vercel.
