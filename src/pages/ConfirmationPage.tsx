import { Check } from "lucide-react";
import { T } from "../data/site";
import { Button, StepIndicator, Row, SeaIcon } from "../components/ui";
import { money, orderTypeLabel, buildWhatsAppLink } from "../utils/helpers";
import type { Order } from "../types";

interface ConfirmationPageProps {
  order: Order | null;
  goHome: () => void;
}

export default function ConfirmationPage({ order, goHome }: ConfirmationPageProps) {
  if (!order) return null;
  const eta = order.orderType === "dine-in" ? "15–20 minutes" : order.orderType === "takeaway" ? `Ready by ${order.form.pickupTime || "30 minutes"}` : "45–60 minutes";
  const waLink = buildWhatsAppLink(order);
  return (
    <div style={{ background: T.sand, minHeight: "80vh", padding: "50px 20px 80px" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <StepIndicator step={4} />
        <div style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${T.line}`, padding: "36px 30px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.tideLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <Check size={28} color={T.tide} />
          </div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 600, color: T.ink, marginBottom: 6 }}>Thank you! Your order has been received.</h1>
          <p style={{ color: T.ink60, marginBottom: 24 }}>Order <strong style={{ color: T.ink }}>#{order.orderNumber}</strong> · {orderTypeLabel(order.orderType)}</p>

          <div style={{ textAlign: "left", background: T.sand, borderRadius: 12, padding: 18, marginBottom: 20 }}>
            {order.items.map((l) => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "5px 0" }}>
                <span>{l.qty} × {l.name}</span><span>{money(l.price * l.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T.line}`, margin: "10px 0" }} />
            <Row label="Total" value={money(order.total)} bold />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", background: T.tideLight, borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 13.5 }}>
            <span style={{ color: T.tide, fontWeight: 600 }}>Estimated {order.orderType === "delivery" ? "delivery" : order.orderType === "takeaway" ? "pickup" : "preparation"} time</span>
            <span style={{ fontWeight: 700, color: T.ink }}>{eta}</span>
          </div>

          <a href={waLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "block", marginBottom: 12 }}>
            <Button variant="primary" size="lg" full style={{ background: "#25D366" }}><SeaIcon type="whatsapp" size={17} color="#fff" /> Send Order to WhatsApp</Button>
          </a>
          <Button variant="ghost" size="md" full onClick={goHome}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
