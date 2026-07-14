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
  CheckCircle2,
  Play,
  Smartphone,
  Fan,
  Hand,
  CreditCard,
} from "lucide-react";

import { formatCOP } from "../lib/format";

interface ProductLandingProps {
  onOpenCheckout: () => void;
}

const PRICE = 169900;
const ORIGINAL_PRICE = 219900;

export default function ProductLanding({ onOpenCheckout }: ProductLandingProps) {
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

  // Imágenes de producto en alta resolución
  const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDb4tCIFKq4rJ1NAc4KY3AWQupIYxvPvzbo2ou8Qs9SISyT_OpBQR_dV0Bxu6VOXnbXmVKNuKlTHWIt97tzsiI0FdGKiUA7nrOioGZ5D0QsIDBnt4Sta1EkXrXylIDfOtgsaRl5RRbiBO1WnueWMi3okedfpcpVxUuBclVXr0j72KU939Mvv8FcE4gMfIXKkTgVAfS0F1n7T0xFRyYRChGGK4Y4cIRqoe_H-QRYojjGXJlhpAfvP49lr8rEui2QpnfepFcGBNTiGD8q";
  const SENSOR_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDg0HLk0eGSwLD-wc4mZm10E3USrVDH3KyEAImvUPvG9wvf6iUfrdsZbtMl_rf4c9X0rBBD2tunap6miExDRDrBjgdaXODEgZXRtjtHkDzDoy3f0OjUHfmJivQLQrwjdVnBHha9R97loxnUnNGS3MfLjRCYWcrndS2_Zjx22ft3HovIQXMOulgApcV-i-DGq3lUWNFIG-yF3mwcVGf_FYOoQNOalPXeNZ8D1_DiWfqSZ9HY74OY5BWPNbFYop9ex1Jp4E0Ymo_FdbLp";

  const savings = ORIGINAL_PRICE - PRICE;

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
            Mi 20W Wireless Car Charger
          </span>
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <nav className="hidden lg:flex items-center gap-6 text-[13px] text-muted">
              <a href="#features" className="hover:text-ink transition-colors">Características</a>
              <a href="#specs" className="hover:text-ink transition-colors">Especificaciones</a>
              <a href="#reviews" className="hover:text-ink transition-colors">Reseñas</a>
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
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      {/* HERO — presentación centrada estilo mi.com */}
      <section className="bg-white">
        <div className="max-w-mi mx-auto px-5 pt-12 md:pt-16 pb-10 text-center animate-fade-in-up">
          <p className="text-[13px] md:text-sm font-medium text-muted">
            Xiaomi · Distribuidor autorizado en Colombia
          </p>
          <h1 className="mt-3 text-4xl md:text-[56px] leading-tight font-semibold text-ink tracking-tight">
            Mi 20W Wireless Car Charger
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted font-normal">
            <span className="inline-block">Carga inalámbrica de 20W</span>
            <span className="mx-2 text-line" aria-hidden="true">|</span>
            <span className="inline-block">Sensor infrarrojo automático</span>
            <span className="mx-2 text-line" aria-hidden="true">|</span>
            <span className="inline-block">Refrigeración activa</span>
          </p>

          <div className="mt-6 flex items-baseline justify-center gap-3">
            <span className="text-3xl md:text-4xl font-semibold text-mi-dark">{formatCOP(PRICE)}</span>
            <span className="text-lg text-faint line-through">{formatCOP(ORIGINAL_PRICE)}</span>
            <span className="hidden sm:inline-block text-xs font-medium text-mi-text bg-mi-soft border border-mi/20 rounded px-2 py-1">
              Ahorras {formatCOP(savings)}
            </span>
          </div>

          <div ref={heroRef} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto bg-mi hover:bg-mi-dark text-white h-12 px-10 rounded-lg font-semibold text-[15px] transition-colors cursor-pointer"
              id="hero-image-immediate-buy-btn"
            >
              Comprar ahora
            </button>
            <a
              href="#specs"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-10 rounded-lg font-medium text-[15px] text-body border border-[#b0b0b0] hover:border-ink hover:text-ink transition-colors"
            >
              Ver especificaciones
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">
            Envío gratis a todo el país · Paga con PSE, Nequi, tarjetas o contra entrega
          </p>

          {/* Imagen principal del producto — bodegón limpio, sin overlays */}
          <div className="mt-10 md:mt-14 max-w-4xl mx-auto">
            <img
              src={HERO_IMAGE}
              alt="Mi 20W Wireless Car Charger instalado en la rejilla de ventilación del carro"
              className="w-full aspect-[4/3] md:aspect-[16/9] object-cover rounded-2xl bg-paper"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Franja de servicios — como la tienda mi.com/co */}
        <div className="border-y border-line bg-white">
          <div className="max-w-mi mx-auto px-5 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Envío gratis", sub: "Entrega en 2 a 5 días hábiles" },
              { icon: RotateCcw, title: "Devoluciones", sub: "14 días sin costo" },
              { icon: Award, title: "Garantía oficial", sub: "12 meses Xiaomi" },
              { icon: ShieldCheck, title: "Pagos 100% seguros", sub: "Wompi · PSE · Nequi" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center justify-center gap-3 text-center sm:text-left">
                <Icon className="w-6 h-6 text-mi shrink-0 hidden sm:block" strokeWidth={1.6} />
                <div>
                  <p className="text-sm font-medium text-ink">{title}</p>
                  <p className="text-xs text-muted mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS DESTACADAS — tarjetas blancas sobre gris mi.com */}
      <section className="bg-paper py-14 md:py-20" id="features">
        <div className="max-w-mi mx-auto px-5">
          <h2 className="text-2xl md:text-[34px] font-semibold text-ink text-center tracking-tight">
            Diseñado para tu día a día al volante
          </h2>
          <p className="text-sm md:text-base text-muted text-center mt-3 max-w-2xl mx-auto">
            Tecnología de carga certificada Qi con la calidad de fabricación de Xiaomi.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                stat: "20W",
                title: "Carga súper rápida",
                sub: "Del 0% al 45% en 30 minutos de conducción en dispositivos compatibles.",
              },
              {
                icon: Cpu,
                stat: "8 cm",
                title: "Sensor infrarrojo",
                sub: "Los brazos se abren solos al acercar el teléfono y lo sujetan firmemente.",
              },
              {
                icon: Fan,
                stat: "2×",
                title: "Doble disipación",
                sub: "Ventilador silencioso y disipador trasero que protegen la batería.",
              },
            ].map(({ icon: Icon, stat, title, sub }) => (
              <div key={title} className="bg-white rounded-2xl p-8 text-center">
                <Icon className="w-7 h-7 text-mi mx-auto" strokeWidth={1.6} />
                <p className="mt-4 text-4xl font-semibold text-ink tracking-tight">{stat}</p>
                <h3 className="mt-2 text-base font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: Sensor infrarrojo */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-mi mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <img
            src={SENSOR_IMAGE}
            alt="Detalle del sensor infrarrojo del Mi 20W Wireless Car Charger"
            className="w-full aspect-[4/3] object-cover rounded-2xl bg-paper order-1"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="order-2 text-left">
            <p className="text-[13px] font-medium text-mi-text">
              Sujeción automática
            </p>
            <h2 className="mt-3 text-2xl md:text-[34px] font-semibold text-ink tracking-tight leading-tight">
              Acércalo y se abre. Tócalo y se libera.
            </h2>
            <p className="mt-4 text-[15px] text-body leading-relaxed">
              El sensor infrarrojo oculto detecta tu teléfono a menos de 8 cm: los brazos
              motorizados se abren suavemente y se cierran firmes en un instante, sin que
              apartes la vista del camino.
            </p>
            <p className="mt-3 text-[15px] text-body leading-relaxed">
              Para retirarlo, un toque en el sensor lateral activa el sistema de liberación
              y tu teléfono queda libre al instante. Todo con una sola mano.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
              <div>
                <Hand className="w-5 h-5 text-mi" strokeWidth={1.6} />
                <h4 className="mt-2 text-sm font-semibold text-ink">Operación con una mano</h4>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  Coloca y retira el teléfono en un segundo.
                </p>
              </div>
              <div>
                <Smartphone className="w-5 h-5 text-mi" strokeWidth={1.6} />
                <h4 className="mt-2 text-sm font-semibold text-ink">Cristal curvo 2.5D</h4>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  Panel de vidrio premium con mejor disipación térmica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: 20W — bloque de cifra grande estilo Xiaomi */}
      <section className="bg-paper py-14 md:py-20">
        <div className="max-w-mi mx-auto px-5 text-center">
          <p className="text-[13px] font-medium text-mi-text">
            Potencia certificada Qi
          </p>
          <h2 className="mt-3 text-2xl md:text-[34px] font-semibold text-ink tracking-tight">
            Carga inalámbrica de hasta
          </h2>
          <p className="mt-2 text-[88px] md:text-[120px] leading-none font-semibold text-mi tracking-tight">
            20W
          </p>
          <p className="mt-6 text-[15px] text-body max-w-[560px] mx-auto leading-relaxed">
            Recupera hasta un 45% de batería en 30 minutos de trayecto. El doble mecanismo
            de protección térmica —ventilador extractor interno y disipador metálico
            trasero— balancea la potencia según la temperatura para cuidar tu batería a
            largo plazo.
          </p>
          <p className="mt-3 text-xs text-muted">
            Compatible con todos los teléfonos con certificación Qi: Xiaomi, Apple, Samsung, Huawei y más.
          </p>
          <button
            onClick={onOpenCheckout}
            className="mt-8 text-mi-text font-medium hover:text-mi-dark transition-colors text-sm cursor-pointer"
            id="features-link-btn"
          >
            Comprar con garantía original →
          </button>
        </div>
      </section>

      {/* GALERÍA + VIDEO */}
      <section className="bg-white py-14 md:py-20" id="gallery">
        <div className="max-w-mi mx-auto px-5">
          <h2 className="text-2xl md:text-[34px] font-semibold text-ink text-center tracking-tight">
            Así se ve en tu carro
          </h2>
          <p className="text-sm text-muted text-center mt-3">
            Fotografías oficiales del producto
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            <img
              src={HERO_IMAGE}
              alt="Cargador montado en la rejilla de ventilación"
              className="w-full h-72 md:h-[420px] object-cover rounded-2xl bg-paper"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="relative rounded-2xl overflow-hidden h-72 md:h-[420px] bg-ink group">
              {videoPlaying ? (
                <div className="absolute inset-0 flex justify-center items-center text-white bg-ink">
                  <div className="text-center p-6">
                    <Smartphone className="w-10 h-10 text-mi animate-pulse mx-auto mb-3" />
                    <p className="font-semibold text-lg">Sensor automático activado</p>
                    <p className="text-xs text-white/60 mt-1">
                      Carga del 0 al 45% en 30 minutos de trayecto.
                    </p>
                    <button
                      onClick={() => setVideoPlaying(false)}
                      className="mt-5 text-xs font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/20 transition-colors cursor-pointer"
                      id="close-video-btn"
                    >
                      Detener demostración
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={SENSOR_IMAGE}
                    alt="Demostración del mecanismo de sujeción automática"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 duration-700 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className="absolute inset-0 m-auto z-10 w-16 h-16 rounded-full bg-white text-ink flex items-center justify-center shadow-lg hover:scale-105 duration-200 transition-transform cursor-pointer"
                    aria-label="Reproducir demostración"
                    id="play-video-btn"
                  >
                    <Play className="w-6 h-6 fill-ink ml-0.5" />
                  </button>
                  <p className="absolute bottom-4 left-4 right-4 z-10 text-white text-xs font-medium bg-black/50 backdrop-blur-sm px-4 py-2.5 rounded-lg text-left">
                    Demostración: apertura automática por sensor infrarrojo
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
            Especificaciones
          </h2>

          <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl px-6 md:px-10 py-4">
            {[
              { group: "Carga", rows: [
                ["Salida inalámbrica", "Hasta 20W (certificación Qi)"],
                ["Entrada", "5V–20V · 1.35A máx."],
                ["Puerto", "USB Tipo-C"],
              ]},
              { group: "Diseño", rows: [
                ["Compatibilidad", "Teléfonos de hasta 81.5 mm de ancho"],
                ["Instalación", "Rejilla de ventilación o soporte de tablero"],
                ["Refrigeración", "Ventilador activo + disipador metálico"],
              ]},
              { group: "Mecanismo", rows: [
                ["Apertura", "Automática por sensor infrarrojo (≤ 8 cm)"],
                ["Liberación", "Toque en el sensor lateral"],
                ["Panel frontal", "Cristal curvo 2.5D"],
              ]},
            ].map(({ group, rows }) => (
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
            Lo que dicen nuestros clientes
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex gap-0.5" role="img" aria-label="Calificación: 5 de 5 estrellas">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-mi text-mi" aria-hidden="true" />
              ))}
            </div>
            <span className="text-sm text-muted">Compradores verificados en Colombia</span>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {[
              {
                initials: "CM", name: "Carlos M. Restrepo", city: "Bogotá",
                text: "Increíble la rapidez de la carga inalámbrica. El sistema de apertura automático funciona a la perfección, súper útil cuando conduzco haciendo entregas por la ciudad.",
              },
              {
                initials: "AG", name: "Andrea Gómez", city: "Medellín",
                text: "El mejor cargador de carro que he instalado. Se ajusta firme en la rejilla y el celular no se mueve para nada, incluso al pasar por huecos. Recomendado al 100%.",
              },
              {
                initials: "JP", name: "Juan Pablo Orrego", city: "Cali",
                text: "Me llegó al día siguiente. La calidad de los materiales se nota premium y el ventilador evita que el celular se caliente mientras uso el GPS.",
              },
            ].map(({ initials, name, city, text }) => (
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
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink text-xs">{name}</h4>
                    <p className="text-[11px] text-muted mt-0.5">Comprador verificado · {city}</p>
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
            <p className="text-[13px] font-medium text-mi-text">
              Oferta de lanzamiento
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-ink tracking-tight">
              Mi 20W Wireless Car Charger
            </h2>
            <div className="mt-4 flex items-baseline justify-center gap-3">
              <span className="text-3xl font-semibold text-mi-dark">{formatCOP(PRICE)}</span>
              <span className="text-base text-faint line-through">{formatCOP(ORIGINAL_PRICE)}</span>
            </div>
            <p className="mt-2 text-xs text-muted">
              Envío gratis a todo Colombia · Empaque sellado oficial · Garantía de 12 meses
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenCheckout}
                className="w-full sm:w-auto bg-mi hover:bg-mi-dark text-white h-12 px-10 rounded-lg font-medium text-[15px] transition-colors cursor-pointer"
                id="cta-bottom-buy-btn"
              >
                Comprar ahora
              </button>
              <a
                href="https://wa.me/573000000000?text=Hola%2C%20quiero%20asesor%C3%ADa%20sobre%20el%20Mi%2020W%20Wireless%20Car%20Charger%20de%20Xiaomi.%20%C2%BFTienen%20disponibilidad%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg font-medium text-[15px] text-body border border-[#b0b0b0] hover:border-ink hover:text-ink transition-colors"
                id="wa-bottom-btn"
              >
                <MessageCircle className="w-4 h-4" />
                Hablar con un asesor
              </a>
            </div>
            <p className="mt-5 text-[11px] text-muted flex items-center justify-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              Paga con PSE, Nequi, tarjetas de crédito/débito o contra entrega
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
