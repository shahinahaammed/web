import { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { T, SEED_MENU, DELIVERY_FEE } from "./data/site";
import { supabase } from "./lib/supabase";
import {
  adminLogin,
  createOrder,
  customerLogin,
  customerSignup,
  deleteMenuItem,
  getProfile,
  getSession,
  loadCustomers,
  loadMenu,
  loadOrders,
  logout,
  updateOrderStatus,
  upsertMenu,
} from "./lib/backend";
import { getErrorMessage } from "./utils/helpers";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import OrderTypePicker from "./pages/OrderTypePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AdminLogin from "./admin/AdminLogin";
import CustomerAuth from "./customer/CustomerAuth";
import CustomerOrders from "./customer/CustomerOrders";
import SuperAdminPage from "./superadmin/SuperAdminPage";

import "./styles.css";

import type {
  OrderType,
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  CheckoutForm,
  Customer,
} from "./types";

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>(SEED_MENU);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [currentProfile, setCurrentProfile] = useState<
    (Customer & { role: "customer" | "admin" }) | null
  >(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const refreshBackendData = useCallback(async (withOrders = false) => {
    const menu = await loadMenu();
    setMenuItems(menu.length ? menu : SEED_MENU);

    if (withOrders) {
      setOrders(await loadOrders());
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const session = await getSession();

        if (session?.user && mounted) {
          const profile = await getProfile(session.user.id);
          setCurrentProfile(profile);

          if (profile.role === "admin") {
            navigate("/admin", { replace: true });
          } else if (location.pathname === "/customer/login" || location.pathname === "/login") {
            navigate("/customer/orders", { replace: true });
          }

          await refreshBackendData(true);
        } else {
          await refreshBackendData(false);
        }
      } catch (error) {
        console.error("Backend initialization failed:", error);
        setAuthError(getErrorMessage(error, "Could not connect to the backend."));
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setCurrentProfile(null);
        return;
      }

      try {
        const profile = await getProfile(session.user.id);
        setCurrentProfile(profile);
      } catch (error) {
        console.error("Could not load profile:", error);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate, refreshBackendData]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setAuthError("");
  }, [location.pathname]);

  const saveMenu = useCallback(async (next: MenuItem[]) => {
    try {
      setMenuItems(await upsertMenu(next));
    } catch (error) {
      setAuthError(getErrorMessage(error, "Could not save menu."));
    }
  }, []);

  // ---------------- Navigation ----------------
  const goHome = () => navigate("/");
  // Opening Menu always starts with the order-type selection layer.
  // After the customer chooses Dine-In, Takeaway, or Home Delivery,
  // OrderTypePicker navigates to /menu.
  const goMenu = () => navigate("/order");
  const goCart = () => navigate("/cart");
  const goCheckout = () => navigate("/checkout");
  const goLogin = () => navigate("/customer/login");
  const goAdmin = () => navigate("/admin/login");

  const continueAsGuest = () => {
    if (orderType && Object.keys(cart).length > 0) {
      navigate("/checkout");
    } else {
      navigate("/order");
    }
  };

  // ---------------- Order type ----------------
  const startOrder = (type?: OrderType) => {
    if (type) {
      setOrderType(type);
      navigate("/menu");
    } else {
      navigate("/order");
    }
  };

  const pickOrderType = (type: OrderType) => {
    setOrderType(type);
    navigate("/menu");
  };

  const changeOrderType = () => navigate("/order");

  // ---------------- Cart ----------------
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

  // ---------------- Totals ----------------
  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const deliveryFee = orderType === "delivery" && cartCount > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  // ---------------- Orders ----------------
  const placeOrder = async (form: CheckoutForm) => {
    if (!orderType) {
      setAuthError("Please select an order type.");
      navigate("/order");
      return;
    }

    const orderNumber = "TW-" + Date.now().toString().slice(-6);
    const order: Order = {
      orderNumber,
      orderType,
      form,
      items: Object.values(cart),
      subtotal,
      deliveryFee,
      total,
      status: "New",
      createdAt: Date.now(),
      customerId: currentProfile?.role === "customer" ? currentProfile.id : undefined,
    };

    try {
      await createOrder(order);
      setOrders((current) => [order, ...current]);
      setLastOrder(order);
      setCart({});
      setAuthError("");
      navigate("/order-confirmed", { state: { order } });
    } catch (error) {
      setAuthError(getErrorMessage(error, "Could not place your order."));
    }
  };

  const updateStatus = async (orderNumber: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderNumber, status);
      setOrders((current) =>
        current.map((order) =>
          order.orderNumber === orderNumber ? { ...order, status } : order
        )
      );
    } catch (error) {
      setAuthError(getErrorMessage(error, "Could not update the order."));
    }
  };

  // ---------------- Customer auth ----------------
  const handleCustomerSignup = async (name: string, email: string, password: string) => {
    try {
      setAuthError("");
      const profile = await customerSignup(name, email, password);
      setCurrentProfile(profile);
      setOrders(await loadOrders());

      if (orderType && Object.keys(cart).length > 0) {
        navigate("/checkout");
      } else {
        navigate("/customer/orders");
      }

      return { ok: true };
    } catch (error) {
      const message = getErrorMessage(error, "Could not create your account.");
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

      if (orderType && Object.keys(cart).length > 0) {
        navigate("/checkout");
      } else {
        navigate("/customer/orders");
      }

      return { ok: true };
    } catch (error) {
      const message = getErrorMessage(error, "Incorrect email or password.");
      setAuthError(message);
      return { ok: false, error: message };
    }
  };

  // ---------------- Admin auth ----------------
  const handleAdminLogin = async (email: string, password: string) => {
    try {
      setAuthError("");
      const profile = await adminLogin(email, password);
      setCurrentProfile(profile);

      const [orderList, customerList] = await Promise.all([
        loadOrders(),
        loadCustomers(),
      ]);

      setOrders(orderList);
      setCustomers(customerList);
      navigate("/admin", { replace: true });

      return { ok: true };
    } catch (error) {
      const message = getErrorMessage(error, "Incorrect admin credentials.");
      setAuthError(message);
      return { ok: false, error: message };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
    setCurrentProfile(null);
    navigate("/", { replace: true });
  };

  const currentCustomer =
    currentProfile?.role === "customer"
      ? {
          id: currentProfile.id,
          name: currentProfile.name,
          phone: currentProfile.phone,
        }
      : null;

  const showChrome = !location.pathname.startsWith("/admin");
  const stepMap: Record<string, number> = {
    "/order": 0,
    "/menu": 1,
    "/cart": 2,
    "/checkout": 3,
    "/order-confirmed": 4,
  };
  const step = stepMap[location.pathname];

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: T.sand,
          color: T.ink60,
        }}
      >
        Connecting…
      </div>
    );
  }

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
          openOrderType={() => startOrder()}
          cartCount={cartCount}
          openCart={goCart}
          dark={false}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<HomePage startOrder={startOrder} goMenu={goMenu} menuItems={menuItems} />}
        />

        <Route
          path="/order"
          element={<OrderTypePicker onPick={pickOrderType} onBack={goHome} />}
        />

        <Route
          path="/menu"
          element={
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
          }
        />

        <Route
          path="/cart"
          element={
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
          }
        />

        <Route
          path="/checkout"
          element={
            <CheckoutPage
              orderType={orderType}
              cart={cart}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              onPlaceOrder={placeOrder}
              goCart={goCart}
              customer={currentCustomer}
            />
          }
        />

        <Route
          path="/order-confirmed"
          element={
            <ConfirmationPage
              order={lastOrder}
              goHome={() => {
                setOrderType(null);
                navigate("/");
              }}
            />
          }
        />

        {/* Customer-only authentication. Admin login is a separate route. */}
        <Route
          path="/customer/login"
          element={
            <CustomerAuth
              onSignup={handleCustomerSignup}
              onLogin={handleCustomerLogin}
              onBack={goHome}
              onContinueAsGuest={continueAsGuest}
            />
          }
        />

        {/* Backward-compatible customer login URL. */}
        <Route path="/login" element={<Navigate to="/customer/login" replace />} />

        <Route
          path="/customer/orders"
          element={
            currentCustomer ? (
              <CustomerOrders
                customer={currentCustomer}
                orders={orders}
                onBack={goHome}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/customer/login" replace />
            )
          }
        />

        <Route
          path="/admin/login"
          element={
            currentProfile?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} goHome={goHome} />
            )
          }
        />

        <Route
          path="/admin"
          element={
            currentProfile?.role === "admin" ? (
              <SuperAdminPage
                menuItems={menuItems}
                saveMenu={saveMenu}
                deleteMenuItem={async (id) => {
                  await deleteMenuItem(id);
                  setMenuItems((current) => current.filter((item) => item.id !== id));
                }}
                orders={orders}
                updateStatus={updateStatus}
                customers={customers}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {authError &&
        !location.pathname.startsWith("/admin") &&
        location.pathname !== "/customer/login" && (
          <div
            style={{
              position: "fixed",
              left: 20,
              right: 20,
              bottom: 20,
              zIndex: 100,
              background: "#9A5555",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: 10,
              maxWidth: 560,
              margin: "0 auto",
              fontSize: 13,
            }}
          >
            {authError}
          </div>
        )}

      {showChrome && (
        <Footer goMenu={goMenu} goHome={goHome} goAdmin={goAdmin} />
      )}
    </div>
  );
}
