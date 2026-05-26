import React from "react";
import { Order } from "../types";

export default function AdminPanel({ orders, onUpdateOrderStatus, onDeleteOrder, onRefreshOrders }: any) {
  const [evidence, setEvidence] = React.useState<Record<string,string>>({});
  const markShipped = async (id:string) => {
    await fetch(`/api/orders/${id}/shipping`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({shippingStatus:'SHIPPED', shippingEvidenceUrl:evidence[id] || ''})});
    onRefreshOrders();
  };
  return <div className="max-w-6xl mx-auto py-10 px-4"><h2 className="text-2xl font-bold mb-6">Panel administrador</h2>
    <div className="overflow-auto bg-white border rounded-xl"><table className="w-full text-sm"><thead><tr className="bg-gray-50"><th>ID</th><th>Cliente</th><th>Método</th><th>Estado pago</th><th>Envío</th><th>Fecha esperada</th><th>Acciones</th></tr></thead>
    <tbody>{orders.map((o:Order)=><tr key={o.id} className="border-t"><td>{o.id}</td><td>{o.customerName}</td><td>{o.paymentMethod}</td><td>{o.status}</td><td>{o.shippingStatus || 'PENDING'}</td><td>{o.expectedShipDate ? new Date(o.expectedShipDate).toLocaleDateString('es-CO') : '-'}</td><td className="space-x-2 py-2">
      <button onClick={()=>onUpdateOrderStatus(o.id,'APPROVED')} className="px-2 py-1 border rounded">Aprobar</button>
      <button onClick={()=>onUpdateOrderStatus(o.id,'DECLINED')} className="px-2 py-1 border rounded">Declinar</button>
      <input placeholder="URL evidencia Interrapidísimo" className="border p-1" value={evidence[o.id]||''} onChange={e=>setEvidence({...evidence,[o.id]:e.target.value})}/>
      <button onClick={()=>markShipped(o.id)} className="px-2 py-1 border rounded">Marcar enviado</button>
      <button onClick={()=>onDeleteOrder(o.id)} className="px-2 py-1 border rounded">Eliminar</button>
    </td></tr>)}</tbody></table></div></div>;
}
