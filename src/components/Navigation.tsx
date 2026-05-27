import React from "react";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Navigation({ currentTab, setCurrentTab, onOpenCheckout, adminLoggedIn }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <button 
          onClick={() => setCurrentTab("home")}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div className="bg-[#ff6900] rounded-lg p-2 w-10 h-10 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">Mi</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-gray-900">Xiaomi</p>
            <p className="text-xs text-[#ff6900] font-semibold">CarTech</p>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => setCurrentTab("home")} className="text-gray-700 hover:text-[#ff6900] font-medium text-sm">
            Características
          </button>
          <button onClick={() => setCurrentTab("home")} className="text-gray-700 hover:text-[#ff6900] font-medium text-sm">
            Especificaciones
          </button>
          <button onClick={() => setCurrentTab("home")} className="text-gray-700 hover:text-[#ff6900] font-medium text-sm">
            Reseñas
          </button>
          {adminLoggedIn && (
            <button onClick={() => setCurrentTab("admin")} className="text-gray-700 hover:text-[#ff6900] font-medium text-sm">
              Admin
            </button>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onOpenCheckout}
          className="hidden sm:inline-flex items-center gap-2 bg-[#ff6900] hover:bg-[#e55f00] text-white px-4 py-2 rounded-full font-semibold text-sm transition"
        >
          <ShoppingCart className="w-4 h-4" />
          COMPRAR AHORA
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => setCurrentTab("home")} className="block w-full text-left text-gray-700 hover:text-[#ff6900] py-2 font-medium">
              Características
            </button>
            <button onClick={() => setCurrentTab("home")} className="block w-full text-left text-gray-700 hover:text-[#ff6900] py-2 font-medium">
              Especificaciones
            </button>
            <button onClick={() => setCurrentTab("home")} className="block w-full text-left text-gray-700 hover:text-[#ff6900] py-2 font-medium">
              Reseñas
            </button>
            <button
              onClick={() => { onOpenCheckout(); setMobileMenuOpen(false); }}
              className="w-full bg-[#ff6900] text-white py-2 rounded-lg font-semibold mt-3"
            >
              COMPRAR AHORA
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
