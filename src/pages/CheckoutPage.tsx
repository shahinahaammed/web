import { useState } from "react";
import type { ChangeEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { T } from "../data/site";
import { Field, Pill, Button, StepIndicator, Row, navLinkStyle, inputStyle } from "../components/ui";
import { money, orderTypeLabel } from "../utils/helpers";
import type { Cart, CheckoutForm, OrderType } from "../types";

interface CheckoutPageProps {
  orderType: OrderType | null;
  cart: Cart;
  subtotal: number;
  deliveryFee: number;
  total: number;
  onPlaceOrder: (form: CheckoutForm) => void;
  goCart: () => void;
}

type FormErrors = Partial<Record<keyof CheckoutForm, string>>;

export default function CheckoutPage({ orderType, cart, subtotal, deliveryFee, total, onPlaceOrder, goCart }: CheckoutPageProps) {
  const [form, setForm] = useState<CheckoutForm>({
    name: "", phone: "", tableNumber: "", people: "", pickupTime: "",
    area: "", building: "", flat: "", address: "", deliveryInstructions: "", instructions: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const set = (k: keyof CheckoutForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^[\d+\s-]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (orderType === "dine-in") {
      if (!form.tableNumber.trim()) e.tableNumber = "Table number is required.";
      if (!form.people.trim()) e.people = "Number of people is required.";
    }
    if (orderType === "takeaway" && !form.pickupTime.trim()) e.pickupTime = "Pickup time is required.";
    if (orderType === "delivery") {
      if (!form.address.trim()) e.address = "Delivery address is required.";
      if (!form.area.trim()) e.area = "Area is required.";
      if (!form.building.trim()) e.building = "Building / Villa number is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => { if (validate()) onPlaceOrder(form); };

  return (
    <div style={{ background: T.sand, minHeight: "75vh", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <button onClick={goCart} style={{ ...navLinkStyle, color: T.ink, display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}><ArrowLeft size={15} /> Back to cart</button>
        <StepIndicator step={3} />
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 600, color: T.ink, marginBottom: 6 }}>Checkout</h1>
        <Pill tone="tide">{orderTypeLabel(orderType)}</Pill>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 20, marginTop: 24 }} className="tw-checkout-grid">
          <div style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${T.line}`, padding: 22 }}>
            <div style={{ fontWeight: 700, color: T.ink, marginBottom: 14 }}>Customer details</div>
            <Field label="Full name" error={errors.name}><input style={inputStyle} value={form.name} onChange={set("name")} placeholder="Your name" /></Field>
            <Field label="Phone number" error={errors.phone}><input style={inputStyle} value={form.phone} onChange={set("phone")} placeholder="e.g. 050 123 4567" /></Field>

            {orderType === "dine-in" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Table number" error={errors.tableNumber}><input style={inputStyle} value={form.tableNumber} onChange={set("tableNumber")} placeholder="e.g. 12" /></Field>
                <Field label="Number of people" error={errors.people}><input style={inputStyle} type="number" min="1" value={form.people} onChange={set("people")} placeholder="e.g. 2" /></Field>
              </div>
            )}

            {orderType === "takeaway" && (
              <Field label="Pickup time" error={errors.pickupTime}><input style={inputStyle} type="time" value={form.pickupTime} onChange={set("pickupTime")} /></Field>
            )}

            {orderType === "delivery" && (
              <>
                <Field label="Full delivery address" error={errors.address}><input style={inputStyle} value={form.address} onChange={set("address")} placeholder="Street, community" /></Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Area" error={errors.area}><input style={inputStyle} value={form.area} onChange={set("area")} placeholder="e.g. Jumeirah" /></Field>
                  <Field label="Building / Villa number" error={errors.building}><input style={inputStyle} value={form.building} onChange={set("building")} placeholder="e.g. Villa 14" /></Field>
                </div>
                <Field label="Apartment / Flat number (optional)"><input style={inputStyle} value={form.flat} onChange={set("flat")} placeholder="e.g. Flat 302" /></Field>
                <Field label="Delivery instructions (optional)"><input style={inputStyle} value={form.deliveryInstructions} onChange={set("deliveryInstructions")} placeholder="Gate code, landmark..." /></Field>
              </>
            )}

            <Field label="Special instructions (optional)">
              <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.instructions} onChange={set("instructions")} placeholder="Allergies, spice level, extras..." />
            </Field>
          </div>

          <div style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${T.line}`, padding: 22, alignSelf: "start" }}>
            <div style={{ fontWeight: 700, color: T.ink, marginBottom: 14 }}>Order summary</div>
            {Object.values(cart).map((l) => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "6px 0", color: T.ink }}>
                <span>{l.qty} × {l.name}</span><span>{money(l.price * l.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T.line}`, margin: "10px 0" }} />
            <Row label="Subtotal" value={money(subtotal)} />
            {orderType === "delivery" && <Row label="Delivery charge" value={money(deliveryFee)} />}
            <div style={{ borderTop: `1px solid ${T.line}`, margin: "10px 0" }} />
            <Row label="Total" value={money(total)} bold />
            <div style={{ marginTop: 18 }}>
              <Button variant="primary" size="lg" full onClick={submit}>Place Order</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
