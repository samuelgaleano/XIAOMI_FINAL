import React from "react";
import { ShoppingCart, Menu, X, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { label: "Características", href: "#features" },
  { label: "Especificaciones", href: "#specs" },
  { label: "Reseñas", href: "#reviews" },
];

export default function Navigation({ setCurrentTab, onOpenProduct, onOpenCart, cartCount = 0 }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const goHome = () => {
    setCurrentTab("home");
    setMobileMenuOpen(false);
  };

  const openProduct = () => {
    onOpenProduct();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white">
      {/* Barra superior de utilidades, estilo mi.com */}
      <div className="hidden md:block bg-[#fafafa] border-b border-line">
        <div className="max-w-mi mx-auto px-5 h-9 flex items-center justify-between text-xs text-muted">
          <p className="font-medium">
            Distribuidor autorizado independiente de Xiaomi en Colombia
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://wa.me/573148145417?text=Hola%2C%20necesito%20asistencia%20con%20mi%20pedido."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Soporte por WhatsApp
            </a>
            <span className="text-line">|</span>
            <span>Colombia (Español)</span>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="border-b border-line">
        <div className="max-w-mi mx-auto px-5 h-16 md:h-[72px] flex items-center justify-between gap-6">
          <button
            onClick={goHome}
            className="flex items-center shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Xiaomi CarTech — inicio"
          >
            <img
              src="/xiaomi-cartech-logo.png"
              alt="Xiaomi CarTech"
              className="h-14 md:h-16 w-auto"
            />
          </button>

          {/* Menú de escritorio */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={openProduct}
              className="text-sm text-body hover:text-mi font-medium transition-colors cursor-pointer"
            >
              Producto
            </button>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={goHome}
                className="text-sm text-body hover:text-mi font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {/* Carrito con contador */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center justify-center min-w-11 min-h-11 text-ink hover:text-mi transition-colors cursor-pointer"
              aria-label={cartCount > 0 ? `Ver carrito (${cartCount})` : "Ver carrito"}
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 bg-mi text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Botón de menú móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-ink min-w-11 min-h-11 flex items-center justify-center -mr-2"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-line bg-white">
          <div className="px-5 py-3">
            <button
              onClick={openProduct}
              className="block w-full text-left text-body hover:text-mi py-3 font-medium border-b border-line/60"
            >
              Producto
            </button>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={goHome}
                className="block text-body hover:text-mi py-3 font-medium border-b border-line/60 last:border-0"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={openProduct}
              className="w-full bg-mi hover:bg-mi-dark text-white h-11 rounded-lg font-medium mt-3 mb-2 transition-colors"
            >
              Ver producto
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
