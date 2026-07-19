// Datos del producto compartidos por la vista de detalle (catálogo) y el resto del sitio.
// Para añadir más fotos al carrusel, agrega entradas a GALLERY con su propia URL.

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDb4tCIFKq4rJ1NAc4KY3AWQupIYxvPvzbo2ou8Qs9SISyT_OpBQR_dV0Bxu6VOXnbXmVKNuKlTHWIt97tzsiI0FdGKiUA7nrOioGZ5D0QsIDBnt4Sta1EkXrXylIDfOtgsaRl5RRbiBO1WnueWMi3okedfpcpVxUuBclVXr0j72KU939Mvv8FcE4gMfIXKkTgVAfS0F1n7T0xFRyYRChGGK4Y4cIRqoe_H-QRYojjGXJlhpAfvP49lr8rEui2QpnfepFcGBNTiGD8q";
const SENSOR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDg0HLk0eGSwLD-wc4mZm10E3USrVDH3KyEAImvUPvG9wvf6iUfrdsZbtMl_rf4c9X0rBBD2tunap6miExDRDrBjgdaXODEgZXRtjtHkDzDoy3f0OjUHfmJivQLQrwjdVnBHha9R97loxnUnNGS3MfLjRCYWcrndS2_Zjx22ft3HovIQXMOulgApcV-i-DGq3lUWNFIG-yF3mwcVGf_FYOoQNOalPXeNZ8D1_DiWfqSZ9HY74OY5BWPNbFYop9ex1Jp4E0Ymo_FdbLp";

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface SpecGroup {
  group: string;
  rows: [string, string][];
}

export const PRODUCT = {
  id: "MI-20W-CAR-CHARGER",
  name: "Mi 20W Wireless Car Charger",
  brand: "Xiaomi CarTech",
  price: 169900,
  originalPrice: 219900,
  rating: 4.9,
  reviewCount: 128,
  tagline: "Carga inalámbrica de 20W con sensor infrarrojo y sujeción automática.",
  highlights: [
    "Carga inalámbrica súper rápida de hasta 20W",
    "Apertura y cierre automático por sensor infrarrojo",
    "Doble refrigeración: ventilador interno + disipador metálico",
    "Compatible con celulares Qi (Xiaomi, Apple, Samsung, Huawei)",
  ] as string[],
  maxQuantity: 5,
};

export const GALLERY: GalleryImage[] = [
  { src: HERO_IMAGE, alt: "Mi 20W Wireless Car Charger montado en la rejilla de ventilación", caption: "Montaje en la rejilla de ventilación" },
  { src: SENSOR_IMAGE, alt: "Sensor infrarrojo de sujeción automática del cargador", caption: "Sensor infrarrojo de sujeción automática" },
  { src: HERO_IMAGE, alt: "Vista frontal del cargador con cristal curvo 2.5D", caption: "Cristal curvo 2.5D en el frente" },
  { src: SENSOR_IMAGE, alt: "Puerto USB-C y disipador metálico trasero", caption: "Puerto USB-C y disipador trasero" },
];

export const SPECS: SpecGroup[] = [
  {
    group: "Carga",
    rows: [
      ["Salida inalámbrica", "Hasta 20W (certificación Qi)"],
      ["Entrada", "5V–20V · 1.35A máx."],
      ["Puerto", "USB Tipo-C"],
    ],
  },
  {
    group: "Diseño",
    rows: [
      ["Compatibilidad", "Teléfonos de hasta 81.5 mm de ancho"],
      ["Instalación", "Rejilla de ventilación o soporte de tablero"],
      ["Refrigeración", "Ventilador activo + disipador metálico"],
    ],
  },
  {
    group: "Mecanismo",
    rows: [
      ["Apertura", "Automática por sensor infrarrojo (≤ 8 cm)"],
      ["Liberación", "Toque en el sensor lateral"],
      ["Panel frontal", "Cristal curvo 2.5D"],
    ],
  },
];
