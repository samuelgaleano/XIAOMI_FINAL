import React from "react";
import {
  CheckCircle,
  MessageCircle,
  Mail,
  MapPin,
  Copy,
  Check,
  ShoppingBag,
} from "lucide-react";
import { Order } from "../types";
import { formatCOP } from "../lib/format";

interface SuccessPageProps {
  order: Order;
  emailNotificationSent: boolean;
  onReset: () => void;
}

export default function SuccessPage({ order, emailNotificationSent, onReset }: SuccessPageProps) {
  const [copied, setCopied] = React.useState(false);

  const formattedTotal = formatCOP(order.amount);

  // Mensaje de respaldo por WhatsApp con formato colombiano
  const formattedWhatsappMsg = `Hola Xiaomi CarTech! Acabo de completar el pedido para mi Mi 20W Wireless Car Charger 🚗⚡ en xiaomicartech.com.co.
*ID de Orden:* #${order.id}
*Cliente:* ${order.customerName}
*Dirección:* ${order.customerAddress}, ${order.customerCity}
*Teléfono:* ${order.customerPhone}
*Método de Pago:* ${order.paymentMethod}
*Total:* ${formattedTotal} COP

Por favor me confirman disponibilidad de envío inmediato!`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-paper min-h-full py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-5 animate-fade-in-up">

        {/* Encabezado de confirmación */}
        <div className="text-center flex flex-col items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-white text-mi flex items-center justify-center">
            <CheckCircle className="w-9 h-9" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
              ¡Gracias por tu compra!
            </h2>
            <p className="text-muted text-sm mt-2 max-w-md mx-auto leading-relaxed">
              Guardamos los detalles de tu orden. Tu despacho se procesará de forma
              prioritaria en cuanto se valide el pago.
            </p>
          </div>
        </div>

        {/* Detalles + acción de WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

          {/* Resumen de la orden */}
          <div className="md:col-span-3 space-y-5 text-left">

            <div className="bg-white p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <span className="text-xs text-muted font-medium uppercase tracking-wider">Número de pedido</span>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 text-xs text-mi-text hover:text-mi-dark font-semibold cursor-pointer"
                  id="copy-order-id-btn"
                >
                  <span>#{order.id}</span>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-muted block">Método de pago</span>
                  <span className="text-sm font-semibold text-ink block mt-0.5">{order.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted block">Total</span>
                  <span className="text-sm font-semibold text-mi-text block mt-0.5">{formattedTotal} COP</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-muted block">Estado del despacho</span>
                  <span className="text-xs font-medium text-mi-text bg-mi-soft border border-mi/20 py-1 px-2.5 rounded inline-block mt-1">
                    Pendiente · validando pago
                  </span>
                </div>
              </div>
            </div>

            {/* Datos de entrega */}
            <div className="bg-white p-6 rounded-2xl text-left">
              <h4 className="font-semibold text-ink text-sm mb-4 border-b border-line pb-3">
                Datos de entrega
              </h4>
              <div className="space-y-3 text-sm text-body">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong className="text-ink font-medium">Dirección:</strong> {order.customerAddress}, {order.customerCity}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong className="text-ink font-medium">Correo:</strong> {order.customerEmail}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong className="text-ink font-medium">Destinatario:</strong> {order.customerName} ({order.customerPhone})
                  </p>
                </div>
              </div>
            </div>

            {/* Estado del correo de confirmación */}
            <div className="bg-white border border-line p-5 rounded-2xl flex items-start gap-3">
              <Mail className="w-5 h-5 text-mi shrink-0 mt-0.5" />
              <div className="text-xs text-body leading-relaxed">
                <h5 className="font-semibold text-ink mb-0.5">Confirmación por correo</h5>
                {emailNotificationSent ? (
                  <p>
                    Enviamos el resumen detallado de tu orden a <strong>{order.customerEmail}</strong>.
                    Revisa tu bandeja de entrada (y la carpeta de spam por si acaso).
                  </p>
                ) : (
                  <p>
                    La orden quedó registrada en nuestro sistema. Recibirás la confirmación
                    de despacho por WhatsApp o correo.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Acción de respaldo por WhatsApp */}
          <div className="md:col-span-2 text-left">
            <div className="bg-white p-6 rounded-2xl flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-semibold text-mi-text bg-mi-soft px-2 py-1 rounded inline-block">
                  Compra respaldada
                </span>
                <h4 className="text-lg font-semibold text-ink mt-3 leading-tight">
                  Confirma tu pedido por WhatsApp
                </h4>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Acelera tu despacho: envíanos el resumen de tu pedido y un asesor
                  confirmará el envío en tiempo real.
                </p>

                <div className="bg-paper rounded-xl p-4 mt-4 text-[11px] text-muted overflow-hidden line-clamp-4 leading-relaxed">
                  {formattedWhatsappMsg}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line">
                <a
                  href={`https://wa.me/573148145417?text=${encodeURIComponent(formattedWhatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm h-11 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  id="whatsapp-completion-btn"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Enviar resumen por WhatsApp
                </a>
                <span className="text-[11px] text-muted text-center block mt-2">
                  Envíos inmediatos en Bogotá, Medellín y Cali.
                </span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={onReset}
            className="bg-white hover:bg-line/40 text-ink font-medium text-sm h-11 px-8 rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-line"
            id="continue-shopping-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            Volver a la tienda
          </button>
        </div>

      </div>
    </div>
  );
}
