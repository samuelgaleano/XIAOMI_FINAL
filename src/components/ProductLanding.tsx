import React from "react";
import {
  Award,
  Zap,
  ShieldCheck,
  MessageCircle,
  Star,
  Cpu,
  Truck,
  RotateCcw,
  Play,
  Smartphone,
  Fan,
  Hand,
  CreditCard,
} from "lucide-react";

import { formatCOP } from "../lib/format";
import { getProductCopy, IMG_CAR, IMG_HAND } from "../lib/product";
import { useI18n } from "../lib/i18n";

interface ProductLandingProps {
  onOpenCheckout: () => void;
  onViewProduct: () => void;
}

const PRICE = 169900;
const ORIGINAL_PRICE = 219900;

const SERVICE_ICONS = [Truck, RotateCcw, Award, ShieldCheck];
const FEATURE_ICONS = [Zap, Cpu, Fan];

const initialsOf = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export default function ProductLanding({ onOpenCheckout, onViewProduct }: ProductLandingProps) {
  const { s, lang } = useI18n();
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  // La barra de producto solo aparece al pasar el módulo de compra del hero, como en mi.com
  const [showBar, setShowBar] = React.useState(false);
  const heroRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === "undefined") {
      setShowBar(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    window.fbq?.('track', 'ViewContent', {
      content_ids: ['MI-20W-CAR-CHARGER'],
      content_type: 'product',
      content_name: 'Mi 20W Wireless Car Charger',
      value: PRICE,
      currency: 'COP',
    });
  }, []);

  // Imágenes oficiales autohospedadas
  const HERO_IMAGE = IMG_CAR;
  const SENSOR_IMAGE = IMG_HAND;

  const savings = ORIGINAL_PRICE - PRICE;
  const productName = "Mi 20W Wireless Car Charger";

  return (
    <div className="bg-white" id="overview">

      {/* Barra de producto fija — aparece al pasar el hero, patrón de página de producto de mi.com */}
      <div
        className={`fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-b border-line transition-transform duration-300 ${
          showBar ? "translate-y-0" : "-translate-y-full"
        }`}
        aria-hidden={!showBar}
      >
        <div className="max-w-mi mx-auto px-5 h-14 flex items-center justify-between gap-3">
          <span className="text-[13px] sm:text-[15px] font-semibold text-ink truncate">
            {productName}
          </span>
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <nav className="hidden lg:flex items-center gap-6 text-[13px] text-muted">
              <a href="#features" className="hover:text-ink transition-colors">{s.nav.features}</a>
              <a href="#specs" className="hover:text-ink transition-colors">{s.nav.specs}</a>
              <a href="#reviews" className="hover:text-ink transition-colors">{s.nav.reviews}</a>
            </nav>
            <div className="flex items-baseline gap-2">
              <span className="text-[14px] sm:text-[15px] font-semibold text-mi-text">{formatCOP(PRICE)}</span>
              <span className="hidden sm:inline text-xs text-faint line-through">{formatCOP(ORIGINAL_PRICE)}</span>
            </div>
            <button
              onClick={onOpenCheckout}
              className="bg-mi hover:bg-mi-dark text-white h-11 sm:h-9 px-4 sm:px-5 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
              id="hero-buy-now-btn"
              tabIndex={showBar ? 0 : -1}
            >
              {s.common.buyNow}
            </button>
          </div>
        </div>
      </div>

      {/* HERO — presentación centrada estilo mi.com */}
      <section className="bg-white">
        <div className="max-w-mi mx-auto px-5 pt-12 md:pt-16 pb-10 text-center animate-fade-in-up">
          <p className="text-[13px] md:text-sm font-medium text-muted">{s.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl md:text-[56px] leading-tight font-semibold text-ink tracking-tight">
            {productName}
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted font-normal">
            <span className="inline-block">{s.hero.claims[0]}</span>
            <span className="mx-2 text-line" aria-hidden="true">|</span>
            <span className="inline-block">{s.hero.claims[1]}</span>
            <span className="mx-2 text-line" aria-hidden="true">|</span>
            <span className="inline-block">{s.hero.claims[2]}</span>
          </p>

          <div className="mt-6 flex items-baseline justify-center gap-3">
            <span className="text-3xl md:text-4xl font-semibold text-mi-dark">{formatCOP(PRICE)}</span>
            <span className="text-lg text-faint line-through">{formatCOP(ORIGINAL_PRICE)}</span>
            <span className="hidden sm:inline-block text-xs font-medium text-mi-text bg-mi-soft border border-mi/20 rounded px-2 py-1">
              {s.hero.save(formatCOP(savings))}
            </span>
          </div>

          <div ref={heroRef} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto bg-mi hover:bg-mi-dark text-white h-12 px-10 rounded-lg font-semibold text-[15px] transition-colors cursor-pointer"
              id="hero-image-immediate-buy-btn"
            >
              {s.common.buyNow}
            </button>
            <button
              onClick={onViewProduct}
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-10 rounded-lg font-medium text-[15px] text-body border border-[#b0b0b0] hover:border-ink hover:text-ink transition-colors cursor-pointer"
            >
              {s.common.viewProduct}
            </button>
          </div>
          <p className="mt-4 text-xs text-muted">{s.hero.note}</p>

          {/* Imagen principal del producto — clic para abrir la galería del producto */}
          <div className="mt-10 md:mt-14 max-w-4xl mx-auto">
            <button
              onClick={onViewProduct}
              className="group relative block w-full rounded-2xl overflow-hidden bg-paper cursor-pointer"
              aria-label={s.common.viewProduct}
            >
              <img
                src={HERO_IMAGE}
                alt={productName}
                className="w-full aspect-[4/3] md:aspect-[16/9] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm text-ink text-[13px] font-medium px-4 py-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {s.hero.galleryHint}
              </span>
            </button>
          </div>
        </div>

        {/* Franja de servicios — como la tienda mi.com/co */}
        <div className="border-y border-line bg-white">
          <div className="max-w-mi mx-auto px-5 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {s.services.map((svc, i) => {
              const Icon = SERVICE_ICONS[i];
              return (
                <div key={svc.title} className="flex items-center justify-center gap-3 text-center sm:text-left">
                  <Icon className="w-6 h-6 text-mi shrink-0 hidden sm:block" strokeWidth={1.6} />
                  <div>
                    <p className="text-sm font-medium text-ink">{svc.title}</p>
                    <p className="text-xs text-muted mt-0.5">{svc.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS DESTACADAS — tarjetas blancas sobre gris mi.com */}
      <section className="bg-paper py-14 md:py-20" id="features">
        <div className="max-w-mi mx-auto px-5">
          <h2 className="text-2xl md:text-[34px] font-semibold text-ink text-center tracking-tight">
            {s.features.heading}
          </h2>
          <p className="text-sm md:text-base text-muted text-center mt-3 max-w-2xl mx-auto">
            {s.features.sub}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {s.features.cards.map((card, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <div key={card.title} className="bg-white rounded-2xl p-8 text-center">
                  <Icon className="w-7 h-7 text-mi mx-auto" strokeWidth={1.6} />
                  <p className="mt-4 text-4xl font-semibold text-ink tracking-tight">{card.stat}</p>
                  <h3 className="mt-2 text-base font-semibold text-ink">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{card.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECCIÓN: Sensor infrarrojo */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-mi mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <img
            src={SENSOR_IMAGE}
            alt={s.sensor.eyebrow}
            className="w-full aspect-[4/3] object-cover rounded-2xl bg-paper order-1"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="order-2 text-left">
            <p className="text-[13px] font-medium text-mi-text">{s.sensor.eyebrow}</p>
            <h2 className="mt-3 text-2xl md:text-[34px] font-semibold text-ink tracking-tight leading-tight">
              {s.sensor.heading}
            </h2>
            <p className="mt-4 text-[15px] text-body leading-relaxed">{s.sensor.p1}</p>
            <p className="mt-3 text-[15px] text-body leading-relaxed">{s.sensor.p2}</p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
              <div>
                <Hand className="w-5 h-5 text-mi" strokeWidth={1.6} />
                <h4 className="mt-2 text-sm font-semibold text-ink">{s.sensor.f1t}</h4>
                <p className="mt-1 text-xs text-muted leading-relaxed">{s.sensor.f1s}</p>
              </div>
              <div>
                <Smartphone className="w-5 h-5 text-mi" strokeWidth={1.6} />
                <h4 className="mt-2 text-sm font-semibold text-ink">{s.sensor.f2t}</h4>
                <p className="mt-1 text-xs text-muted leading-relaxed">{s.sensor.f2s}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: 20W — bloque de cifra grande estilo Xiaomi */}
      <section className="bg-paper py-14 md:py-20">
        <div className="max-w-mi mx-auto px-5 text-center">
          <p className="text-[13px] font-medium text-mi-text">{s.power.eyebrow}</p>
          <h2 className="mt-3 text-2xl md:text-[34px] font-semibold text-ink tracking-tight">
            {s.power.heading}
          </h2>
          <p className="mt-2 text-[88px] md:text-[120px] leading-none font-semibold text-mi tracking-tight">
            20W
          </p>
          <p className="mt-6 text-[15px] text-body max-w-[560px] mx-auto leading-relaxed">{s.power.p}</p>
          <p className="mt-3 text-xs text-muted">{s.power.note}</p>
          <button
            onClick={onOpenCheckout}
            className="mt-8 text-mi-text font-medium hover:text-mi-dark transition-colors text-sm cursor-pointer"
            id="features-link-btn"
          >
            {s.power.link}
          </button>
        </div>
      </section>

      {/* GALERÍA + VIDEO */}
      <section className="bg-white py-14 md:py-20" id="gallery">
        <div className="max-w-mi mx-auto px-5">
          <h2 className="text-2xl md:text-[34px] font-semibold text-ink text-center tracking-tight">
            {s.gallery.heading}
          </h2>
          <p className="text-sm text-muted text-center mt-3">{s.gallery.sub}</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            <img
              src={HERO_IMAGE}
              alt={s.gallery.heading}
              className="w-full h-72 md:h-[420px] object-cover rounded-2xl bg-paper"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="relative rounded-2xl overflow-hidden h-72 md:h-[420px] bg-ink group">
              {videoPlaying ? (
                <div className="absolute inset-0 flex justify-center items-center text-white bg-ink">
                  <div className="text-center p-6">
                    <Smartphone className="w-10 h-10 text-mi animate-pulse mx-auto mb-3" />
                    <p className="font-semibold text-lg">{s.gallery.demoTitle}</p>
                    <p className="text-xs text-white/60 mt-1">{s.gallery.demoSub}</p>
                    <button
                      onClick={() => setVideoPlaying(false)}
                      className="mt-5 text-xs font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/20 transition-colors cursor-pointer"
                      id="close-video-btn"
                    >
                      {s.gallery.demoStop}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={SENSOR_IMAGE}
                    alt={s.gallery.demoCaption}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 duration-700 transition-transform"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className="absolute inset-0 m-auto z-10 w-16 h-16 rounded-full bg-white text-ink flex items-center justify-center shadow-lg hover:scale-105 duration-200 transition-transform cursor-pointer"
                    aria-label={s.gallery.play}
                    id="play-video-btn"
                  >
                    <Play className="w-6 h-6 fill-ink ml-0.5" />
                  </button>
                  <p className="absolute bottom-4 left-4 right-4 z-10 text-white text-xs font-medium bg-black/50 backdrop-blur-sm px-4 py-2.5 rounded-lg text-left">
                    {s.gallery.demoCaption}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ESPECIFICACIONES — tabla estilo mi.com */}
      <section className="bg-paper py-14 md:py-20" id="specs">
        <div className="max-w-mi mx-auto px-5">
          <h2 className="text-2xl md:text-[34px] font-semibold text-ink text-center tracking-tight">
            {s.specsHeading}
          </h2>

          <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl px-6 md:px-10 py-4">
            {getProductCopy(lang).specs.map(({ group, rows }) => (
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
      </section>

      {/* RESEÑAS */}
      <section className="bg-white py-14 md:py-20" id="reviews">
        <div className="max-w-mi mx-auto px-5">
          <h2 className="text-2xl md:text-[34px] font-semibold text-ink text-center tracking-tight">
            {s.reviews.heading}
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex gap-0.5" role="img" aria-label={s.ratingLabel(5)}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-mi text-mi" aria-hidden="true" />
              ))}
            </div>
            <span className="text-sm text-muted">{s.reviews.sub}</span>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {s.reviews.items.map(({ name, city, text }) => (
              <div key={name} className="bg-paper rounded-2xl p-7 flex flex-col justify-between">
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-mi text-mi" />
                    ))}
                  </div>
                  <p className="text-sm text-body leading-relaxed">“{text}”</p>
                </div>
                <div className="mt-6 pt-5 border-t border-line flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white text-mi font-semibold flex items-center justify-center text-xs">
                    {initialsOf(name)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink text-xs">{name}</h4>
                    <p className="text-[11px] text-muted mt-0.5">{s.reviews.verified(city)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL — módulo de compra estilo mi.com */}
      <section className="bg-paper py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-5">
          <div className="bg-white rounded-2xl px-6 md:px-12 py-10 md:py-12 text-center">
            <p className="text-[13px] font-medium text-mi-text">{s.ctaFinal.eyebrow}</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-ink tracking-tight">
              {productName}
            </h2>
            <div className="mt-4 flex items-baseline justify-center gap-3">
              <span className="text-3xl font-semibold text-mi-dark">{formatCOP(PRICE)}</span>
              <span className="text-base text-faint line-through">{formatCOP(ORIGINAL_PRICE)}</span>
            </div>
            <p className="mt-2 text-xs text-muted">{s.ctaFinal.note}</p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenCheckout}
                className="w-full sm:w-auto bg-mi hover:bg-mi-dark text-white h-12 px-10 rounded-lg font-medium text-[15px] transition-colors cursor-pointer"
                id="cta-bottom-buy-btn"
              >
                {s.common.buyNow}
              </button>
              <a
                href={`https://wa.me/573148145417?text=${encodeURIComponent(s.wa.advisor)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg font-medium text-[15px] text-body border border-[#b0b0b0] hover:border-ink hover:text-ink transition-colors"
                id="wa-bottom-btn"
              >
                <MessageCircle className="w-4 h-4" />
                {s.ctaFinal.advisor}
              </a>
            </div>
            <p className="mt-5 text-[11px] text-muted flex items-center justify-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              {s.ctaFinal.pay}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
