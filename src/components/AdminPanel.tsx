import React from "react";
import { Order } from "../types";
import { Lock, LogOut, RefreshCw, Check, X, Truck, Trash2, Package, Search } from "lucide-react";
import { adminLogin, clearToken, authHeaders, isAuthed } from "../lib/adminAuth";

export default function AdminPanel({ orders, onUpdateOrderStatus, onDeleteOrder, onRefreshOrders }: any) {
  const [authed, setAuthed] = React.useState<boolean>(() => isAuthed());
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  const [evidence, setEvidence] = React.useState<Record<string, string>>({});
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "PENDING" | "APPROVED" | "DECLINED">("all");

  const [loggingIn, setLoggingIn] = React.useState(false);
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError("");
    try {
      // La validación ocurre en el servidor; el cliente solo recibe el token firmado.
      const ok = await adminLogin(email, password);
      if (ok) {
        setAuthed(true);
        onRefreshOrders();
      } else {
        setAuthError("Credenciales incorrectas. Inténtalo de nuevo.");
      }
    } catch {
      setAuthError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    setAuthed(false);
    setEmail("");
    setPassword("");
    clearToken();
  };

  const markShipped = async (id: string) => {
    await fetch("/api/orders/" + id + "/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ shippingStatus: "SHIPPED", shippingEvidenceUrl: evidence[id] || "" })
    });
    onRefreshOrders();
  };

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#ff6900]/10 p-3 rounded-full mb-3">
              <Lock className="w-6 h-6 text-[#ff6900]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Acceso administrador</h2>
            <p className="text-sm text-gray-500 mt-1">Inicia sesión para gestionar pedidos</p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
              />
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-[#ff6900] hover:bg-[#e55f00] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {loggingIn ? "Verificando…" : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filtered = orders.filter((o: Order) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (o.id || "").toLowerCase().includes(s)
      || (o.customerName || "").toLowerCase().includes(s)
      || (o.customerEmail || "").toLowerCase().includes(s);
  });

  const totalRevenue = orders
    .filter((o: Order) => o.status === "APPROVED")
    .reduce((acc: number, o: Order) => acc + (Number(o.amount) || 0), 0);

  const statusBadge = (status: string) => {
    const map: any = {
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DECLINED: "bg-red-100 text-red-800 border-red-200"
    };
    return map[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const shipBadge = (status: string) => {
    if (status === "SHIPPED") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Panel administrador</h2>
          <p className="text-sm text-gray-500 mt-1">Gestiona pedidos, pagos y envíos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefreshOrders}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Total pedidos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Aprobados</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{orders.filter((o: Order) => o.status === "APPROVED").length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">{orders.filter((o: Order) => o.status === "PENDING").length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Ingresos aprobados</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toLocaleString("es-CO")}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
        >
          <option value="all">Todos los estados</option>
          <option value="PENDING">Pendientes</option>
          <option value="APPROVED">Aprobados</option>
          <option value="DECLINED">Declinados</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No hay pedidos para mostrar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Contacto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Monto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Método</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Pago</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Envío</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o: Order) => (
                  <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs text-gray-700">{o.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{o.customerName}</p>
                      <p className="text-xs text-gray-500">{o.customerCity}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-gray-700">{o.customerEmail}</p>
                      <p className="text-xs text-gray-500">{o.customerPhone}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">${Number(o.amount).toLocaleString("es-CO")}</td>
                    <td className="py-3 px-4 text-xs text-gray-700">{o.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <span className={"inline-block px-2 py-0.5 rounded text-xs font-semibold border " + statusBadge(o.status)}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={"inline-block px-2 py-0.5 rounded text-xs font-semibold border " + shipBadge(o.shippingStatus || "PENDING")}>
                        {o.shippingStatus || "PENDING"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {o.status !== "APPROVED" && (
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, "APPROVED")}
                            title="Aprobar pago"
                            className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-2 py-1 rounded"
                          >
                            <Check className="w-3 h-3" /> Aprobar
                          </button>
                        )}
                        {o.status !== "DECLINED" && (
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, "DECLINED")}
                            title="Declinar pago"
                            className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-2 py-1 rounded"
                          >
                            <X className="w-3 h-3" /> Declinar
                          </button>
                        )}
                        {o.shippingStatus !== "SHIPPED" && (
                          <>
                            <input
                              placeholder="URL guía"
                              className="border border-gray-300 px-2 py-1 rounded text-xs w-28"
                              value={evidence[o.id] || ""}
                              onChange={e => setEvidence({ ...evidence, [o.id]: e.target.value })}
                            />
                            <button
                              onClick={() => markShipped(o.id)}
                              title="Marcar como enviado"
                              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-2 py-1 rounded"
                            >
                              <Truck className="w-3 h-3" /> Enviar
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onDeleteOrder(o.id)}
                          title="Eliminar pedido"
                          className="inline-flex items-center gap-1 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 text-xs font-medium px-2 py-1 rounded border border-gray-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
