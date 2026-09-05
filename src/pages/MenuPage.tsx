import { useState } from "react";
import { ShoppingCart, Minus, Plus, Search } from "lucide-react";
import { T, CATEGORIES } from "../data/site";
import { SeaIcon, WaveDivider, Pill, Button, StepIndicator, inputStyle, stepperBtn } from "../components/ui";
import { money, orderTypeLabel } from "../utils/helpers";
import type { Cart, MenuItem, OrderType } from "../types";

interface MenuRowProps {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  last: boolean;
}

function MenuRow({ item, qty, onAdd, onInc, onDec, last }: MenuRowProps) {
  const icon = CATEGORIES.find((c) => c.id === item.category)?.icon || "fish";
  return (
    <div style={{ display: "flex", gap: 16, padding: "22px 0", borderBottom: last ? "none" : `1px solid ${T.line}`, opacity: item.available ? 1 : 0.5 }}>
      <div style={{ width: 50, height: 50, borderRadius: 10, background: T.tideLight, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SeaIcon type={icon} size={24} color={T.tide} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 18.5, color: T.ink, whiteSpace: "nowrap" }}>{item.name}</span>
          <span style={{ flex: 1, borderBottom: `1.5px dotted ${T.line}`, marginBottom: 5, minWidth: 20 }} />
          <span style={{ fontWeight: 700, color: T.coralDeep, fontSize: 15.5, whiteSpace: "nowrap" }}>{money(item.price)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
          {item.popular && <Pill tone="brass">Popular</Pill>}
          {!item.available && <Pill tone="coral">Sold out</Pill>}
        </div>
        <p style={{ fontSize: 13.5, color: T.ink60, margin: "6px 0 12px", lineHeight: 1.55, maxWidth: 520 }}>{item.desc}</p>
        {item.available && (
          qty > 0 ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: T.sand, borderRadius: 8, padding: "5px 8px" }}>
              <button onClick={onDec} style={stepperBtn}><Minus size={13} /></button>
              <span style={{ fontWeight: 700, color: T.ink, minWidth: 14, textAlign: "center" }}>{qty}</span>
              <button onClick={onInc} style={stepperBtn}><Plus size={13} /></button>
            </div>
          ) : (
            <Button variant="dark" size="sm" onClick={onAdd}><Plus size={14} /> Add to Cart</Button>
          )
        )}
      </div>
    </div>
  );
}

interface MenuPageProps {
  menuItems: MenuItem[];
  cart: Cart;
  addToCart: (item: MenuItem) => void;
  incItem: (id: string) => void;
  decItem: (id: string) => void;
  orderType: OrderType | null;
  goCart: () => void;
  cartTotal: number;
  cartCount: number;
  step?: number;
}

export default function MenuPage({ menuItems, cart, addToCart, incItem, decItem, orderType, goCart, cartTotal, cartCount, step }: MenuPageProps) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [query, setQuery] = useState("");

  const searching = query.trim() !== "";
  const filtered = menuItems.filter((m) =>
    searching ? m.name.toLowerCase().includes(query.toLowerCase()) : m.category === activeCat
  );
  const activeCategory = CATEGORIES.find((c) => c.id === activeCat);
  const countFor = (id: string) => menuItems.filter((m) => m.category === id).length;

  return (
    <div style={{ background: T.sand, minHeight: "80vh" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 20px 20px" }}>
        {typeof step === "number" && <StepIndicator step={step} />}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
          <div>
            <div style={{ color: T.coralDeep, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{orderType ? `Ordering — ${orderTypeLabel(orderType)}` : "Full menu"}</div>
            <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(28px,3.6vw,40px)", fontWeight: 600, color: T.ink, margin: 0 }}>The Menu</h1>
          </div>
          <div style={{ position: "relative" }}>
            <Search size={15} color={T.ink40} style={{ position: "absolute", left: 12, top: 12 }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes" style={{ ...inputStyle, paddingLeft: 34, width: 220 }} />
          </div>
        </div>

        {/* mobile category chips */}
        <div className="tw-cat-chips" style={{ gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 6 }}>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => { setActiveCat(c.id); setQuery(""); }} style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 22,
              border: `1.5px solid ${activeCat === c.id && !searching ? T.ink : T.line}`, background: activeCat === c.id && !searching ? T.ink : "#fff",
              color: activeCat === c.id && !searching ? "#fff" : T.ink, fontSize: 13.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>
              <SeaIcon type={c.icon} size={15} color={activeCat === c.id && !searching ? "#fff" : T.tide} /> {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tw-menu-layout" style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px 100px", display: "grid", gridTemplateColumns: "230px 1fr", gap: 40, alignItems: "start" }}>
        {/* desktop sidebar */}
        <nav className="tw-cat-sidebar" style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 10, position: "sticky", top: 96 }}>
          {CATEGORIES.map((c) => {
            const active = activeCat === c.id && !searching;
            return (
              <button key={c.id} onClick={() => { setActiveCat(c.id); setQuery(""); }} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9,
                border: "none", borderLeft: active ? `3px solid ${T.coral}` : "3px solid transparent",
                background: active ? T.sand : "transparent", cursor: "pointer", textAlign: "left", marginBottom: 2,
              }}>
                <SeaIcon type={c.icon} size={17} color={active ? T.coral : T.tide} />
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: active ? 700 : 500, color: T.ink }}>{c.label}</span>
                <span style={{ fontSize: 11.5, color: T.ink40 }}>{countFor(c.id)}</span>
              </button>
            );
          })}
        </nav>

        {/* dish list */}
        <div>
          <div style={{ marginBottom: 6 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 600, color: T.ink, margin: 0 }}>
              {searching ? `Results for "${query}"` : activeCategory?.label}
            </h2>
            <div style={{ marginTop: 8, marginBottom: 4 }}><WaveDivider color={T.line} bg="transparent" /></div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: T.ink60 }}>No dishes found.</div>
          ) : (
            <div style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: "4px 22px" }}>
              {filtered.map((item, i) => (
                <MenuRow key={item.id} item={item} qty={cart[item.id]?.qty || 0} last={i === filtered.length - 1}
                  onAdd={() => addToCart(item)} onInc={() => incItem(item.id)} onDec={() => decItem(item.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {cartCount > 0 && (
        <div style={{ position: "sticky", bottom: 16, display: "flex", justifyContent: "center", padding: "0 20px" }}>
          <button onClick={goCart} style={{
            background: T.ink, color: "#fff", border: "none", borderRadius: 40, padding: "14px 26px", display: "flex",
            alignItems: "center", gap: 12, cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,.25)", fontFamily: "Inter, sans-serif",
          }}>
            <ShoppingCart size={17} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>{cartCount} item{cartCount > 1 ? "s" : ""} · {money(cartTotal)}</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: T.tideLight }}>View Cart →</span>
          </button>
        </div>
      )}
    </div>
  );
}
