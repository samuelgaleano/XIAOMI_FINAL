import React from "react";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
} from "lucide-react";
import { formatCOP } from "../lib/format";
import { PRODUCT, GALLERY, SPECS } from "../lib/product";

interface ProductDetailProps {
  onBuyNow: (qty: number) => void;
  onAddToCart: (qty: number) => void;
  onBack: () => void;
}

export default function ProductDetail({ onBuyNow, onAddToCart, onBack }: ProductDetailProps) {
  const [active, setActive] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const touchStartX = React.useRef<number | null>(null);

  const count = GALLERY.length;
  const go = (dir: number) => setActive((i) => (i + dir + count) % count);

  const savings = PRODUCT.originalPrice - PRODUCT.price;
  const total = PRODUCT.price * qty;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-mi mx-auto px-5">

        {/* Miga de pan */}
        <nav className="py-4 text-[13px] text-faint flex items-center gap-1.5" aria-label="Ruta de navegación">
          <button onClick={onBack} className="text-mi-text hover:text-mi-dark cursor-pointer">Inicio</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Tienda</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-body">{PRODUCT.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-14">

          {/* GALERÍA — carrusel deslizable */}
          <div>
            <div
              className="relative rounded-2xl overflow-hidden bg-paper aspect-square group"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {GALLERY.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    i === active ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                />
              ))}

              {/* Controles anterior / siguiente */}
              <button
                onClick={() => go(-1)}
                aria-label="Imagen anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-ink shadow-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Imagen siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-ink shadow-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Contador */}
              <span className="absolute top-3 right-3 bg-black/55 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {active + 1} / {count}
              </span>

              {/* Leyenda */}
              <p className="absolute bottom-3 left-3 right-3 text-white text-[13px] font-medium bg-black/45 backdrop-blur-sm px-3.5 py-2 rounded-lg">
                {GALLERY[active].caption}
              </p>
            </div>

            {/* Miniaturas */}
            <div className="flex gap-3 mt-4">
              {GALLERY.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  aria-current={i === active}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-paper shrink-0 transition-all cursor-pointer ${
                    i === active ? "ring-2 ring-mi ring-offset-2" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.src} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* PANEL DE COMPRA */}
          <div className="lg:sticky lg:top-6 self-start">
            <p className="text-[13px] font-medium text-muted">{PRODUCT.brand}</p>
            <h1 className="mt-1.5 text-2xl md:text-[32px] leading-tight font-semibold text-ink tracking-tight">
              {PRODUCT.name}
            </h1>

            {/* Calificación */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex gap-0.5" role="img" aria-label={`Calificación ${PRODUCT.rating} de 5`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-mi text-mi" aria-hidden="true" />
                ))}
              </div>
              <span className="text-[13px] text-muted">
                {PRODUCT.rating} · {PRODUCT.reviewCount} reseñas verificadas
              </span>
            </div>

            {/* Precio */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-mi-dark">{formatCOP(PRODUCT.price)}</span>
              <span className="text-lg text-faint line-through">{formatCOP(PRODUCT.originalPrice)}</span>
              <span className="text-xs font-medium text-mi-text bg-mi-soft border border-mi/20 rounded px-2 py-1">
                Ahorras {formatCOP(savings)}
              </span>
            </div>
            <p className="mt-1.5 text-[13px] text-muted">Impuestos incluidos · Envío gratis a todo Colombia</p>

            {/* Puntos clave */}
            <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
              {PRODUCT.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-body">
                  <Check className="w-4 h-4 text-mi-text shrink-0 mt-0.5" />
                  {h}
                </li>
              ))}
            </ul>

            {/* Cantidad */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-medium text-ink">Cantidad</span>
              <div className="flex items-center border border-line rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Disminuir cantidad"
                  className="w-11 h-11 flex items-center justify-center text-ink hover:bg-paper disabled:text-faint disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-base font-medium text-ink tabular-nums" aria-live="polite">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(PRODUCT.maxQuantity, q + 1))}
                  disabled={qty >= PRODUCT.maxQuantity}
                  aria-label="Aumentar cantidad"
                  className="w-11 h-11 flex items-center justify-center text-ink hover:bg-paper disabled:text-faint disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {qty > 1 && (
                <span className="text-sm text-muted">Total: <span className="font-semibold text-ink">{formatCOP(total)}</span></span>
              )}
            </div>

            {/* Acciones */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onAddToCart(qty)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg font-semibold text-[15px] text-mi-text border border-mi hover:bg-mi-soft transition-colors cursor-pointer"
                id="pdp-add-to-cart-btn"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                Agregar al carrito
              </button>
              <button
                onClick={() => onBuyNow(qty)}
                className="flex-1 inline-flex items-center justify-center h-12 px-6 rounded-lg font-semibold text-[15px] text-white bg-mi hover:bg-mi-dark transition-colors cursor-pointer"
                id="pdp-buy-now-btn"
              >
                Comprar ahora
              </button>
            </div>

            {/* Confianza */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-line pt-6">
              {[
                { icon: Truck, title: "Envío gratis", sub: "2 a 5 días hábiles" },
                { icon: ShieldCheck, title: "Garantía oficial", sub: "12 meses Xiaomi" },
                { icon: RotateCcw, title: "Devoluciones", sub: "14 días sin costo" },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-mi shrink-0" strokeWidth={1.6} />
                  <div>
                    <p className="text-[13px] font-medium text-ink leading-tight">{title}</p>
                    <p className="text-[11px] text-muted">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/573000000000?text=Hola%2C%20quiero%20asesor%C3%ADa%20sobre%20el%20Mi%2020W%20Wireless%20Car%20Charger."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-mi transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              ¿Tienes dudas? Habla con un asesor
            </a>
          </div>
        </div>

        {/* ESPECIFICACIONES */}
        <div className="border-t border-line py-12">
          <h2 className="text-xl md:text-2xl font-semibold text-ink tracking-tight text-center">
            Especificaciones
          </h2>
          <div className="mt-8 max-w-3xl mx-auto bg-paper rounded-2xl px-6 md:px-10 py-4">
            {SPECS.map(({ group, rows }) => (
              <div key={group} className="py-5 border-b border-line last:border-0">
                <h3 className="text-sm font-semibold text-mi-text mb-3">{group}</h3>
                {rows.map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-6 py-2 text-sm">
                    <span className="text-muted shrink-0">{label}</span>
                    <span className="text-ink font-medium sm:text-right">{value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
