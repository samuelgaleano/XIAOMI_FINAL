import React from "react";
import { ChevronRight, ChevronDown, ShoppingBag, Lock, Truck, CreditCard, Smartphone, Building2, Globe, AlertCircle } from "lucide-react";
import { Order } from "../types";
import { formatCOP } from "../lib/format";
import { IMG_FRONT } from "../lib/product";
import { useI18n } from "../lib/i18n";

declare global { interface Window { WidgetCheckout: any; } }

const PRODUCT_IMAGE = IMG_FRONT;

type PaymentMethod = "wompi" | "pse" | "contraentrega";

const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

const trackPurchase = (orderId: string, eventId: string, value: number) => {
  window.fbq?.('track', 'Purchase', {
    content_ids: ['MI-20W-CAR-CHARGER'],
    content_type: 'product',
    value,
    currency: 'COP',
    order_id: orderId,
  }, { eventID: eventId });
};

export default function CheckoutPage({ onOrderComplete, onCancel, initialQuantity = 1 }: {
  onOrderComplete: (order: Order, emailNotificationSent: boolean) => void;
  onCancel: () => void;
  initialQuantity?: number;
}) {
  const { s, toggle } = useI18n();
  const c = s.checkout;
  const [form, setForm] = React.useState({
    email: "", name: "", lastName: "", phone: "", cedula: "",
    address: "", addressExtra: "", city: "Bogotá", departamento: "Cundinamarca",
    quantity: Math.min(5, Math.max(1, initialQuantity))
  });
  const [marketingOptIn, setMarketingOptIn] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [summaryOpen, setSummaryOpen] = React.useState(false);
  const [sameBilling, setSameBilling] = React.useState(true);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("wompi");
  const [config, setConfig] = React.useState<{ wompiPublicKey: string; hasWompiConfig: boolean } | null>(null);
  const price = 169900;
  const originalPrice = 219900;

  React.useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(setConfig);
  }, []);

  React.useEffect(() => {
    window.fbq?.('track', 'InitiateCheckout', {
      content_ids: ['MI-20W-CAR-CHARGER'],
      content_type: 'product',
      value: price,
      currency: 'COP',
    });
  }, []);

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fbp = getCookie('_fbp');
      const fbc = getCookie('_fbc');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${form.name} ${form.lastName}`.trim(),
          customerEmail: form.email,
          customerPhone: form.phone,
          customerAddress: `${form.address}${form.addressExtra ? ', ' + form.addressExtra : ''} (${form.departamento})`,
          customerCity: form.city,
          amount: price * form.quantity,
          items: [{ name: 'Mi 20W Wireless Car Charger', price, quantity: form.quantity }],
          paymentMethod: paymentMethod === 'wompi' ? 'Wompi' : paymentMethod === 'pse' ? 'PSE/Addi' : 'Contra entrega',
          fbp,
          fbc
        })
      });
      const data = await res.json();
      if (!data.success) { alert(data.error || 'Error'); setLoading(false); return; }

      // Contra entrega: el pedido queda registrado y se paga al recibir.
      if (paymentMethod === 'contraentrega') {
        trackPurchase(data.order.id, data.wompi.reference, price * form.quantity);
        onOrderComplete(data.order, false);
        return;
      }

      // Pago en línea (Wompi / PSE): si la pasarela no está lista NO se finge éxito.
      if (!config?.hasWompiConfig || !window.WidgetCheckout) {
        setError(c.errWompiUnavailable);
        setLoading(false);
        return;
      }

      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: data.wompi.amountInCents,
        reference: data.wompi.reference,
        publicKey: config.wompiPublicKey,
        signature: { integrity: data.wompi.signature },
        redirectUrl: data.wompi.redirectUrl,
        customerData: { email: form.email, fullName: `${form.name} ${form.lastName}`.trim(), phoneNumber: form.phone, phoneNumberPrefix: '+57' }
      });
      checkout.open((result: any) => {
        if (result?.transaction?.status === 'APPROVED') {
          // Solo aquí (pago aprobado) se registra la conversión y se muestra el éxito.
          trackPurchase(data.order.id, data.wompi.reference, price * form.quantity);
          onOrderComplete({ ...data.order, status: 'APPROVED' }, true);
        } else {
          // Rechazado o cancelado: el usuario se queda en el checkout para reintentar.
          setError(c.errNotApproved);
          setLoading(false);
        }
      });
    } catch {
      setError(c.errGeneric);
      setLoading(false);
    }
  };

  const total = price * form.quantity;
  const listTotal = originalPrice * form.quantity;
  const savings = listTotal - total;

  const inputClass = "w-full rounded-lg border border-line bg-white px-3.5 py-3 text-base text-body placeholder:text-muted focus:border-mi";

  return (
    <div className="bg-paper min-h-screen">
      {/* Encabezado minimal de pago */}
      <header className="bg-white border-b border-line px-5 py-2.5 flex items-center justify-between">
        <button onClick={onCancel} className="cursor-pointer" aria-label={c.home}>
          <img src="/xiaomi-cartech-logo.png" alt="Xiaomi CarTech" className="h-12 w-auto block" />
        </button>
        <div className="flex items-center gap-4">
          <button onClick={toggle} className="inline-flex items-center gap-1 text-[13px] font-semibold text-body hover:text-mi transition-colors cursor-pointer" aria-label={s.nav.langAria}>
            <Globe className="w-3.5 h-3.5" strokeWidth={1.8} />
            {s.nav.langLabel}
          </button>
          <div className="flex items-center gap-1.5 text-[13px] text-muted">
            <Lock className="w-3.5 h-3.5" />
            {c.securePay}
          </div>
        </div>
      </header>

      <div className="max-w-mi mx-auto px-5">
        {/* Miga de pan */}
        <div className="py-3.5 text-[13px] text-faint flex items-center gap-1.5">
          <button onClick={onCancel} className="text-mi-text hover:text-mi-dark cursor-pointer">{c.home}</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-body">{c.finish}</span>
        </div>

        <div className="pb-16 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8 items-start">

          {/* COLUMNA IZQUIERDA — Formulario */}
          <form onSubmit={pay} className="order-2 lg:order-1 space-y-5">

            {/* Contacto */}
            <section className="bg-white rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-ink mb-4">{c.contact}</h2>
              <input required type="email" placeholder={c.email} aria-label={c.email}
                value={form.email} onChange={f('email')}
                className={inputClass} />
              <label className="flex items-center gap-2 mt-3 text-[13px] text-body cursor-pointer">
                <input type="checkbox" checked={marketingOptIn} onChange={(e) => setMarketingOptIn(e.target.checked)} style={{ accentColor: '#ff6900', width: 16, height: 16 }} />
                {c.marketing}
              </label>
            </section>

            {/* Entrega */}
            <section className="bg-white rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-ink mb-4">{c.delivery}</h2>
              <div className="space-y-2.5">
                <select value={form.departamento} onChange={f('departamento')} className={inputClass} aria-label={c.department}>
                  <option>Cundinamarca</option>
                  <option>Antioquia</option>
                  <option>Valle del Cauca</option>
                  <option>Atlántico</option>
                  <option>Bolívar</option>
                  <option>Santander</option>
                  <option>Otro</option>
                </select>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input required placeholder={c.name} aria-label={c.name} autoComplete="given-name" value={form.name} onChange={f('name')} className={inputClass} />
                  <input required placeholder={c.lastName} aria-label={c.lastName} autoComplete="family-name" value={form.lastName} onChange={f('lastName')} className={inputClass} />
                </div>
                <input required placeholder={c.idNum} aria-label={c.idNum} inputMode="numeric" value={form.cedula} onChange={f('cedula')} className={inputClass} />
                <input required placeholder={c.address} aria-label={c.address} autoComplete="street-address" value={form.address} onChange={f('address')} className={inputClass} />
                <input placeholder={c.addressExtra} aria-label={c.addressExtra} value={form.addressExtra} onChange={f('addressExtra')} className={inputClass} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input required placeholder={c.city} aria-label={c.city} autoComplete="address-level2" value={form.city} onChange={f('city')} className={inputClass} />
                  <input placeholder={c.zip} aria-label={c.zip} inputMode="numeric" autoComplete="postal-code" className={inputClass} />
                </div>
                <input required placeholder={c.phone} aria-label={c.phone} type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={f('phone')} className={inputClass} />
              </div>

              {/* Método de envío */}
              <h3 className="text-sm font-semibold text-ink mt-6 mb-3">{c.shipMethod}</h3>
              <div className="border-2 border-mi rounded-lg px-4 py-3.5 flex justify-between items-center bg-mi-soft/40">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4.5 h-4.5 text-mi-text" />
                  <span className="text-sm font-medium text-ink">{c.shipNational}</span>
                </div>
                <span className="text-sm font-semibold text-mi-text">{s.common.free}</span>
              </div>
            </section>

            {/* Pago */}
            <section className="bg-white rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-ink mb-1.5">{c.payment}</h2>
              <p className="text-[13px] text-muted mb-4">{c.paymentNote}</p>

              <div className="rounded-lg border border-line overflow-hidden divide-y divide-line" role="radiogroup" aria-label={c.paymentGroup}>
                {[
                  {
                    id: 'wompi' as PaymentMethod,
                    icon: <CreditCard className="w-4 h-4 text-body" />,
                    label: c.wompi,
                    badges: ['Visa', 'MC', 'Amex', '+4'],
                    note: c.wompiNote,
                  },
                  {
                    id: 'pse' as PaymentMethod,
                    icon: <Building2 className="w-4 h-4 text-body" />,
                    label: c.pse,
                    badges: ['PSE', 'Addi'],
                  },
                  {
                    id: 'contraentrega' as PaymentMethod,
                    icon: <Smartphone className="w-4 h-4 text-body" />,
                    label: c.cod,
                    badges: [],
                    note: c.codNote,
                  },
                ].map(({ id, icon, label, badges, note }) => (
                  <label
                    key={id}
                    className={`block px-4 py-3.5 cursor-pointer transition-colors ${paymentMethod === id ? 'bg-mi-soft/40' : 'bg-white hover:bg-paper/60'}`}
                  >
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={id}
                          checked={paymentMethod === id}
                          onChange={() => setPaymentMethod(id)}
                          style={{ accentColor: '#ff6900', width: 18, height: 18 }}
                        />
                        {icon}
                        <span className="text-sm font-medium text-ink">{label}</span>
                      </div>
                      <div className="hidden sm:flex gap-1.5">
                        {badges.map(b => (
                          <span key={b} className="border border-line rounded px-1.5 py-0.5 text-[11px] font-medium text-muted bg-white">{b}</span>
                        ))}
                      </div>
                    </div>
                    {note && paymentMethod === id && (
                      <p className="text-[13px] text-muted mt-2 ml-[30px]">{note}</p>
                    )}
                  </label>
                ))}
              </div>
            </section>

            {/* Dirección de facturación */}
            <section className="bg-white rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-ink mb-4">{c.billing}</h2>
              <div className="rounded-lg border border-line overflow-hidden divide-y divide-line" role="radiogroup" aria-label={c.billing}>
                {[
                  { value: true, label: c.billingSame },
                  { value: false, label: c.billingOther },
                ].map(({ value, label }) => (
                  <label key={label} className={`flex items-center gap-2.5 px-4 py-3.5 cursor-pointer transition-colors ${sameBilling === value ? 'bg-mi-soft/40' : 'bg-white hover:bg-paper/60'}`}>
                    <input
                      type="radio"
                      name="billing"
                      checked={sameBilling === value}
                      onChange={() => setSameBilling(value)}
                      style={{ accentColor: '#ff6900', width: 18, height: 18 }}
                    />
                    <span className="text-sm text-ink">{label}</span>
                  </label>
                ))}
              </div>
            </section>

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className={`w-full h-[52px] rounded-lg text-white text-base font-semibold transition-colors ${loading ? 'bg-faint cursor-not-allowed' : 'bg-mi hover:bg-mi-dark cursor-pointer'}`}>
              {loading ? c.processing : c.payNow}
            </button>
          </form>

          {/* COLUMNA DERECHA — Resumen del pedido (colapsable en móvil) */}
          <aside className="order-1 lg:order-2 lg:sticky lg:top-6 bg-white rounded-2xl p-6">
            <button
              type="button"
              onClick={() => setSummaryOpen(!summaryOpen)}
              className="lg:hidden w-full min-h-11 flex items-center justify-between cursor-pointer"
              aria-expanded={summaryOpen}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-mi-text">
                <ShoppingBag className="w-4 h-4" />
                {summaryOpen ? c.hideSummary : c.showSummary}
                <ChevronDown className={`w-4 h-4 transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
              </span>
              <span className="text-base font-semibold text-ink">{formatCOP(total)}</span>
            </button>

            <div className={`${summaryOpen ? 'block' : 'hidden'} lg:block mt-5 lg:mt-0`}>
            {/* Producto */}
            <div className="flex gap-4 pb-5 border-b border-line">
              <div className="relative shrink-0">
                <img src={PRODUCT_IMAGE} alt="Mi 20W Wireless Car Charger"
                  className="w-[72px] h-[72px] object-cover rounded-lg border border-line bg-paper" />
                <span className="absolute -top-2 -right-2 bg-mi text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
                  {form.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">Mi 20W Wireless Car Charger</p>
                <p className="text-[13px] text-muted">Xiaomi CarTech</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <label htmlFor="qty" className="text-xs text-muted">{c.qtyLabel}</label>
                  <select id="qty" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                    className="border border-line rounded-lg px-3 py-2 text-base bg-white min-h-11">
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-sm font-semibold text-ink whitespace-nowrap">{formatCOP(total)}</p>
            </div>

            {/* Código de descuento */}
            <div className="flex gap-2 py-5 border-b border-line">
              <input placeholder={c.discountCode} aria-label={c.discountCode} className={`${inputClass} flex-1`} />
              <button type="button" className="border border-line rounded-lg px-4 text-sm font-medium bg-white text-body hover:border-ink transition-colors cursor-pointer">
                {c.apply}
              </button>
            </div>

            {/* Totales */}
            <div className="pt-5 text-sm space-y-2.5">
              <div className="flex justify-between text-body">
                <span>{c.listPrice(form.quantity)}</span>
                <span className="line-through text-muted">{formatCOP(listTotal)}</span>
              </div>
              <div className="flex justify-between text-mi-text font-medium">
                <span>{c.launchDiscount}</span>
                <span>−{formatCOP(savings)}</span>
              </div>
              <div className="flex justify-between text-body">
                <span>{c.shipping}</span>
                <span className="font-medium text-mi-text">{s.common.free}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3.5 border-t border-line font-semibold text-base text-ink">
                <span>{s.common.total}</span>
                <span>{formatCOP(total)} <span className="text-xs font-normal text-muted">COP</span></span>
              </div>
            </div>

            {/* Confianza */}
            <div className="mt-5 pt-5 border-t border-line space-y-2">
              {[
                { icon: <Lock className="w-3.5 h-3.5" />, text: c.trust[0] },
                { icon: <Truck className="w-3.5 h-3.5" />, text: c.trust[1] },
                { icon: <ShoppingBag className="w-3.5 h-3.5" />, text: c.trust[2] },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-muted">
                  <span className="text-mi-text">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
