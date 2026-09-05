import { Utensils, Package, Truck, ArrowLeft } from "lucide-react";
import { T } from "../data/site";
import { OrderTypeCard, StepIndicator, navLinkStyle } from "../components/ui";
import type { OrderType } from "../types";

interface OrderTypePickerProps {
  onPick: (type: OrderType) => void;
  onBack: () => void;
}

export default function OrderTypePicker({ onPick, onBack }: OrderTypePickerProps) {
  return (
    <div style={{ minHeight: "70vh", background: T.sand, padding: "50px 20px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <button onClick={onBack} style={{ ...navLinkStyle, color: T.ink, display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}><ArrowLeft size={15} /> Back</button>
        <StepIndicator step={0} />
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 600, color: T.ink, marginBottom: 10 }}>How would you like to order?</h1>
        <p style={{ color: T.ink60, marginBottom: 30 }}>Pick one to start browsing today's menu.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} className="tw-3col">
          <OrderTypeCard icon={<Utensils size={22} color={T.tide} />} title="Dine-In" desc="Table service, order at your seat." onClick={() => onPick("dine-in")} />
          <OrderTypeCard icon={<Package size={22} color={T.tide} />} title="Takeaway" desc="Order ahead and collect." onClick={() => onPick("takeaway")} />
          <OrderTypeCard icon={<Truck size={22} color={T.tide} />} title="Home Delivery" desc="We bring it to your door." onClick={() => onPick("delivery")} />
        </div>
      </div>
    </div>
  );
}
