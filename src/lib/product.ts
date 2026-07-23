// Datos del producto. Los valores neutrales (precio, imágenes, rating) viven en PRODUCT;
// la copia traducible (nombre, highlights, leyendas, especificaciones) en COPY por idioma.
// Para añadir más fotos, agrega la URL a PRODUCT.images y una leyenda en cada idioma.

export type Lang = "es" | "en";

// Imágenes oficiales del producto, autohospedadas en /public.
export const IMG_FRONT = "/product-front.png"; // packshot frontal limpio
export const IMG_CAR = "/product-car.jpg";     // montado en la rejilla (beauty)
export const IMG_HAND = "/product-hand.jpg";   // colocando el teléfono (sujeción automática)

export const PRODUCT = {
  id: "MI-20W-CAR-CHARGER",
  model: "WCJ02ZM",
  price: 169900,
  originalPrice: 219900,
  rating: 4.9,
  reviewCount: 128,
  maxQuantity: 5,
  // Para más ángulos, añade la URL aquí y una leyenda en cada idioma (captions).
  images: [IMG_FRONT, IMG_CAR, IMG_HAND],
};

export interface SpecGroup {
  group: string;
  rows: [string, string][];
}

export interface ProductCopy {
  name: string;
  brand: string;
  tagline: string;
  highlights: string[];
  captions: string[];
  specs: SpecGroup[];
}

const COPY: Record<Lang, ProductCopy> = {
  es: {
    name: "Mi 20W Wireless Car Charger",
    brand: "Xiaomi CarTech",
    tagline: "Carga inalámbrica de 20W con sensor infrarrojo y sujeción automática.",
    highlights: [
      "Carga inalámbrica súper rápida de hasta 20W",
      "Apertura y cierre automático por sensor infrarrojo",
      "Doble refrigeración: ventilador interno + disipador metálico",
      "Compatible con celulares Qi (Xiaomi, Apple, Samsung, Huawei)",
    ],
    captions: [
      "Vista frontal con cristal curvo 2.5D",
      "Montaje en la rejilla de ventilación",
      "Sujeción automática con una sola mano",
    ],
    specs: [
      { group: "General", rows: [
        ["Modelo", "WCJ02ZM"],
        ["Dimensiones", "117.2 × 73.4 × 91.7 mm"],
        ["Material", "Policarbonato + cristal"],
      ]},
      { group: "Carga", rows: [
        ["Salida inalámbrica", "Hasta 20W (certificación Qi)"],
        ["Entrada", "5V/3A · 9V/2A · 12V/2A · 20V/1.35A"],
        ["Puerto", "USB Tipo-C"],
      ]},
      { group: "Diseño", rows: [
        ["Compatibilidad", "Teléfonos de hasta 81.5 mm de ancho"],
        ["Instalación", "Rejilla de ventilación o tablero"],
        ["Refrigeración", "Ventilador activo + disipador metálico"],
      ]},
      { group: "Mecanismo", rows: [
        ["Apertura", "Automática por sensor infrarrojo (≤ 8 cm)"],
        ["Liberación", "Toque en el sensor lateral"],
        ["Panel frontal", "Cristal curvo 2.5D"],
      ]},
    ],
  },
  en: {
    name: "Mi 20W Wireless Car Charger",
    brand: "Xiaomi CarTech",
    tagline: "20W wireless charging with an automatic infrared grip.",
    highlights: [
      "Super-fast wireless charging up to 20W",
      "Automatic open and close via infrared sensor",
      "Dual cooling: internal fan + metal heatsink",
      "Works with Qi phones (Xiaomi, Apple, Samsung, Huawei)",
    ],
    captions: [
      "2.5D curved glass front view",
      "Mounted on the air vent",
      "Automatic one-handed grip",
    ],
    specs: [
      { group: "General", rows: [
        ["Model", "WCJ02ZM"],
        ["Dimensions", "117.2 × 73.4 × 91.7 mm"],
        ["Material", "Polycarbonate + glass"],
      ]},
      { group: "Charging", rows: [
        ["Wireless output", "Up to 20W (Qi certified)"],
        ["Input", "5V/3A · 9V/2A · 12V/2A · 20V/1.35A"],
        ["Port", "USB Type-C"],
      ]},
      { group: "Design", rows: [
        ["Compatibility", "Phones up to 81.5 mm wide"],
        ["Mounting", "Air vent or dashboard"],
        ["Cooling", "Active fan + metal heatsink"],
      ]},
      { group: "Mechanism", rows: [
        ["Opening", "Automatic infrared sensor (≤ 8 cm)"],
        ["Release", "Tap the side sensor"],
        ["Front panel", "2.5D curved glass"],
      ]},
    ],
  },
};

export const getProductCopy = (lang: Lang): ProductCopy => COPY[lang];
