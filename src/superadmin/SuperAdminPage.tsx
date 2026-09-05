import { useState } from "react";
import type { CSSProperties } from "react";
import { ShieldCheck, LogOut, ClipboardList, Utensils, Users } from "lucide-react";
import { T, RESTAURANT } from "../data/site";
import { Button } from "../components/ui";
import AdminOrders from "../admin/AdminOrders";
import AdminMenuManager from "../admin/AdminMenuManager";
import CustomersList from "./CustomersList";
import type { Customer, MenuItem, Order, OrderStatus } from "../types";

interface SuperAdminPageProps {
  menuItems: MenuItem[];
  saveMenu: (next: MenuItem[]) => void;
  orders: Order[];
  updateStatus: (orderNumber: string, status: OrderStatus) => void;
  customers: Customer[];
  onLogout: () => void;
}

type Tab = "orders" | "menu" | "customers";

function tabStyle(active: boolean): CSSProperties {
  return { display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: `1.5px solid ${active ? T.ink : T.line}`, background: active ? T.ink : "#fff", color: active ? "#fff" : T.ink, fontWeight: 600, fontSize: 14, cursor: "pointer" };
}

export default function SuperAdminPage({ menuItems, saveMenu, orders, updateStatus, customers, onLogout }: SuperAdminPageProps) {
  const [tab, setTab] = useState<Tab>("orders");
  return (
    <div style={{ background: T.sand, minHeight: "80vh", padding: "30px 20px 80px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.ink, fontWeight: 700, fontSize: 13, marginBottom: 6 }}><ShieldCheck size={16} /> Full-access admin</div>
            <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 600, color: T.ink, margin: 0 }}>Admin — {RESTAURANT.name}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}><LogOut size={14} /> Log out</Button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <button onClick={() => setTab("orders")} style={tabStyle(tab === "orders")}><ClipboardList size={15} /> Orders</button>
          <button onClick={() => setTab("menu")} style={tabStyle(tab === "menu")}><Utensils size={15} /> Menu Management</button>
          <button onClick={() => setTab("customers")} style={tabStyle(tab === "customers")}><Users size={15} /> Customers ({customers.length})</button>
        </div>

        {tab === "orders" && <AdminOrders orders={orders} updateStatus={updateStatus} />}
        {tab === "menu" && <AdminMenuManager menuItems={menuItems} saveMenu={saveMenu} />}
        {tab === "customers" && <CustomersList customers={customers} orders={orders} />}
      </div>
    </div>
  );
}
