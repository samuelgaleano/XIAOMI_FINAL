import React from "react";
import Navigation from "./components/Navigation";
import ProductLanding from "./components/ProductLanding";
import ProductDetail from "./components/ProductDetail";
import CheckoutPage from "./components/CheckoutPage";
import SuccessPage from "./components/SuccessPage";
import AdminPanel from "./components/AdminPanel";
import { Order } from "./types";
import { authHeaders, clearToken, isAuthed } from "./lib/adminAuth";
import { useI18n } from "./lib/i18n";
import { PRODUCT } from "./lib/product";
import { MessageCircle, Check } from "lucide-react";

type Tab = "home" | "product" | "admin" | "checkout";

export default function App() {
  const { s } = useI18n();
  const [currentTab, setCurrentTab] = React.useState<Tab>("home");
  const [completedOrder, setCompletedOrder] = React.useState<Order | null>(null);
  const [emailNotificationSent, setEmailNotificationSent] = React.useState(false);

  // Carrito: cantidad del único producto + cantidad con la que se abre el checkout
  const [cartQty, setCartQty] = React.useState(0);
  const [checkoutQty, setCheckoutQty] = React.useState(1);
  const [toast, setToast] = React.useState<string | null>(null);
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const goToTab = (tab: Tab) => {
    setCurrentTab(tab);
  };

  const handleAddToCart = (qty: number) => {
    setCartQty((c) => Math.min(PRODUCT.maxQuantity, c + qty));
    showToast(s.toast.added(qty));
  };

  const handleBuyNow = (qty: number) => {
    setCheckoutQty(qty);
    goToTab("checkout");
  };

  const handleOpenCart = () => {
    setCheckoutQty(cartQty > 0 ? cartQty : 1);
    goToTab("checkout");
  };

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

  // Al cambiar de vista (o mostrar la confirmación) volver siempre al inicio de la
  // página: si el usuario pulsó "Comprar ahora" desde el fondo del landing, el
  // checkout debe abrir desde arriba y no quedarse en la posición anterior.
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab, completedOrder]);

  // Retorno de pasarelas con redirect de página completa (PSE/Nequi/Bancolombia):
  // Wompi vuelve a `/?checkout=success&orderId=…`. Sin esto, quien paga por PSE
  // no vería ninguna confirmación. Mostramos el éxito, vaciamos el carrito y
  // limpiamos la URL.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      const orderId = params.get("orderId") || "";
      setCompletedOrder({
        id: orderId, customerName: "", customerEmail: "", customerPhone: "",
        customerAddress: "", customerCity: "", paymentMethod: "", amount: 0,
        status: "APPROVED", items: [], createdAt: "", paymentDetails: {},
      } as unknown as Order);
      setEmailNotificationSent(false);
      setCartQty(0);
      window.history.replaceState({}, "", window.location.pathname);
    }
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
    setCartQty(0); // vaciar el carrito al concretar la compra
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
          setCurrentTab={(tab: string) => {
            if (tab === "admin") setCurrentTab("admin");
            else if (tab === "product") goToTab("product");
            else setCurrentTab("home");
          }}
          onOpenProduct={() => goToTab("product")}
          onOpenCheckout={() => setCurrentTab("checkout")}
          adminLoggedIn={isAuthed()}
          onLogoutAdmin={() => {}}
          cartCount={cartQty}
          onOpenCart={handleOpenCart}
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
            initialQuantity={checkoutQty}
          />
        ) : currentTab === "product" ? (
          <ProductDetail
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
            onBack={() => goToTab("home")}
          />
        ) : (
          <ProductLanding
            onOpenCheckout={() => setCurrentTab("checkout")}
            onViewProduct={() => goToTab("product")}
          />
        )}
      </main>

      {/* Toast de confirmación (carrito) */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-ink text-white text-sm font-medium pl-4 pr-3 py-3 rounded-xl shadow-lg animate-fade-in-up"
        >
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-mi shrink-0">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </span>
          <span>{toast}</span>
          <button
            onClick={handleOpenCart}
            className="ml-1 text-mi-text bg-white/95 hover:bg-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {s.toast.viewCart}
          </button>
        </div>
      )}

      {/* Footer — estructura de columnas estilo mi.com */}
      <footer className="bg-white border-t border-line text-left">
        <div className="max-w-mi mx-auto px-5 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">

          <div className="col-span-2 md:col-span-1 space-y-4">
            <img src="/xiaomi-cartech-logo.png" alt="Xiaomi CarTech" className="h-14 w-auto" />
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              {s.footer.blurb}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink text-sm mb-4">{s.footer.product}</h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li><a href="#features" className="hover:text-mi transition-colors">{s.nav.features}</a></li>
              <li><a href="#specs" className="hover:text-mi transition-colors">{s.nav.specs}</a></li>
              <li><a href="#reviews" className="hover:text-mi transition-colors">{s.nav.reviews}</a></li>
              <li>
                <button onClick={() => setCurrentTab("checkout")} className="hover:text-mi transition-colors cursor-pointer">
                  {s.common.buyNow}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink text-sm mb-4">{s.footer.support}</h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li>
                <a
                  href={`https://wa.me/573148145417?text=${encodeURIComponent(s.wa.orderHelp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-mi transition-colors"
                  id="wa-footer-btn"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {s.footer.waLive}
                </a>
              </li>
              <li><a href="mailto:ventas@xiaomicartech.com.co" className="hover:text-mi transition-colors break-all">ventas@xiaomicartech.com.co</a></li>
              <li>{s.footer.warranty12}</li>
              <li>{s.footer.shipping25}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink text-sm mb-4">{s.footer.payMethods}</h4>
            <div className="flex flex-wrap gap-1.5">
              {["Wompi", "PSE", "Nequi", "Bold", "Visa", "Mastercard"].map((m) => (
                <span key={m} className="border border-line text-muted py-1 px-2.5 rounded text-[11px] font-medium">
                  {m}
                </span>
              ))}
            </div>
            <h4 className="font-semibold text-ink text-sm mb-3 mt-6">{s.footer.legal}</h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li><a href="/privacidad.html" className="hover:text-mi transition-colors">{s.footer.privacy}</a></li>
              <li><a href="/terminos.html" className="hover:text-mi transition-colors">{s.footer.terms}</a></li>
              <li><a href="/eliminacion-de-datos.html" className="hover:text-mi transition-colors">{s.footer.dataRemoval}</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-line bg-[#fafafa]">
          <div className="max-w-mi mx-auto px-5 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-muted">
            <p>{s.footer.rights}</p>
            <span>{s.footer.region}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
