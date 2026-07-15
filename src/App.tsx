import React from "react";
import Navigation from "./components/Navigation";
import ProductLanding from "./components/ProductLanding";
import CheckoutPage from "./components/CheckoutPage";
import SuccessPage from "./components/SuccessPage";
import AdminPanel from "./components/AdminPanel";
import { Order } from "./types";
import { authHeaders, clearToken, isAuthed } from "./lib/adminAuth";
import { MessageCircle } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = React.useState<"home" | "admin" | "checkout">("home");
  const [completedOrder, setCompletedOrder] = React.useState<Order | null>(null);
  const [emailNotificationSent, setEmailNotificationSent] = React.useState(false);

  // Administrative orders list
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState(false);

  // Fetch orders (solo admin autenticado; el servidor exige el token)
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch("/api/orders", { headers: authHeaders() });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else if (response.status === 401) {
        clearToken();
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to load backend orders tree:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Cargar pedidos solo si ya hay sesión de admin (antes se cargaban para todo
  // visitante, filtrando datos de clientes en la home pública)
  React.useEffect(() => {
    if (isAuthed()) fetchOrders();
  }, []);

  // Acceso al panel administrador por URL (#admin), sin enlaces en la UI pública
  React.useEffect(() => {
    const syncAdminFromHash = () => {
      if (window.location.hash === "#admin") {
        setCurrentTab("admin");
      }
    };
    syncAdminFromHash();
    window.addEventListener("hashchange", syncAdminFromHash);
    return () => window.removeEventListener("hashchange", syncAdminFromHash);
  }, []);

  // Update specific order status in backend (Admin actions)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'APPROVED' | 'DECLINED' | 'PENDING') => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        // Refresh local memory grid
        fetchOrders();
      } else {
        const errData = await response.json();
        alert(`No se pudo actualizar el estado: ${errData.error || 'error desconocido'}`);
      }
    } catch (error) {
      console.error("Failed to update status on server:", error);
      alert("Error de comunicación de red al actualizar estado.");
    }
  };

  // Delete an order record (Admin administrative cleaning)
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar permanentemente este registro de compra?")) {
      return;
    }
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (response.ok) {
        fetchOrders();
      } else {
        alert("Ocurrió un error al intentar eliminar el pedido.");
      }
    } catch (error) {
      console.error("Failed to clear order:", error);
    }
  };

  const handleOrderComplete = (order: Order, wasEmailSent: boolean) => {
    setCompletedOrder(order);
    setEmailNotificationSent(wasEmailSent);
    // Refresh admin data
    fetchOrders();
  };

  const handleResetSuccess = () => {
    setCompletedOrder(null);
    setEmailNotificationSent(false);
    setCurrentTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-body selection:bg-mi-soft selection:text-mi-dark flex flex-col justify-between">
      
      {/* Interactive Navigation bar — el checkout usa su propio encabezado minimal */}
      {currentTab !== "checkout" && !completedOrder && (
        <Navigation
          currentTab={currentTab === "admin" ? "admin" : "home"}
          setCurrentTab={(tab) => {
            if (tab === "admin") {
              setCurrentTab("admin");
            } else {
              setCurrentTab("home");
            }
          }}
          onOpenCheckout={() => setCurrentTab("checkout")}
          adminLoggedIn={isAuthed()}
          onLogoutAdmin={() => {}}
        />
      )}

      {/* Main Body */}
      <main className="flex-1">
        {completedOrder ? (
          <SuccessPage 
            order={completedOrder} 
            emailNotificationSent={emailNotificationSent}
            onReset={handleResetSuccess}
          />
        ) : currentTab === "admin" ? (
          <AdminPanel 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onRefreshOrders={fetchOrders}
          />
        ) : currentTab === "checkout" ? (
          <CheckoutPage 
            onOrderComplete={handleOrderComplete}
            onCancel={() => setCurrentTab("home")}
          />
        ) : (
          <ProductLanding onOpenCheckout={() => setCurrentTab("checkout")} />
        )}
      </main>

      {/* Footer — estructura de columnas estilo mi.com */}
      <footer className="bg-white border-t border-line text-left">
        <div className="max-w-mi mx-auto px-5 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">

          <div className="col-span-2 md:col-span-1 space-y-4">
            <img src="/xiaomi-cartech-logo.png" alt="Xiaomi CarTech" className="h-14 w-auto" />
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              Distribuidor autorizado independiente del Mi 20W Wireless Car Charger en
              Colombia. Producto original, empaque sellado de fábrica y garantía oficial.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink text-sm mb-4">Producto</h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li><a href="#features" className="hover:text-mi transition-colors">Características</a></li>
              <li><a href="#specs" className="hover:text-mi transition-colors">Especificaciones</a></li>
              <li><a href="#reviews" className="hover:text-mi transition-colors">Reseñas</a></li>
              <li>
                <button onClick={() => setCurrentTab("checkout")} className="hover:text-mi transition-colors cursor-pointer">
                  Comprar ahora
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink text-sm mb-4">Soporte</h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li>
                <a
                  href="https://wa.me/573000000000?text=Hola%2C%20necesito%20asistencia%20respecto%20a%20mi%20pedido."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-mi transition-colors"
                  id="wa-footer-btn"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp en vivo
                </a>
              </li>
              <li><a href="mailto:ventas@xiaomicartech.com.co" className="hover:text-mi transition-colors break-all">ventas@xiaomicartech.com.co</a></li>
              <li>Garantía oficial de 12 meses</li>
              <li>Envíos a todo el país en 2–5 días</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink text-sm mb-4">Medios de pago</h4>
            <div className="flex flex-wrap gap-1.5">
              {["Wompi", "PSE", "Nequi", "Bold", "Visa", "Mastercard"].map((m) => (
                <span key={m} className="border border-line text-muted py-1 px-2.5 rounded text-[11px] font-medium">
                  {m}
                </span>
              ))}
            </div>
            <h4 className="font-semibold text-ink text-sm mb-3 mt-6">Legal</h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li><a href="/privacidad.html" className="hover:text-mi transition-colors">Política de privacidad</a></li>
              <li><a href="/terminos.html" className="hover:text-mi transition-colors">Términos y condiciones</a></li>
              <li><a href="/eliminacion-de-datos.html" className="hover:text-mi transition-colors">Eliminación de datos</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-line bg-[#fafafa]">
          <div className="max-w-mi mx-auto px-5 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-muted">
            <p>
              © 2026 Xiaomi CarTech Colombia (xiaomicartech.com.co) · Importador independiente.
              Xiaomi y Mi son marcas registradas de Xiaomi Inc.
            </p>
            <span>Colombia (Español)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
