import { useState } from "react";
import { ShoppingCart, Menu as MenuIcon, User } from "lucide-react";
import { T, RESTAURANT } from "../data/site";
import { SeaIcon, Button, navLinkStyle } from "./ui";

interface HeaderProps {
  goHome: () => void;
  goMenu: () => void;
  goOwnerLogin: () => void;
  goSuperAdminLogin: () => void;
  goCustomerArea: () => void;
  isCustomerLoggedIn: boolean;
  customerName?: string;
  openOrderType: () => void;
  cartCount: number;
  openCart: () => void;
  dark?: boolean;
}

export default function Header({ goHome, goMenu, goOwnerLogin, goSuperAdminLogin, goCustomerArea, isCustomerLoggedIn, customerName, openOrderType, cartCount, openCart, dark }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountLabel = isCustomerLoggedIn ? `Hi, ${customerName?.split(" ")[0] ?? "there"}` : "My Orders";
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40, background: dark ? "transparent" : T.ink,
      borderBottom: dark ? "none" : "1px solid rgba(255,255,255,.08)",
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={goHome} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: T.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SeaIcon type="fish" size={20} color="#fff" />
          </div>
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 19, color: "#fff" }}>{RESTAURANT.name}</div>
            <div style={{ fontSize: 10.5, letterSpacing: ".08em", color: "rgba(255,255,255,.6)" }}>{RESTAURANT.sub}</div>
          </div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 22 }} className="tw-desktop-nav">
          <button onClick={goHome} style={navLinkStyle}>Home</button>
          <button onClick={goMenu} style={navLinkStyle}>Menu</button>
          <a href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`} style={navLinkStyle}>Call</a>
          <button onClick={goCustomerArea} style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: 5 }}><User size={14} /> {accountLabel}</button>
          <button onClick={goOwnerLogin} style={navLinkStyle}>Owner Login</button>
          <button onClick={goSuperAdminLogin} style={navLinkStyle}>Admin</button>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={openCart} style={{ position: "relative", background: "rgba(255,255,255,.08)", border: "none", borderRadius: 8, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ShoppingCart size={18} color="#fff" />
            {cartCount > 0 && <span style={{ position: "absolute", top: -5, right: -5, background: T.coral, color: "#fff", fontSize: 10.5, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </button>
          <div style={{ display: "none" }} className="tw-mobile-only">
            <button onClick={() => setMobileOpen((v) => !v)} style={{ background: "rgba(255,255,255,.08)", border: "none", borderRadius: 8, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <MenuIcon size={18} color="#fff" />
            </button>
          </div>
          <div className="tw-hide-mobile">
            <Button variant="primary" size="sm" onClick={openOrderType}>Order Now</Button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="tw-mobile-only" style={{ background: T.inkDeep, padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <button onClick={() => { goHome(); setMobileOpen(false); }} style={navLinkStyle}>Home</button>
          <button onClick={() => { goMenu(); setMobileOpen(false); }} style={navLinkStyle}>Menu</button>
          <a href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`} style={navLinkStyle}>Call {RESTAURANT.phone}</a>
          <button onClick={() => { goCustomerArea(); setMobileOpen(false); }} style={navLinkStyle}>{accountLabel}</button>
          <button onClick={() => { goOwnerLogin(); setMobileOpen(false); }} style={navLinkStyle}>Owner Login</button>
          <button onClick={() => { goSuperAdminLogin(); setMobileOpen(false); }} style={navLinkStyle}>Admin</button>
          <Button variant="primary" size="sm" onClick={() => { openOrderType(); setMobileOpen(false); }}>Order Now</Button>
        </div>
      )}
    </header>
  );
}
