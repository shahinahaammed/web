import { useState } from "react";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { T } from "../data/site";
import { Pill } from "../components/ui";
import { money, orderTypeLabel } from "../utils/helpers";
import type { Customer, Order } from "../types";

interface CustomersListProps {
  customers: Customer[];
  orders: Order[];
}

export default function CustomersList({ customers, orders }: CustomersListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (customers.length === 0) {
    return (
      <div style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 40, textAlign: "center", color: T.ink60 }}>
        <Users size={24} color={T.ink40} style={{ margin: "0 auto 10px" }} />
        No customer accounts yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {customers.map((c) => {
        const custOrders = orders.filter((o) => o.customerId === c.id).sort((a, b) => b.createdAt - a.createdAt);
        const totalSpent = custOrders.reduce((s, o) => s + o.total, 0);
        const open = openId === c.id;
        return (
          <div key={c.id} style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, overflow: "hidden" }}>
            <button
              onClick={() => setOpenId(open ? null : c.id)}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}
            >
              <div>
                <div style={{ fontWeight: 700, color: T.ink }}>{c.name}</div>
                <div style={{ fontSize: 13, color: T.ink60 }}>{c.phone} · {custOrders.length} order{custOrders.length === 1 ? "" : "s"} · {money(totalSpent)} lifetime</div>
              </div>
              {open ? <ChevronUp size={18} color={T.ink60} /> : <ChevronDown size={18} color={T.ink60} />}
            </button>
            {open && (
              <div style={{ borderTop: `1px solid ${T.line}`, padding: 16 }}>
                {custOrders.length === 0 ? (
                  <p style={{ color: T.ink60, fontSize: 13.5 }}>No orders from this customer yet.</p>
                ) : (
                  custOrders.map((o) => (
                    <div key={o.orderNumber} style={{ padding: "10px 0", borderBottom: `1px solid ${T.line}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 13.5, color: T.ink }}>#{o.orderNumber}</span>
                        <Pill tone="tide">{orderTypeLabel(o.orderType)}</Pill>
                        <span style={{ fontWeight: 700, color: T.coralDeep, fontSize: 13.5 }}>{money(o.total)}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: T.ink60 }}>{o.items.map((l) => `${l.qty}× ${l.name}`).join(", ")}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
