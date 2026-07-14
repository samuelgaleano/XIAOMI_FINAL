// Formato de moneda único para todo el funnel, estilo mi.com/co: "$ 169.900"
export const formatCOP = (value: number): string => `$ ${value.toLocaleString("es-CO")}`;
