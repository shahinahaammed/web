import { useEffect, useState, useCallback } from "react";
import { T, SEED_MENU, DELIVERY_FEE } from "./data/site";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import OrderTypePicker from "./pages/OrderTypePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";

import AdminLogin from "./admin/AdminLogin";
import AdminPage from "./admin/AdminPage";

import CustomerAuth from "./customer/CustomerAuth";
import CustomerOrders from "./customer/CustomerOrders";

import SuperAdminLogin from "./superadmin/SuperAdminLogin";
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

  // Owner (restaurant staff) dashboard auth — menu + orders only
  const [isOwner, setIsOwner] = useState(false);

  // Full-access admin auth — orders + menu + customer accounts
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Customer accounts
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(null);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  useEffect(() => {
    try {
      const rawMenu = localStorage.getItem("tw-menu-items");
      if (rawMenu) setMenuItems(JSON.parse(rawMenu));
      else localStorage.setItem("tw-menu-items", JSON.stringify(SEED_MENU));
    } catch (error) {
      console.error("Failed to load menu:", error);
    }

    try {
      const rawOrders = localStorage.getItem("tw-orders");
      if (rawOrders) setOrders(JSON.parse(rawOrders));
    } catch (error) {
      console.error("Failed to load orders:", error);
    }

    try {
      const rawCustomers = localStorage.getItem("tw-customers");
      if (rawCustomers) setCustomers(JSON.parse(rawCustomers));
    } catch (error) {
      console.error("Failed to load customers:", error);
    }

    try {
      const session = localStorage.getItem("tw-customer-session");
      if (session) setCurrentCustomerId(session);
    } catch (error) {
      console.error("Failed to load customer session:", error);
    }
  }, []);

  // --------------------------------------------------
  // SAVE MENU / ORDERS / CUSTOMERS
  // --------------------------------------------------

  const saveMenu = useCallback((next: MenuItem[]) => {
    setMenuItems(next);
    try {
      localStorage.setItem("tw-menu-items", JSON.stringify(next));
    } catch (error) {
      console.error("Failed to save menu:", error);
    }
  }, []);

  const saveOrders = useCallback((next: Order[]) => {
    setOrders(next);
    try {
      localStorage.setItem("tw-orders", JSON.stringify(next));
    } catch (error) {
      console.error("Failed to save orders:", error);
    }
  }, []);

  const saveCustomers = useCallback((next: Customer[]) => {
    setCustomers(next);
    try {
      localStorage.setItem("tw-customers", JSON.stringify(next));
    } catch (error) {
      console.error("Failed to save customers:", error);
    }
  }, []);

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const goHome = () => setView("home");
  const goMenu = () => setView("menu");
  const goCart = () => setView("cart");
  const goCheckout = () => setView("checkout");

  const goOwnerLogin = () => setView("admin");
  const goSuperAdminLogin = () => setView("superAdmin");

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

  const placeOrder = (form: CheckoutForm) => {
    if (!orderType) return;

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
      customerId: currentCustomerId ?? undefined,
    };

    saveOrders([order, ...orders]);
    setLastOrder(order);
    setCart({});
    setView("confirmation");
  };

  // --------------------------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------------------------

  const updateStatus = (orderNumber: string, status: OrderStatus) => {
    const nextOrders = orders.map((order) =>
      order.orderNumber === orderNumber ? { ...order, status } : order
    );
    saveOrders(nextOrders);
  };

  // --------------------------------------------------
  // CUSTOMER AUTH
  // --------------------------------------------------

  const handleCustomerSignup = (data: Omit<Customer, "id">): { ok: boolean; error?: string } => {
    const exists = customers.some((c) => c.phone === data.phone);
    if (exists) return { ok: false, error: "An account with this phone number already exists." };

    const customer: Customer = { ...data, id: "c" + Date.now() };
    saveCustomers([...customers, customer]);
    setCurrentCustomerId(customer.id);
    try { localStorage.setItem("tw-customer-session", customer.id); } catch { /* ignore */ }
    setView("customerOrders");
    return { ok: true };
  };

  const handleCustomerLogin = (phone: string, password: string): { ok: boolean; error?: string } => {
    const customer = customers.find((c) => c.phone === phone && c.password === password);
    if (!customer) return { ok: false, error: "Incorrect phone number or password." };

    setCurrentCustomerId(customer.id);
    try { localStorage.setItem("tw-customer-session", customer.id); } catch { /* ignore */ }
    setView("customerOrders");
    return { ok: true };
  };

  const handleCustomerLogout = () => {
    setCurrentCustomerId(null);
    try { localStorage.removeItem("tw-customer-session"); } catch { /* ignore */ }
    goHome();
  };

  const currentCustomer = customers.find((c) => c.id === currentCustomerId) ?? null;

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

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  const showChrome = view !== "admin" && view !== "superAdmin";

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
          goOwnerLogin={goOwnerLogin}
          goSuperAdminLogin={goSuperAdminLogin}
          goCustomerArea={goCustomerArea}
          isCustomerLoggedIn={!!currentCustomer}
          customerName={currentCustomer?.name}
          openOrderType={() => startOrder()}
          cartCount={cartCount}
          openCart={goCart}
          dark={view === "home"}
        />
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
        <CustomerAuth
          customers={customers}
          onSignup={handleCustomerSignup}
          onLogin={handleCustomerLogin}
          onBack={goHome}
        />
      )}

      {view === "customerOrders" && currentCustomer && (
        <CustomerOrders
          customer={currentCustomer}
          orders={orders}
          onBack={goHome}
          onLogout={handleCustomerLogout}
        />
      )}

      {/* Owner dashboard — menu + orders */}
      {view === "admin" &&
        (isOwner ? (
          <AdminPage
            menuItems={menuItems}
            saveMenu={saveMenu}
            orders={orders}
            updateStatus={updateStatus}
            onLogout={() => {
              setIsOwner(false);
              goHome();
            }}
          />
        ) : (
          <AdminLogin onLogin={() => setIsOwner(true)} goHome={goHome} />
        ))}

      {/* Full-access admin — menu + orders + customers */}
      {view === "superAdmin" &&
        (isSuperAdmin ? (
          <SuperAdminPage
            menuItems={menuItems}
            saveMenu={saveMenu}
            orders={orders}
            updateStatus={updateStatus}
            customers={customers}
            onLogout={() => {
              setIsSuperAdmin(false);
              goHome();
            }}
          />
        ) : (
          <SuperAdminLogin onLogin={() => setIsSuperAdmin(true)} goHome={goHome} />
        ))}

      {showChrome && <Footer goMenu={goMenu} goHome={goHome} goAdmin={goOwnerLogin} />}
    </div>
  );
}
