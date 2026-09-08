import { T } from "../data/site";

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
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: dark ? "transparent" : T.cream,
        borderBottom: dark
          ? "1px solid rgba(255,255,255,0.15)"
          : `1px solid ${T.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={goHome}
          style={{
            border: 0,
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            color: dark ? "#fff" : T.ink,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Bayah Seafood
        </button>

        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={goHome}
            style={{
              border: 0,
              background: "transparent",
              color: dark ? "#fff" : T.ink,
              cursor: "pointer",
              padding: "8px 10px",
              fontSize: 14,
            }}
          >
            Home
          </button>

          <button
            type="button"
            onClick={goMenu}
            style={{
              border: 0,
              background: "transparent",
              color: dark ? "#fff" : T.ink,
              cursor: "pointer",
              padding: "8px 10px",
              fontSize: 14,
            }}
          >
            Menu
          </button>

          <button
            type="button"
            onClick={openOrderType}
            style={{
              border: 0,
              background: "transparent",
              color: dark ? "#fff" : T.ink,
              cursor: "pointer",
              padding: "8px 10px",
              fontSize: 14,
            }}
          >
            Order
          </button>

          <button
            type="button"
            onClick={goLogin}
            style={{
              border: 0,
              background: "transparent",
              color: dark ? "#fff" : T.ink,
              cursor: "pointer",
              padding: "8px 10px",
              fontSize: 14,
            }}
          >
            Login
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            style={{
              position: "relative",
              border: `1px solid ${
                dark ? "rgba(255,255,255,0.35)" : T.line
              }`,
              background: dark ? "rgba(255,255,255,0.08)" : T.cream,
              color: dark ? "#fff" : T.ink,
              cursor: "pointer",
              padding: "9px 13px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Cart

            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -7,
                  right: -7,
                  minWidth: 20,
                  height: 20,
                  padding: "0 5px",
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  background: T.ink,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}