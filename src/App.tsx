import { useEffect, useState, useCallback } from "react";
import { T, SEED_MENU, DELIVERY_FEE } from "./data/site";
import { supabase } from "./lib/supabase";
import { adminLogin, createOrder, customerLogin, customerSignup, deleteMenuItem, getProfile, getSession, loadCustomers, loadMenu, loadOrders, logout, updateOrderStatus, upsertMenu } from "./lib/backend";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import OrderTypePicker from "./pages/OrderTypePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import LoginPage from "./pages/LoginPage";

import AdminLogin from "./admin/AdminLogin";

import CustomerAuth from "./customer/CustomerAuth";
import CustomerOrders from "./customer/CustomerOrders";

import SuperAdminPage from "./superadmin/SuperAdminPage";

import "./styles.css";

import type {
  View,
  OrderType,
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  CheckoutForm,
  Customer,
} from "./types";

export default function App() {
  const [view, setView] = useState<View>("home");

  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>(SEED_MENU);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Authentication is handled by Supabase Auth.
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [currentProfile, setCurrentProfile] = useState<(Customer & { role: "customer" | "admin" }) | null>(null);

  // Backend data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(null);

  // --------------------------------------------------
  // LOAD DATA + AUTH SESSION
  // --------------------------------------------------

  const refreshBackendData = useCallback(async (withOrders = false) => {
    const menu = await loadMenu();
    setMenuItems(menu.length ? menu : SEED_MENU);
    if (withOrders) setOrders(await loadOrders());
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await getSession();
        if (session?.user && mounted) {
          const profile = await getProfile(session.user.id);
          setCurrentProfile(profile);
          setCurrentCustomerId(profile.role === "customer" ? profile.id : null);
          setView(profile.role === "admin" ? "admin" : "customerOrders");
          await refreshBackendData(true);
        } else {
          await refreshBackendData(false);
        }
      } catch (error) {
        console.error("Backend initialization failed:", error);
        setAuthError(error instanceof Error ? error.message : "Could not connect to the backend.");
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setCurrentProfile(null);
        setCurrentCustomerId(null);
        return;
      }
      try {
        const profile = await getProfile(session.user.id);
        setCurrentProfile(profile);
        setCurrentCustomerId(profile.role === "customer" ? profile.id : null);
      } catch (error) {
        console.error("Could not load profile:", error);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, [refreshBackendData]);

  const saveMenu = useCallback(async (next: MenuItem[]) => {
    try { setMenuItems(await upsertMenu(next)); }
    catch (error) { setAuthError(error instanceof Error ? error.message : "Could not save menu."); }
  }, []);

  const saveOrders = useCallback((next: Order[]) => setOrders(next), []);

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const goHome = () => setView("home");
  const goMenu = () => setView("menu");
  const goCart = () => setView("cart");
  const goCheckout = () => setView("checkout");

  const goLogin = () => setView("login");
  const selectLoginRole = (role: "customer" | "admin") => {
    setAuthError("");
    setView(role === "customer" ? "customerAuth" : "admin");
  };

  const goCustomerArea = () => {
    setView(currentCustomerId ? "customerOrders" : "customerAuth");
  };

  // --------------------------------------------------
  // ORDER TYPE
  // --------------------------------------------------

  const startOrder = (type?: OrderType) => {
    if (type) {
      setOrderType(type);
      setView("menu");
    } else {
      setView("orderType");
    }
  };

  const pickOrderType = (type: OrderType) => {
    setOrderType(type);
    setView("menu");
  };

  const changeOrderType = () => {
    setView("orderType");
  };

  // --------------------------------------------------
  // CART
  // --------------------------------------------------

  const addToCart = (item: MenuItem) => {
    setCart((current) => ({
      ...current,
      [item.id]: {
        ...item,
        qty: (current[item.id]?.qty ?? 0) + 1,
      },
    }));
  };

  const incItem = (id: string) => {
    setCart((current) => {
      const item = current[id];
      if (!item) return current;
      return { ...current, [id]: { ...item, qty: item.qty + 1 } };
    });
  };

  const decItem = (id: string) => {
    setCart((current) => {
      const item = current[id];
      if (!item) return current;
      if (item.qty <= 1) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: { ...item, qty: item.qty - 1 } };
    });
  };

  const removeItem = (id: string) => {
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  // --------------------------------------------------
  // CART TOTALS
  // --------------------------------------------------

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const deliveryFee = orderType === "delivery" && cartCount > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  // --------------------------------------------------
  // PLACE ORDER
  // --------------------------------------------------

  const placeOrder = async (form: CheckoutForm) => {
    if (!orderType || !currentCustomerId) {
      setAuthError("Please log in as a customer before placing an order.");
      setView("customerAuth");
      return;
    }

    const orderNumber = "TW-" + Date.now().toString().slice(-6);
    const order: Order = { orderNumber, orderType, form, items: Object.values(cart), subtotal, deliveryFee, total, status: "New", createdAt: Date.now(), customerId: currentCustomerId };

    try {
      await createOrder(order);
      setOrders([order, ...orders]);
      setLastOrder(order);
      setCart({});
      setView("confirmation");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Could not place your order.");
    }
  };

  // --------------------------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------------------------

  const updateStatus = async (orderNumber: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderNumber, status);
      setOrders((current) => current.map((order) => order.orderNumber === orderNumber ? { ...order, status } : order));
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Could not update the order.");
    }
  };

  // --------------------------------------------------
  // CUSTOMER / ADMIN AUTH
  // --------------------------------------------------

  const handleCustomerSignup = async (name: string, email: string, password: string) => {
    try {
      setAuthError("");
      const profile = await customerSignup(name, email, password);
      setCurrentProfile(profile);
      setOrders(await loadOrders());
      setCurrentCustomerId(profile.id);
      setView("customerOrders");
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create your account.";
      setAuthError(message);
      return { ok: false, error: message };
    }
  };

  const handleCustomerLogin = async (email: string, password: string) => {
    try {
      setAuthError("");
      const profile = await customerLogin(email, password);
      setCurrentProfile(profile);
      setOrders(await loadOrders());
      setCurrentCustomerId(profile.id);
      setView("customerOrders");
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Incorrect email or password.";
      setAuthError(message);
      return { ok: false, error: message };
    }
  };

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      setAuthError("");
      const profile = await adminLogin(email, password);
      setCurrentProfile(profile);
      setView("admin");
      const [orderList, customerList] = await Promise.all([loadOrders(), loadCustomers()]);
      setOrders(orderList);
      setCustomers(customerList);
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Incorrect admin credentials.";
      setAuthError(message);
      return { ok: false, error: message };
    }
  };

  const handleCustomerLogout = async () => { await handleLogout(); };

  const handleLogout = async () => {
    try { await logout(); } catch (error) { console.error(error); }
    setCurrentProfile(null);
    setCurrentCustomerId(null);
    setView("home");
  };

  const currentCustomer = currentProfile?.role === "customer" ? { id: currentProfile.id, name: currentProfile.name, phone: currentProfile.phone } : null;

  // --------------------------------------------------
  // ORDER STEPS
  // --------------------------------------------------

  const stepMap: Record<string, number> = {
    orderType: 0,
    menu: 1,
    cart: 2,
    checkout: 3,
    confirmation: 4,
  };

  const step = stepMap[view];

  if (authLoading) {
    return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: T.sand, color: T.ink60 }}>Connecting…</div>;
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  const showChrome = view !== "admin";

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        color: T.ink,
        background: T.sand,
        minHeight: "100vh",
      }}
    >
      {showChrome && (
        <Header
          goHome={goHome}
          goMenu={goMenu}
          goLogin={goLogin}
          goCustomerArea={goCustomerArea}
          isCustomerLoggedIn={!!currentCustomer}
          customerName={currentCustomer?.name}
          openOrderType={() => startOrder()}
          cartCount={cartCount}
          openCart={goCart}
          dark={view === "home"}
        />
      )}

      {view === "login" && (
        <LoginPage onSelect={selectLoginRole} onBack={goHome} />
      )}

      {view === "home" && (
        <HomePage startOrder={startOrder} goMenu={goMenu} menuItems={menuItems} />
      )}

      {view === "orderType" && (
        <OrderTypePicker onPick={pickOrderType} onBack={goHome} />
      )}

      {view === "menu" && (
        <MenuPage
          menuItems={menuItems}
          cart={cart}
          addToCart={addToCart}
          incItem={incItem}
          decItem={decItem}
          orderType={orderType}
          goCart={goCart}
          cartTotal={total}
          cartCount={cartCount}
          step={orderType ? step : undefined}
        />
      )}

      {view === "cart" && (
        <CartPage
          cart={cart}
          incItem={incItem}
          decItem={decItem}
          removeItem={removeItem}
          orderType={orderType}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          goMenu={goMenu}
          goCheckout={goCheckout}
          changeOrderType={changeOrderType}
        />
      )}

      {view === "checkout" && (
        <CheckoutPage
          orderType={orderType}
          cart={cart}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          onPlaceOrder={placeOrder}
          goCart={goCart}
        />
      )}

      {view === "confirmation" && (
        <ConfirmationPage
          order={lastOrder}
          goHome={() => {
            goHome();
            setOrderType(null);
          }}
        />
      )}

      {/* Customer account area */}
      {view === "customerAuth" && (
        <CustomerAuth onSignup={handleCustomerSignup} onLogin={handleCustomerLogin} onBack={goHome} />
      )}

      {view === "customerOrders" && currentCustomer && (
        <CustomerOrders
          customer={currentCustomer}
          orders={orders}
          onBack={goHome}
          onLogout={handleCustomerLogout}
        />
      )}

      {/* Admin dashboard */}
      {view === "admin" && (currentProfile?.role === "admin" ? (
        <SuperAdminPage
          menuItems={menuItems}
          saveMenu={saveMenu}
          deleteMenuItem={async (id) => { await deleteMenuItem(id); setMenuItems((current) => current.filter((item) => item.id !== id)); }}
          orders={orders}
          updateStatus={updateStatus}
          customers={customers}
          onLogout={handleLogout}
        />
      ) : (
        <AdminLogin onLogin={handleAdminLogin} goHome={goHome} />
      ))}

      {authError && view !== "customerAuth" && view !== "admin" && (
        <div style={{ position: "fixed", left: 20, right: 20, bottom: 20, zIndex: 100, background: "#9A5555", color: "#fff", padding: "12px 16px", borderRadius: 10, maxWidth: 560, margin: "0 auto", fontSize: 13 }}>
          {authError}
        </div>
      )}

      {showChrome && <Footer goMenu={goMenu} goHome={goHome} goAdmin={goLogin} />}
    </div>
  );
}
