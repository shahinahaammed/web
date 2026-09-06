import { ArrowLeft, LogOut, Package } from "lucide-react";
import { T, STATUS_COLOR } from "../data/site";
import { Pill, Button, Row } from "../components/ui";
import { money, orderTypeLabel } from "../utils/helpers";
import type { Customer, Order } from "../types";

interface CustomerOrdersProps {
  customer: Customer;
  orders: Order[];
  onBack: () => void;
  onLogout: () => void;
}

export default function CustomerOrders({ customer, orders, onBack, onLogout }: CustomerOrdersProps) {
  const myOrders = orders.filter((o) => o.customerId === customer.id).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div style={{ background: T.sand, minHeight: "75vh", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: T.ink, display: "flex", alignItems: "center", gap: 6, marginBottom: 20, cursor: "pointer", fontSize: 14.5, fontFamily: "Inter, sans-serif" }}>
          <ArrowLeft size={15} /> Back to menu
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 600, color: T.ink, marginBottom: 6 }}>My Orders</h1>
            <p style={{ color: T.ink60, fontSize: 14 }}>Signed in as {customer.name} · {customer.phone}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}><LogOut size={14} /> Log out</Button>
        </div>

        {myOrders.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 14, padding: 50, textAlign: "center", border: `1.5px solid ${T.line}` }}>
            <Package size={28} color={T.ink40} style={{ margin: "0 auto 12px" }} />
            <p style={{ color: T.ink60 }}>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {myOrders.map((o) => (
              <div key={o.orderNumber} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${T.line}`, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, color: T.ink }}>#{o.orderNumber}</span>
                      <Pill tone="tide">{orderTypeLabel(o.orderType)}</Pill>
                    </div>
                    <div style={{ fontSize: 12.5, color: T.ink40, marginTop: 4 }}>{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 16, color: "#fff", background: STATUS_COLOR[o.status] }}>{o.status}</span>
                </div>
                <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
                  {o.items.map((l) => (
                    <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "4px 0", color: T.ink }}>
                      <span>{l.qty} × {l.name}</span><span>{money(l.price * l.qty)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: `1px solid ${T.line}`, margin: "8px 0" }} />
                  <Row label="Total" value={money(o.total)} bold />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
