import React from "react";
import type { Lang } from "./product";

/* Diccionario de textos del storefront (ES/EN). El panel de administración
   queda en español por ser una herramienta interna. */
const STR = {
  es: {
    common: { buyNow: "Comprar ahora", addToCart: "Agregar al carrito", viewProduct: "Ver producto", free: "Gratis", quantity: "Cantidad", total: "Total" },
    nav: {
      partner: "Distribuidor autorizado independiente de Xiaomi en Colombia",
      support: "Soporte por WhatsApp",
      region: "Colombia (Español)",
      product: "Producto",
      features: "Características",
      specs: "Especificaciones",
      reviews: "Reseñas",
      viewCart: "Ver carrito",
      viewCartN: (n: number) => `Ver carrito (${n})`,
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      langLabel: "EN",
      langAria: "Cambiar idioma a inglés",
    },
    hero: {
      eyebrow: "Xiaomi · Distribuidor autorizado en Colombia",
      claims: ["Carga inalámbrica de 20W", "Sensor infrarrojo automático", "Refrigeración activa"],
      save: (v: string) => `Ahorras ${v}`,
      note: "Envío gratis a todo el país · Paga con PSE, Nequi, tarjetas o contra entrega",
      galleryHint: "Ver galería y detalles →",
    },
    services: [
      { title: "Envío gratis", sub: "Entrega en 2 a 5 días hábiles" },
      { title: "Devoluciones", sub: "14 días sin costo" },
      { title: "Garantía oficial", sub: "12 meses Xiaomi" },
      { title: "Pagos 100% seguros", sub: "Wompi · PSE · Nequi" },
    ],
    features: {
      heading: "Diseñado para tu día a día al volante",
      sub: "Tecnología de carga certificada Qi con la calidad de fabricación de Xiaomi.",
      cards: [
        { stat: "20W", title: "Carga súper rápida", sub: "Del 0% al 45% en 30 minutos de conducción en dispositivos compatibles." },
        { stat: "8 cm", title: "Sensor infrarrojo", sub: "Los brazos se abren solos al acercar el teléfono y lo sujetan firmemente." },
        { stat: "2×", title: "Doble disipación", sub: "Ventilador silencioso y disipador trasero que protegen la batería." },
      ],
    },
    sensor: {
      eyebrow: "Sujeción automática",
      heading: "Acércalo y se abre. Tócalo y se libera.",
      p1: "El sensor infrarrojo oculto detecta tu teléfono a menos de 8 cm: los brazos motorizados se abren suavemente y se cierran firmes en un instante, sin que apartes la vista del camino.",
      p2: "Para retirarlo, un toque en el sensor lateral activa el sistema de liberación y tu teléfono queda libre al instante. Todo con una sola mano.",
      f1t: "Operación con una mano", f1s: "Coloca y retira el teléfono en un segundo.",
      f2t: "Cristal curvo 2.5D", f2s: "Panel de vidrio premium con mejor disipación térmica.",
    },
    power: {
      eyebrow: "Potencia certificada Qi",
      heading: "Carga inalámbrica de hasta",
      p: "Recupera hasta un 45% de batería en 30 minutos de trayecto. El doble mecanismo de protección térmica —ventilador extractor interno y disipador metálico trasero— balancea la potencia según la temperatura para cuidar tu batería a largo plazo.",
      note: "Compatible con todos los teléfonos con certificación Qi: Xiaomi, Apple, Samsung, Huawei y más.",
      link: "Comprar con garantía original →",
    },
    gallery: {
      heading: "Así se ve en tu carro",
      sub: "Fotografías oficiales del producto",
      play: "Reproducir demostración",
      demoTitle: "Sensor automático activado",
      demoSub: "Carga del 0 al 45% en 30 minutos de trayecto.",
      demoStop: "Detener demostración",
      demoCaption: "Demostración: apertura automática por sensor infrarrojo",
    },
    specsHeading: "Especificaciones",
    reviews: {
      heading: "Lo que dicen nuestros clientes",
      sub: "Compradores verificados en Colombia",
      verified: (city: string) => `Comprador verificado · ${city}`,
      items: [
        { text: "Increíble la rapidez de la carga inalámbrica. El sistema de apertura automático funciona a la perfección, súper útil cuando conduzco haciendo entregas por la ciudad.", name: "Carlos M. Restrepo", city: "Bogotá" },
        { text: "El mejor cargador de carro que he instalado. Se ajusta firme en la rejilla y el celular no se mueve para nada, incluso al pasar por huecos. Recomendado al 100%.", name: "Andrea Gómez", city: "Medellín" },
        { text: "Me llegó al día siguiente. La calidad de los materiales se nota premium y el ventilador evita que el celular se caliente mientras uso el GPS.", name: "Juan Pablo Orrego", city: "Cali" },
      ],
    },
    ctaFinal: {
      eyebrow: "Oferta de lanzamiento",
      note: "Envío gratis a todo Colombia · Empaque sellado oficial · Garantía de 12 meses",
      advisor: "Hablar con un asesor",
      pay: "Paga con PSE, Nequi, tarjetas de crédito/débito o contra entrega",
    },
    ratingLabel: (r: number) => `Calificación ${r} de 5`,
    footer: {
      blurb: "Distribuidor autorizado independiente del Mi 20W Wireless Car Charger en Colombia. Producto original, empaque sellado de fábrica y garantía oficial.",
      product: "Producto",
      support: "Soporte",
      waLive: "WhatsApp en vivo",
      warranty12: "Garantía oficial de 12 meses",
      shipping25: "Envíos a todo el país en 2–5 días",
      payMethods: "Medios de pago",
      legal: "Legal",
      privacy: "Política de privacidad",
      terms: "Términos y condiciones",
      dataRemoval: "Eliminación de datos",
      rights: "© 2026 Xiaomi CarTech Colombia (xiaomicartech.com.co) · Importador independiente. Xiaomi y Mi son marcas registradas de Xiaomi Inc.",
      region: "Colombia (Español)",
    },
    detail: {
      home: "Inicio", store: "Tienda",
      reviewsN: (r: number, n: number) => `${r} · ${n} reseñas verificadas`,
      taxIncl: "Impuestos incluidos · Envío gratis a todo Colombia",
      decrease: "Disminuir cantidad", increase: "Aumentar cantidad",
      totalX: (v: string) => `Total: ${v}`,
      trust: [
        { title: "Envío gratis", sub: "2 a 5 días hábiles" },
        { title: "Garantía oficial", sub: "12 meses Xiaomi" },
        { title: "Devoluciones", sub: "14 días sin costo" },
      ],
      askAdvisor: "¿Tienes dudas? Habla con un asesor",
      prev: "Imagen anterior", next: "Imagen siguiente",
      thumb: (i: number) => `Ver imagen ${i}`,
    },
    checkout: {
      securePay: "Pago seguro", home: "Inicio", finish: "Finalizar compra",
      contact: "Contacto", email: "Correo electrónico",
      marketing: "Enviarme novedades y ofertas por correo electrónico",
      delivery: "Entrega", department: "Departamento",
      name: "Nombre", lastName: "Apellidos", idNum: "Cédula", address: "Dirección",
      addressExtra: "Casa, apartamento, etc. (opcional)", city: "Ciudad", zip: "Código postal (opcional)", phone: "Teléfono",
      shipMethod: "Método de envío", shipNational: "Envío nacional (2–5 días hábiles)",
      payment: "Pago", paymentNote: "Todas las transacciones son seguras y están encriptadas.",
      wompi: "Tarjetas, Nequi y más (Wompi)", wompiNote: "Se te redirigirá a Wompi para completar el pago.",
      pse: "Débito bancario PSE o crédito Addi",
      cod: "Pago contra entrega", codNote: "Pagas en efectivo o transferencia al recibir el producto.",
      paymentGroup: "Método de pago",
      billing: "Dirección de facturación", billingSame: "La misma dirección de envío", billingOther: "Usar una dirección de facturación distinta",
      payNow: "Pagar ahora", processing: "Procesando…",
      showSummary: "Mostrar resumen del pedido", hideSummary: "Ocultar resumen del pedido",
      qtyLabel: "Cantidad:", discountCode: "Código de descuento", apply: "Aplicar",
      listPrice: (n: number) => `Precio de lista (${n} ${n === 1 ? "artículo" : "artículos"})`,
      launchDiscount: "Descuento de lanzamiento", shipping: "Envío",
      trust: ["Pago 100% seguro y encriptado", "Envío gratis a todo Colombia", "Garantía oficial Xiaomi de 12 meses"],
      errGeneric: "Error al procesar el pago",
      errNotApproved: "El pago no se completó. Puedes intentarlo de nuevo o elegir otro método.",
      errWompiUnavailable: "El pago en línea no está disponible ahora mismo. Intenta de nuevo o usa pago contra entrega.",
      inStock: "En stock · Envío en 2 a 5 días hábiles",
    },
    success: {
      title: "¡Gracias por tu compra!",
      sub: "Guardamos los detalles de tu orden. Tu despacho se procesará de forma prioritaria en cuanto se valide el pago.",
      orderNo: "Número de pedido", payMethod: "Método de pago", total: "Total",
      shipStatus: "Estado del despacho", pending: "Pendiente · validando pago",
      deliveryData: "Datos de entrega", addressL: "Dirección", emailL: "Correo", recipientL: "Destinatario",
      emailTitle: "Confirmación por correo",
      emailSent: (e: string) => `Enviamos el resumen detallado de tu orden a ${e}. Revisa tu bandeja de entrada (y la carpeta de spam por si acaso).`,
      emailNot: "La orden quedó registrada en nuestro sistema. Recibirás la confirmación de despacho por WhatsApp o correo.",
      backedTitle: "Compra respaldada",
      waHeading: "Confirma tu pedido por WhatsApp",
      waText: "Acelera tu despacho: envíanos el resumen de tu pedido y un asesor confirmará el envío en tiempo real.",
      waBtn: "Enviar resumen por WhatsApp",
      waNote: "Envíos inmediatos en Bogotá, Medellín y Cali.",
      back: "Volver a la tienda",
      waMsg: (o: { id: string; name: string; addr: string; city: string; phone: string; method: string; total: string }) =>
        `Hola Xiaomi CarTech! Acabo de completar el pedido para mi Mi 20W Wireless Car Charger 🚗⚡ en xiaomicartech.com.co.\n*ID de Orden:* #${o.id}\n*Cliente:* ${o.name}\n*Dirección:* ${o.addr}, ${o.city}\n*Teléfono:* ${o.phone}\n*Método de Pago:* ${o.method}\n*Total:* ${o.total} COP\n\nPor favor me confirman disponibilidad de envío inmediato!`,
    },
    toast: {
      added: (n: number) => `Añadido al carrito · ${n} ${n === 1 ? "unidad" : "unidades"}`,
      viewCart: "Ver carrito",
    },
    wa: {
      support: "Hola, necesito asistencia con mi pedido.",
      orderHelp: "Hola, necesito asistencia respecto a mi pedido.",
      advisor: "Hola, quiero asesoría sobre el Mi 20W Wireless Car Charger de Xiaomi. ¿Tienen disponibilidad?",
      advisorShort: "Hola, quiero asesoría sobre el Mi 20W Wireless Car Charger.",
    },
  },

  en: {
    common: { buyNow: "Buy now", addToCart: "Add to cart", viewProduct: "View product", free: "Free", quantity: "Quantity", total: "Total" },
    nav: {
      partner: "Independent authorized Xiaomi distributor in Colombia",
      support: "WhatsApp support",
      region: "Colombia (English)",
      product: "Product",
      features: "Features",
      specs: "Specs",
      reviews: "Reviews",
      viewCart: "View cart",
      viewCartN: (n: number) => `View cart (${n})`,
      openMenu: "Open menu",
      closeMenu: "Close menu",
      langLabel: "ES",
      langAria: "Switch language to Spanish",
    },
    hero: {
      eyebrow: "Xiaomi · Authorized distributor in Colombia",
      claims: ["20W wireless charging", "Automatic infrared sensor", "Active cooling"],
      save: (v: string) => `You save ${v}`,
      note: "Free nationwide shipping · Pay with PSE, Nequi, cards or cash on delivery",
      galleryHint: "View gallery and details →",
    },
    services: [
      { title: "Free shipping", sub: "Delivery in 2 to 5 business days" },
      { title: "Returns", sub: "14 days at no cost" },
      { title: "Official warranty", sub: "12 months Xiaomi" },
      { title: "100% secure payments", sub: "Wompi · PSE · Nequi" },
    ],
    features: {
      heading: "Built for your everyday drive",
      sub: "Qi-certified charging technology with Xiaomi build quality.",
      cards: [
        { stat: "20W", title: "Super-fast charging", sub: "From 0% to 45% in 30 minutes of driving on compatible devices." },
        { stat: "8 cm", title: "Infrared sensor", sub: "The arms open on their own as you bring the phone close and grip it firmly." },
        { stat: "2×", title: "Dual cooling", sub: "A quiet fan and rear heatsink protect your battery." },
      ],
    },
    sensor: {
      eyebrow: "Automatic grip",
      heading: "Bring it close and it opens. Tap it and it releases.",
      p1: "The hidden infrared sensor detects your phone within 8 cm: the motorized arms open smoothly and close firmly in an instant, without taking your eyes off the road.",
      p2: "To remove it, a tap on the side sensor triggers the release and your phone is free instantly. All with one hand.",
      f1t: "One-handed operation", f1s: "Place and remove your phone in a second.",
      f2t: "2.5D curved glass", f2s: "Premium glass panel with better heat dissipation.",
    },
    power: {
      eyebrow: "Qi-certified power",
      heading: "Wireless charging up to",
      p: "Get back up to 45% of battery in 30 minutes of driving. The dual thermal-protection system —internal extractor fan and rear metal heatsink— balances power based on temperature to protect your battery over time.",
      note: "Works with every Qi-certified phone: Xiaomi, Apple, Samsung, Huawei and more.",
      link: "Buy with original warranty →",
    },
    gallery: {
      heading: "Here's how it looks in your car",
      sub: "Official product photos",
      play: "Play demo",
      demoTitle: "Automatic sensor activated",
      demoSub: "Charge from 0 to 45% in 30 minutes of driving.",
      demoStop: "Stop demo",
      demoCaption: "Demo: automatic opening by infrared sensor",
    },
    specsHeading: "Specifications",
    reviews: {
      heading: "What our customers say",
      sub: "Verified buyers in Colombia",
      verified: (city: string) => `Verified buyer · ${city}`,
      items: [
        { text: "The wireless charging speed is incredible. The automatic opening works perfectly, super handy when I'm driving deliveries around the city.", name: "Carlos M. Restrepo", city: "Bogotá" },
        { text: "The best car charger I've installed. It grips firmly on the vent and the phone doesn't move at all, even over potholes. 100% recommended.", name: "Andrea Gómez", city: "Medellín" },
        { text: "It arrived the next day. The materials feel premium and the fan keeps the phone from heating up while I use GPS.", name: "Juan Pablo Orrego", city: "Cali" },
      ],
    },
    ctaFinal: {
      eyebrow: "Launch offer",
      note: "Free shipping across Colombia · Official sealed packaging · 12-month warranty",
      advisor: "Chat with an advisor",
      pay: "Pay with PSE, Nequi, credit/debit cards or cash on delivery",
    },
    ratingLabel: (r: number) => `Rating ${r} of 5`,
    footer: {
      blurb: "Independent authorized distributor of the Mi 20W Wireless Car Charger in Colombia. Original product, factory-sealed packaging and official warranty.",
      product: "Product",
      support: "Support",
      waLive: "Live WhatsApp",
      warranty12: "12-month official warranty",
      shipping25: "Nationwide shipping in 2–5 days",
      payMethods: "Payment methods",
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms and conditions",
      dataRemoval: "Data removal",
      rights: "© 2026 Xiaomi CarTech Colombia (xiaomicartech.com.co) · Independent importer. Xiaomi and Mi are registered trademarks of Xiaomi Inc.",
      region: "Colombia (English)",
    },
    detail: {
      home: "Home", store: "Store",
      reviewsN: (r: number, n: number) => `${r} · ${n} verified reviews`,
      taxIncl: "Taxes included · Free shipping across Colombia",
      decrease: "Decrease quantity", increase: "Increase quantity",
      totalX: (v: string) => `Total: ${v}`,
      trust: [
        { title: "Free shipping", sub: "2 to 5 business days" },
        { title: "Official warranty", sub: "12 months Xiaomi" },
        { title: "Returns", sub: "14 days at no cost" },
      ],
      askAdvisor: "Questions? Chat with an advisor",
      prev: "Previous image", next: "Next image",
      thumb: (i: number) => `View image ${i}`,
    },
    checkout: {
      securePay: "Secure payment", home: "Home", finish: "Checkout",
      contact: "Contact", email: "Email",
      marketing: "Email me news and offers",
      delivery: "Delivery", department: "Department",
      name: "First name", lastName: "Last name", idNum: "ID number", address: "Address",
      addressExtra: "Apt, suite, etc. (optional)", city: "City", zip: "Postal code (optional)", phone: "Phone",
      shipMethod: "Shipping method", shipNational: "Nationwide shipping (2–5 business days)",
      payment: "Payment", paymentNote: "All transactions are secure and encrypted.",
      wompi: "Cards, Nequi and more (Wompi)", wompiNote: "You'll be redirected to Wompi to complete the payment.",
      pse: "PSE bank debit or Addi credit",
      cod: "Cash on delivery", codNote: "Pay in cash or by transfer when you receive the product.",
      paymentGroup: "Payment method",
      billing: "Billing address", billingSame: "Same as shipping address", billingOther: "Use a different billing address",
      payNow: "Pay now", processing: "Processing…",
      showSummary: "Show order summary", hideSummary: "Hide order summary",
      qtyLabel: "Qty:", discountCode: "Discount code", apply: "Apply",
      listPrice: (n: number) => `List price (${n} ${n === 1 ? "item" : "items"})`,
      launchDiscount: "Launch discount", shipping: "Shipping",
      trust: ["100% secure and encrypted payment", "Free shipping across Colombia", "Official Xiaomi 12-month warranty"],
      errGeneric: "There was an error processing the payment",
      errNotApproved: "The payment wasn't completed. You can try again or choose another method.",
      errWompiUnavailable: "Online payment isn't available right now. Try again or use cash on delivery.",
      inStock: "In stock · Ships in 2 to 5 business days",
    },
    success: {
      title: "Thank you for your purchase!",
      sub: "We saved your order details. Your shipment will be processed as a priority as soon as the payment is validated.",
      orderNo: "Order number", payMethod: "Payment method", total: "Total",
      shipStatus: "Shipment status", pending: "Pending · validating payment",
      deliveryData: "Delivery details", addressL: "Address", emailL: "Email", recipientL: "Recipient",
      emailTitle: "Email confirmation",
      emailSent: (e: string) => `We sent the detailed summary of your order to ${e}. Check your inbox (and the spam folder just in case).`,
      emailNot: "Your order was recorded in our system. You'll get the shipping confirmation by WhatsApp or email.",
      backedTitle: "Backed purchase",
      waHeading: "Confirm your order on WhatsApp",
      waText: "Speed up your shipment: send us your order summary and an advisor will confirm shipping in real time.",
      waBtn: "Send summary on WhatsApp",
      waNote: "Immediate shipping in Bogotá, Medellín and Cali.",
      back: "Back to store",
      waMsg: (o: { id: string; name: string; addr: string; city: string; phone: string; method: string; total: string }) =>
        `Hi Xiaomi CarTech! I just completed the order for my Mi 20W Wireless Car Charger 🚗⚡ at xiaomicartech.com.co.\n*Order ID:* #${o.id}\n*Customer:* ${o.name}\n*Address:* ${o.addr}, ${o.city}\n*Phone:* ${o.phone}\n*Payment method:* ${o.method}\n*Total:* ${o.total} COP\n\nPlease confirm immediate shipping availability!`,
    },
    toast: {
      added: (n: number) => `Added to cart · ${n} ${n === 1 ? "unit" : "units"}`,
      viewCart: "View cart",
    },
    wa: {
      support: "Hi, I need help with my order.",
      orderHelp: "Hi, I need help regarding my order.",
      advisor: "Hi, I'd like advice about the Xiaomi Mi 20W Wireless Car Charger. Do you have it in stock?",
      advisorShort: "Hi, I'd like advice about the Mi 20W Wireless Car Charger.",
    },
  },
};

export type Strings = (typeof STR)["es"];

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  s: Strings;
}

const I18nContext = React.createContext<I18nValue | null>(null);

const STORAGE_KEY = "xct-lang";

const readInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en") return saved;
  } catch { /* ignore */ }
  return "es";
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>(readInitialLang);

  React.useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
  }, [lang]);

  const setLang = React.useCallback((l: Lang) => setLangState(l), []);
  const toggle = React.useCallback(() => setLangState((l) => (l === "es" ? "en" : "es")), []);

  const value = React.useMemo<I18nValue>(() => ({ lang, setLang, toggle, s: STR[lang] }), [lang, setLang, toggle]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
