import React from "react";
import { ChevronRight, ShoppingBag, Lock, Truck, CreditCard, Smartphone, Building2 } from "lucide-react";
import { Order } from "../types";

declare global { interface Window { WidgetCheckout: any; } }

const PRODUCT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDb4tCIFKq4rJ1NAc4KY3AWQupIYxvPvzbo2ou8Qs9SISyT_OpBQR_dV0Bxu6VOXnbXmVKNuKlTHWIt97tzsiI0FdGKiUA7nrOioGZ5D0QsIDBnt4Sta1EkXrXylIDfOtgsaRl5RRbiBO1WnueWMi3okedfpcpVxUuBclVXr0j72KU939Mvv8FcE4gMfIXKkTgVAfS0F1n7T0xFRyYRChGGK4Y4cIRqoe_H-QRYojjGXJlhpAfvP49lr8rEui2QpnfepFcGBNTiGD8q";

type PaymentMethod = "wompi" | "pse" | "contraentrega";

export default function CheckoutPage({ onOrderComplete, onCancel }: {
  onOrderComplete: (order: Order, emailNotificationSent: boolean) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState({
    email: "", name: "", lastName: "", phone: "", cedula: "",
    address: "", addressExtra: "", city: "Bogotá", departamento: "Cundinamarca", quantity: 1
  });
  const [loading, setLoading] = React.useState(false);
  const [sameBilling, setSameBilling] = React.useState(true);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("wompi");
  const [config, setConfig] = React.useState<{ wompiPublicKey: string; hasWompiConfig: boolean } | null>(null);
  const price = 169900;
  const originalPrice = 219900;

  React.useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(setConfig);
  }, []);

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
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
          paymentMethod: paymentMethod === 'wompi' ? 'Wompi' : paymentMethod === 'pse' ? 'PSE/Addi' : 'Contra entrega'
        })
      });
      const data = await res.json();
      if (!data.success) { alert(data.error || 'Error'); setLoading(false); return; }

      if (paymentMethod === 'contraentrega') {
        onOrderComplete(data.order, false);
        return;
      }

      if (!config?.hasWompiConfig || !window.WidgetCheckout) {
        onOrderComplete(data.order, false);
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
        if (result?.transaction?.status === 'APPROVED') onOrderComplete({ ...data.order, status: 'APPROVED' }, true);
        else onOrderComplete(data.order, false);
      });
    } catch {
      alert('Error al procesar el pago');
    }
    setLoading(false);
  };

  const total = price * form.quantity;
  const savings = (originalPrice - price) * form.quantity;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #e5e5e5', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px', color: '#111' }}>
          XIAOMI CARTECH
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' }}>
          <Lock style={{ width: 14, height: 14 }} />
          Pago seguro
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{ padding: '12px 24px', fontSize: '13px', color: '#999', display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '1100px', margin: '0 auto' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E8521A', fontSize: '13px' }}>Inicio</button>
        <ChevronRight style={{ width: 14, height: 14 }} />
        <span style={{ color: '#333' }}>Finalizar compra</span>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '60px', alignItems: 'start' }}>

        {/* LEFT COLUMN - Form */}
        <form onSubmit={pay}>
          {/* Contact */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 }}>Contacto</h2>
              <span style={{ fontSize: '13px', color: '#999' }}>¿Ya tienes cuenta? <span style={{ color: '#E8521A', cursor: 'pointer' }}>Inicia sesión</span></span>
            </div>
            <input required type="email" placeholder="Email o número de teléfono móvil"
              value={form.email} onChange={f('email')}
              style={inputStyle} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '13px', color: '#555', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#E8521A' }} />
              Enviarme novedades y ofertas por correo electrónico
            </label>
          </section>

          {/* Delivery */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '16px' }}>Entrega</h2>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '8px', overflow: 'hidden' }}>
              <select value={form.departamento} onChange={f('departamento')} style={{ ...inputStyle, border: 'none', borderBottom: '1px solid #d9d9d9', borderRadius: 0, background: '#fafafa' }}>
                <option>Cundinamarca</option>
                <option>Antioquia</option>
                <option>Valle del Cauca</option>
                <option>Atlántico</option>
                <option>Bolívar</option>
                <option>Santander</option>
                <option>Otro</option>
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <input required placeholder="Nombre" value={form.name} onChange={f('name')}
                  style={{ ...inputStyle, border: 'none', borderBottom: '1px solid #d9d9d9', borderRight: '1px solid #d9d9d9', borderRadius: 0 }} />
                <input required placeholder="Apellidos" value={form.lastName} onChange={f('lastName')}
                  style={{ ...inputStyle, border: 'none', borderBottom: '1px solid #d9d9d9', borderRadius: 0 }} />
              </div>
              <input required placeholder="Cédula" value={form.cedula} onChange={f('cedula')}
                style={{ ...inputStyle, border: 'none', borderBottom: '1px solid #d9d9d9', borderRadius: 0 }} />
              <input required placeholder="Dirección" value={form.address} onChange={f('address')}
                style={{ ...inputStyle, border: 'none', borderBottom: '1px solid #d9d9d9', borderRadius: 0 }} />
              <input placeholder="Casa, apartamento, etc. (opcional)" value={form.addressExtra} onChange={f('addressExtra')}
                style={{ ...inputStyle, border: 'none', borderBottom: '1px solid #d9d9d9', borderRadius: 0 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                <input required placeholder="Ciudad" value={form.city} onChange={f('city')}
                  style={{ ...inputStyle, border: 'none', borderRight: '1px solid #d9d9d9', borderRadius: 0 }} />
                <select style={{ ...inputStyle, border: 'none', borderRight: '1px solid #d9d9d9', borderRadius: 0, background: '#fafafa', fontSize: '13px', color: '#333' }}>
                  <option>Bogotá</option>
                  <option>Medellín</option>
                  <option>Cali</option>
                </select>
                <input placeholder="Código postal (opc.)" style={{ ...inputStyle, border: 'none', borderRadius: 0 }} />
              </div>
            </div>
            <input required placeholder="Teléfono" value={form.phone} onChange={f('phone')}
              style={{ ...inputStyle, marginTop: '8px' }} />
          </section>

          {/* Shipping */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '16px' }}>Métodos de envío</h2>
            <div style={{ border: '2px solid #111', borderRadius: '8px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck style={{ width: 18, height: 18, color: '#E8521A' }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Envío Nacional</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>GRATIS</span>
            </div>
          </section>

          {/* Payment */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '16px' }}>Pago</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>Todas las transacciones son seguras y están encriptadas.</p>

            {/* Wompi */}
            <div style={{ border: paymentMethod === 'wompi' ? '2px solid #111' : '1px solid #d9d9d9', borderRadius: '8px 8px 0 0', padding: '14px 16px', cursor: 'pointer', background: paymentMethod === 'wompi' ? '#fafafa' : '#fff' }}
              onClick={() => setPaymentMethod('wompi')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={radioStyle(paymentMethod === 'wompi')} />
                  <CreditCard style={{ width: 16, height: 16, color: '#555' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Wompi</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['VISA', 'MC', 'AMEX', '+4'].map(c => (
                    <span key={c} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', fontWeight: '600', color: '#555', background: '#fff' }}>{c}</span>
                  ))}
                </div>
              </div>
              {paymentMethod === 'wompi' && (
                <p style={{ fontSize: '13px', color: '#666', marginTop: '10px', marginLeft: '26px' }}>
                  Se te redirigirá a Wompi para que completes la compra.
                </p>
              )}
            </div>

            {/* PSE */}
            <div style={{ border: paymentMethod === 'pse' ? '2px solid #111' : '1px solid #d9d9d9', borderTop: 'none', padding: '14px 16px', cursor: 'pointer', background: paymentMethod === 'pse' ? '#fafafa' : '#fff' }}
              onClick={() => setPaymentMethod('pse')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={radioStyle(paymentMethod === 'pse')} />
                  <Building2 style={{ width: 16, height: 16, color: '#555' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Paga a Crédito o Débito con PSE</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', fontWeight: '600', color: '#2563eb', background: '#fff' }}>Addi</span>
                  <span style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', fontWeight: '600', color: '#16a34a', background: '#fff' }}>PSE</span>
                </div>
              </div>
            </div>

            {/* Contra entrega */}
            <div style={{ border: paymentMethod === 'contraentrega' ? '2px solid #111' : '1px solid #d9d9d9', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '14px 16px', cursor: 'pointer', background: paymentMethod === 'contraentrega' ? '#fafafa' : '#fff' }}
              onClick={() => setPaymentMethod('contraentrega')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={radioStyle(paymentMethod === 'contraentrega')} />
                <Smartphone style={{ width: 16, height: 16, color: '#555' }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Pago contra entrega</span>
              </div>
            </div>
          </section>

          {/* Billing address */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '16px' }}>Dirección de facturación</h2>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: sameBilling ? 'none' : '1px solid #d9d9d9', background: sameBilling ? '#fafafa' : '#fff' }}
                onClick={() => setSameBilling(true)}>
                <div style={radioStyle(sameBilling)} />
                <span style={{ fontSize: '14px' }}>La misma dirección de envío</span>
              </div>
              <div style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', background: !sameBilling ? '#fafafa' : '#fff' }}
                onClick={() => setSameBilling(false)}>
                <div style={radioStyle(!sameBilling)} />
                <span style={{ fontSize: '14px' }}>Usar una dirección de facturación distinta</span>
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#999' : '#111', color: '#fff', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
            {loading ? 'Procesando...' : 'Pagar ahora'}
          </button>
        </form>

        {/* RIGHT COLUMN - Order Summary */}
        <aside style={{ position: 'sticky', top: '24px', background: '#f5f5f5', borderRadius: '12px', padding: '28px', borderLeft: '1px solid #e5e5e5' }}>
          {/* Product */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={PRODUCT_IMAGE} alt="Mi 20W Wireless Car Charger"
                style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', background: '#fff' }} />
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#555', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {form.quantity}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#111', margin: '0 0 4px' }}>Mi 20W Wireless Car Charger</p>
              <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Xiaomi CarTech</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <label style={{ fontSize: '12px', color: '#666' }}>Cant:</label>
                <select value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                  style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', fontSize: '13px', background: '#fff' }}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', whiteSpace: 'nowrap' }}>
              ${total.toLocaleString('es-CO')}
            </p>
          </div>

          {/* Discount code */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <input placeholder="Código de descuento o tarjeta de regalo"
              style={{ flex: 1, border: '1px solid #d9d9d9', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', background: '#fff' }} />
            <button type="button" style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '10px 16px', fontSize: '13px', fontWeight: '500', background: '#fff', cursor: 'pointer', color: '#555' }}>
              Aplicar
            </button>
          </div>

          {/* Totals */}
          <div style={{ fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
              <span>Subtotal ({form.quantity} {form.quantity === 1 ? 'artículo' : 'artículos'})</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
              <span>Envío</span>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>GRATIS</span>
            </div>
            {savings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#E8521A' }}>
                <span>Descuento aplicado</span>
                <span>-${savings.toLocaleString('es-CO')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #e0e0e0', fontWeight: '700', fontSize: '16px', color: '#111' }}>
              <span>Total</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', fontWeight: '400', color: '#888', marginRight: '6px' }}>COP</span>
                <span>${total.toLocaleString('es-CO')},00</span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { icon: <Lock style={{ width: 14, height: 14 }} />, text: 'Pago 100% seguro y encriptado' },
              { icon: <Truck style={{ width: 14, height: 14 }} />, text: 'Envío gratis a todo Colombia' },
              { icon: <ShoppingBag style={{ width: 14, height: 14 }} />, text: 'Garantía oficial Xiaomi' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#666' }}>
                <span style={{ color: '#E8521A' }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', border: '1px solid #d9d9d9',
  borderRadius: '6px', fontSize: '14px', color: '#333', outline: 'none',
  boxSizing: 'border-box', background: '#fff'
};

const radioStyle = (active: boolean): React.CSSProperties => ({
  width: '18px', height: '18px', borderRadius: '50%', border: active ? '5px solid #111' : '2px solid #bbb',
  flexShrink: 0, transition: 'all 0.15s'
});
