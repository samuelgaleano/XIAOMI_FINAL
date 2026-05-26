import React from "react";
import { ChevronRight } from "lucide-react";
import { Order } from "../types";

declare global { interface Window { WidgetCheckout: any; } }

export default function CheckoutPage({ onOrderComplete, onCancel }: { onOrderComplete: (order: Order, emailNotificationSent: boolean) => void; onCancel: () => void; }) {
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", address: "", city: "Bogotá, D.C.", departamento: "Cundinamarca", quantity: 1 });
  const [loading, setLoading] = React.useState(false);
  const [sameBilling, setSameBilling] = React.useState(true);
  const [config, setConfig] = React.useState<{wompiPublicKey:string; hasWompiConfig:boolean} | null>(null);
  const price = 250000;

  React.useEffect(() => { fetch('/api/config').then(r=>r.json()).then(setConfig); }, []);

  const pay = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customerName:form.name,customerEmail:form.email,customerPhone:form.phone,customerAddress:`${form.address} (${form.departamento})`,customerCity:form.city,amount:price*form.quantity,items:[{name:'Mi 20W Wireless Car Charger',price,quantity:form.quantity}],paymentMethod:'Wompi'})});
    const data = await res.json();
    if (!data.success) return alert(data.error || 'Error');
    if (!config?.hasWompiConfig || !window.WidgetCheckout) { onOrderComplete(data.order, false); return; }
    const checkout = new window.WidgetCheckout({
      currency: 'COP', amountInCents: data.wompi.amountInCents, reference: data.wompi.reference, publicKey: config.wompiPublicKey,
      signature: { integrity: data.wompi.signature }, redirectUrl: data.wompi.redirectUrl,
      customerData: { email: form.email, fullName: form.name, phoneNumber: form.phone, phoneNumberPrefix: '+57' }
    });
    checkout.open((result: any) => { if (result?.transaction?.status === 'APPROVED') onOrderComplete({...data.order,status:'APPROVED'}, true); else onOrderComplete(data.order, false); });
    setLoading(false);
  };

  return <div className="bg-gray-50 min-h-screen py-8"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4">
    <div>
      <div className="flex items-center gap-2 mb-4 text-sm"><button onClick={onCancel}>Inicio</button><ChevronRight className="w-4 h-4"/>Finalizar compra</div>
      <h1 className="text-3xl font-bold mb-6">SEaUno</h1>
      <form onSubmit={pay} className="space-y-4 bg-white p-6 rounded-xl border">
        <h2 className="text-xl font-bold">Contacto y entrega</h2>
        {['name','email','phone','address','city'].map((k)=><input key={k} required placeholder={k} className="w-full border rounded-lg p-3" value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>) }
        <div className="border rounded-lg p-4">
          <p className="font-semibold mb-2">Pago</p>
          <label className="flex items-center gap-2"><input type="radio" checked readOnly/>Tarjetas PC (Wompi)</label>
          <p className="text-sm text-gray-500">Nequi y Davivienda redirigen a Wompi en el mismo flujo.</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="font-semibold mb-2">Dirección de facturación</p>
          <label className="flex items-center gap-2"><input type="radio" checked={sameBilling} onChange={()=>setSameBilling(true)}/>La misma dirección de envío</label>
          <label className="flex items-center gap-2"><input type="radio" checked={!sameBilling} onChange={()=>setSameBilling(false)}/>Usar dirección distinta</label>
        </div>
        <button disabled={loading} className="w-full bg-black text-white rounded-lg py-3 font-bold">{loading?'Procesando...':'Pagar ahora'}</button>
      </form>
    </div>
    <aside className="bg-gray-100 p-6 rounded-xl sticky top-4 h-fit">
      <p className="font-semibold">Producto</p><p>Mi 20W Wireless Car Charger</p>
      <p className="mt-4">Total: <strong>${(price*form.quantity).toLocaleString('es-CO')} COP</strong></p>
    </aside>
  </div></div>;
}
