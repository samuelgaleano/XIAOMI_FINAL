# Auditoría visual — Rediseño estilo mi.com (Xiaomi Colombia)

**Fecha:** 2026-07-14 · **Alcance:** landing, checkout, página de éxito, header y footer.

## 1. Objetivo

Alinear todo el frontend con el lenguaje visual oficial de la tienda Xiaomi
(mi.com/co), como corresponde a un distribuidor autorizado, y auditar el resultado.

> Nota de metodología: el entorno de trabajo tiene una allowlist de red que bloquea
> `mi.com` (y Web Archive), por lo que la referencia se construyó con el design system
> global de Xiaomi (idéntica plataforma en todas las regiones), la información pública
> de la tienda Colombia (franja de servicios: envío 2–5 días, devoluciones 14 días,
> garantía oficial, pagos seguros) y la tipografía oficial MiSans. Para una
> verificación pixel-perfect contra mi.com/co en vivo, añadir `www.mi.com` a la
> allowlist del entorno.

## 2. Design system aplicado (tokens en `src/index.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-mi` | `#ff6900` | Naranja oficial Xiaomi: CTAs, iconos, acentos |
| `--color-mi-dark` | `#e05e00` | Hover de CTAs y precios grandes (contraste 3.6:1) |
| `--color-mi-text` | `#c94f00` | Naranja para texto pequeño — 4.56:1 sobre blanco (WCAG AA) |
| `--color-ink` | `#1a1a1a` | Titulares |
| `--color-body` | `#424242` | Párrafos |
| `--color-muted` | `#757575` | Texto secundario |
| `--color-line` | `#e0e0e0` | Bordes y divisores |
| `--color-paper` | `#f5f5f5` | Fondo de página (tarjetas blancas encima, radio 16px) |
| `--container-mi` | `1226px` | Ancho de contenedor de mi.com |
| Tipografía | MiSans 400/500/600/700 | Oficial de Xiaomi, subset Latin autohospedado (`public/fonts/`, licencia incluida) |

Patrones estructurales replicados de mi.com: barra superior de utilidades, header
limpio con carrito, **barra de producto fija que aparece al pasar el módulo de compra**
(nombre + anclas + precio + CTA), hero centrado con subtítulo de claims, franja de
servicios, tarjetas KPI, tabla de especificaciones por grupos, footer de columnas con
barra legal inferior y leyenda de marcas registradas.

## 3. Auditoría multi-agente

Cinco revisores independientes (fidelidad Xiaomi, tipografía/jerarquía, responsive,
accesibilidad visual, conversión) generaron 40 hallazgos; cada uno fue sometido a un
verificador adversarial contra el código y los screenshots reales: **25 confirmados,
2 refutados, 13 quedaron sin verificar** (límite de sesión) y se tratan como plausibles.

### 3.1 Corregido en este commit

- **Formato de precio único** `$ 169.900` en todo el funnel (`src/lib/format.ts`);
  eliminado el «COP $169.900,00» estilo Shopify del total.
- **Barra de producto**: ya no está visible desde el primer pixel; aparece con
  transición al pasar el CTA del hero (IntersectionObserver). En móvil ahora muestra
  el precio y su CTA sube a 44px de alto táctil.
- **Header sin tercer CTA**: el botón naranja duplicado se reemplazó por el icono de
  carrito, como mi.com; hamburguesa con área táctil de 44px.
- **Checkout re-tokenizado**: fondo `#f5f5f5` + tarjetas blancas r16 (antes esquema
  Shopify invertido), contenedor 1226px, los 9 grises fuera de paleta mapeados a
  tokens, «GRATIS» verde → «Gratis» naranja, badges Addi/PSE/VISA en gris neutro,
  eliminado el enlace muerto «Inicia sesión».
- **Checkout accesible**: radios reales (`input type=radio`) operables por teclado,
  foco visible (se eliminó `outline: none`), inputs a 16px (sin auto-zoom de iOS),
  selector de cantidad ≥44px.
- **Checkout responsive**: la fila Ciudad/Ciudad/Código postal de 3 columnas fijas se
  apila en móvil; se eliminó el select de ciudad duplicado que no guardaba su valor
  (riesgo de envíos a ciudad equivocada).
- **Aritmética del resumen coherente**: Precio de lista (tachado) − Descuento = Total.
- **Kickers en sentence case** (antes MAYÚSCULAS + tracking 0.18em, patrón de landing
  genérica) y eyebrow del hero acortado (ya no deja viuda en móvil).
- **Subtítulo del hero** con grupos inseparables: ya no parte «Sensor infrarrojo
  automático» a mitad de término.
- **Contraste**: precios grandes en `#e05e00` (≥3:1) y texto naranja pequeño en
  `#c94f00` (≥4.5:1); estrellas de reseñas con alternativa textual (`aria-label`).
- **Anclas** con `scroll-padding-top`: los títulos ya no quedan bajo la barra fija.
- **Footer**: sin enlace público «Panel administrador» (ahora se accede por `#admin`),
  email sin desborde en móvil, chips de pago a 11px.
- **Specs en móvil**: etiqueta arriba / valor abajo (ya no envuelven alineados a la
  derecha separando cifra de unidad).
- **Hero sin badge flotante** sobre la fotografía (el sello de garantía ya vive en la
  franja de servicios); línea de medida del bloque 20W limitada a ~70 caracteres.
- Consentimiento de marketing **ya no viene premarcado**; el campo de contacto pide
  correo (lo que el backend usa realmente) en vez de «email o teléfono».

### 3.2 Pendiente / recomendaciones

1. **Botones naranjas con texto blanco (2.89:1)**: falla WCAG AA, pero es el patrón de
   marca del propio mi.com. Mitigado con texto semibold. Si se exige AA estricto,
   usar `#b34600` como fondo de CTA (5.5:1) a costa de fidelidad de marca.
2. **Resumen del pedido en checkout móvil** empuja el formulario ~500px: convertirlo
   en acordeón colapsado («Mostrar resumen del pedido») como hace Shopify/mi.com móvil.
3. **WhatsApp placeholder** (`573000000000`) en todos los enlaces `wa.me`: reemplazar
   por el número real del negocio.
4. **Imágenes de producto hotlinkeadas** a `lh3.googleusercontent.com`: descargarlas a
   `public/` (riesgo de expiración/bloqueo del hotlink y sin control de compresión).
   No se pudo hacer desde este entorno por la política de red.
5. **Reseñas 5/5 unánimes sin conteo**: mostrar promedio y número real de reseñas
   verificables para credibilidad (patrón mi.com: nota media + total).
6. **AdminPanel** (hallazgo colateral de seguridad, fuera del alcance visual): el login
   es client-side con contraseña embebida en el bundle y `/api/orders` se consulta sin
   autenticación; proteger con autenticación real de backend.
7. **Pago contra entrega**: considerar destacarlo (es un desbloqueador de conversión
   típico en Colombia), p. ej. como opción visible sin scroll en móvil.

## 4. Verificación

- `tsc --noEmit` y `vite build` en verde.
- Screenshots desktop (1440px) y móvil (390px) de landing, checkout y estados con
  scroll capturados con Chromium tras cada iteración (las imágenes externas de
  producto aparecen rotas solo en el sandbox por la política de red; en producción
  cargan normalmente).
- Design system publicado en el proyecto «Design System» de claude.ai/design
  (tokens, tipografía, botones, barra de producto, franja de servicios, tarjetas,
  tabla de specs y footer).
