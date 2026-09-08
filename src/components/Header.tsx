import { useState } from "react";
import type { ReactNode } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { T } from "../data/site";
import logo from "../assets/logo-cropped.png";

type HeaderProps = {
  goHome: () => void;
  goMenu: () => void;
  goLogin: () => void;
  openOrderType: () => void;
  cartCount: number;
  openCart: () => void;
  dark?: boolean;
};

export default function Header({
  goHome,
  goMenu,
  goLogin,
  openOrderType,
  cartCount,
  openCart,
  dark = false,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const textColor = dark ? "#fff" : T.ink;

  const navigate = (action: () => void) => {
    action();
    setMobileOpen(false);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: dark ? T.inkDeep : T.cream,
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,.12)" : T.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 20px",
          minHeight: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <button
          type="button"
          onClick={() => navigate(goHome)}
          aria-label="Bayah Seafood home"
          style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img src={logo} alt="Bayah Seafood" style={{ width: 150, height: "auto", display: "block" }} />
        </button>

        <nav className="tw-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <NavButton color={textColor} onClick={goHome}>Home</NavButton>
          <NavButton color={textColor} onClick={goMenu}>Menu</NavButton>
          <NavButton color={textColor} onClick={openOrderType}>Order</NavButton>
          <NavButton color={textColor} onClick={goLogin}>Customer Login</NavButton>
          <CartButton color={textColor} count={cartCount} onClick={openCart} />
        </nav>

        <div className="tw-mobile-only" style={{ display: "none", alignItems: "center", gap: 8 }}>
          <CartButton color={textColor} count={cartCount} onClick={openCart} />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            style={{ width: 42, height: 42, borderRadius: 9, border: `1px solid ${dark ? "rgba(255,255,255,.25)" : T.line}`, background: dark ? "rgba(255,255,255,.06)" : T.cream, color: textColor, display: "grid", placeItems: "center", cursor: "pointer" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,.12)" : T.line}`, background: dark ? T.inkDeep : T.cream, padding: "8px 20px 14px" }}>
          <nav style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 4 }}>
            <MobileButton color={textColor} onClick={() => navigate(goHome)}>Home</MobileButton>
            <MobileButton color={textColor} onClick={() => navigate(goMenu)}>Menu</MobileButton>
            <MobileButton color={textColor} onClick={() => navigate(openOrderType)}>Order Now</MobileButton>
            <MobileButton color={textColor} onClick={() => navigate(goLogin)}>Customer Login</MobileButton>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavButton({ color, onClick, children }: { color: string; onClick: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} style={{ border: 0, background: "transparent", color, cursor: "pointer", padding: "10px 12px", fontSize: 14, fontWeight: 500 }}>{children}</button>;
}

function MobileButton({ color, onClick, children }: { color: string; onClick: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} style={{ border: 0, borderRadius: 8, background: "transparent", color, cursor: "pointer", padding: "12px 10px", textAlign: "left", fontSize: 14, fontWeight: 600 }}>{children}</button>;
}

function CartButton({ color, count, onClick }: { color: string; count: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={`Cart${count ? `, ${count} items` : ""}`} style={{ position: "relative", width: 44, height: 42, borderRadius: 9, border: `1px solid ${color === "#171717" ? T.line : "rgba(255,255,255,.22)"}`, background: color === "#171717" ? T.cream : "rgba(255,255,255,.06)", color, cursor: "pointer", display: "grid", placeItems: "center" }}>
      <ShoppingCart size={18} />
      {count > 0 && <span style={{ position: "absolute", top: -6, right: -6, minWidth: 20, height: 20, padding: "0 5px", borderRadius: 999, display: "grid", placeItems: "center", background: T.coral, color: "#fff", fontSize: 11, fontWeight: 700 }}>{count}</span>}
    </button>
  );
}
