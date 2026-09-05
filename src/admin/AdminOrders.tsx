import { useState } from "react";
import { T, STATUS_FLOW, STATUS_COLOR } from "../data/site";
import { Pill } from "../components/ui";
import { money, orderTypeLabel } from "../utils/helpers";
import type { Order, OrderStatus } from "../types";

interface AdminOrdersProps {
  orders: Order[];
  updateStatus: (orderNumber: string, status: OrderStatus) => void;
}

export default function AdminOrders({ orders, updateStatus }: AdminOrdersProps) {
  const [tab, setTab] = useState<OrderStatus>("New");
  const counts = STATUS_FLOW.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }), {});
  const list = orders.filter((o) => o.status === tab).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18 }}>
        {STATUS_FLOW.map((s) => (
          <button key={s} onClick={() => setTab(s)} style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 20,
            border: `1.5px solid ${tab === s ? STATUS_COLOR[s] : T.line}`, background: tab === s ? STATUS_COLOR[s] : "#fff",
            color: tab === s ? "#fff" : T.ink, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          }}>{s} <span style={{ opacity: .85 }}>({counts[s] || 0})</span></button>
        ))}
      </div>

      {list.length === 0 ? (
        <div style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 40, textAlign: "center", color: T.ink60 }}>No {tab.toLowerCase()} orders.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((o) => (
            <div key={o.orderNumber} style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: T.ink }}>#{o.orderNumber}</span>
                    <Pill tone="tide">{orderTypeLabel(o.orderType)}</Pill>
                  </div>
                  <div style={{ fontSize: 13, color: T.ink60, marginTop: 4 }}>{o.form.name} · {o.form.phone}</div>
                  <div style={{ fontSize: 12.5, color: T.ink40, marginTop: 2 }}>{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ fontWeight: 700, color: T.coralDeep, fontSize: 16 }}>{money(o.total)}</div>
              </div>
              <div style={{ margin: "12px 0", fontSize: 13, color: T.ink }}>
                {o.items.map((l) => `${l.qty}× ${l.name}`).join(", ")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, color: T.ink60 }}>Move to:</span>
                {STATUS_FLOW.filter((s) => s !== o.status).map((s) => (
                  <button key={s} onClick={() => updateStatus(o.orderNumber, s)} style={{
                    fontSize: 12, fontWeight: 600, padding: "5px 11px", borderRadius: 16, cursor: "pointer",
                    border: `1.5px solid ${STATUS_COLOR[s]}`, background: "#fff", color: STATUS_COLOR[s],
                  }}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
