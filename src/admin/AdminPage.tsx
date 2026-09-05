import { useState } from "react";
import type { CSSProperties } from "react";
import { ShieldCheck, LogOut, ClipboardList, Utensils } from "lucide-react";
import { T, RESTAURANT } from "../data/site";
import { Button } from "../components/ui";
import AdminOrders from "./AdminOrders";
import AdminMenuManager from "./AdminMenuManager";
import type { MenuItem, Order, OrderStatus } from "../types";

interface AdminPageProps {
  menuItems: MenuItem[];
  saveMenu: (next: MenuItem[]) => void;
  orders: Order[];
  updateStatus: (orderNumber: string, status: OrderStatus) => void;
  onLogout: () => void;
}

function adminTabStyle(active: boolean): CSSProperties {
  return { display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: `1.5px solid ${active ? T.ink : T.line}`, background: active ? T.ink : "#fff", color: active ? "#fff" : T.ink, fontWeight: 600, fontSize: 14, cursor: "pointer" };
}

export default function AdminPage({ menuItems, saveMenu, orders, updateStatus, onLogout }: AdminPageProps) {
  const [tab, setTab] = useState<"orders" | "menu">("orders");
  return (
    <div style={{ background: T.sand, minHeight: "80vh", padding: "30px 20px 80px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.tide, fontWeight: 700, fontSize: 13, marginBottom: 6 }}><ShieldCheck size={16} /> Owner dashboard</div>
            <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 600, color: T.ink, margin: 0 }}>Manage {RESTAURANT.name}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}><LogOut size={14} /> Log out</Button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button onClick={() => setTab("orders")} style={adminTabStyle(tab === "orders")}><ClipboardList size={15} /> Orders</button>
          <button onClick={() => setTab("menu")} style={adminTabStyle(tab === "menu")}><Utensils size={15} /> Menu Management</button>
        </div>

        {tab === "orders" ? <AdminOrders orders={orders} updateStatus={updateStatus} /> : <AdminMenuManager menuItems={menuItems} saveMenu={saveMenu} />}
      </div>
    </div>
  );
}
