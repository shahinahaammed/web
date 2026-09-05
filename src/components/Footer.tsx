import type { CSSProperties } from "react";
import { T, RESTAURANT } from "../data/site";
import { SeaIcon } from "./ui";

interface FooterProps {
  goMenu: () => void;
  goHome: () => void;
  goAdmin: () => void;
}

export default function Footer({ goMenu, goHome, goAdmin }: FooterProps) {
  return (
    <footer style={{ background: T.inkDeep, padding: "50px 20px 26px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 36 }} className="tw-3col">
        <div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{RESTAURANT.name} {RESTAURANT.sub}</div>
          <p style={{ color: "rgba(255,255,255,.55)", fontSize: 13.5, lineHeight: 1.6, maxWidth: 320 }}>{RESTAURANT.tagline}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <a href={RESTAURANT.instagram} target="_blank" rel="noreferrer" style={socialIconStyle}><SeaIcon type="instagram" size={16} color="#fff" /></a>
            <a href={RESTAURANT.facebook} target="_blank" rel="noreferrer" style={socialIconStyle}><SeaIcon type="facebook" size={16} color="#fff" /></a>
            <a href={`https://wa.me/${RESTAURANT.whatsapp}`} target="_blank" rel="noreferrer" style={socialIconStyle}><SeaIcon type="whatsapp" size={16} color="#fff" /></a>
          </div>
        </div>
        <div>
          <div style={footerHead}>Explore</div>
          <button onClick={goHome} style={footerLink}>Home</button>
          <button onClick={goMenu} style={footerLink}>Menu</button>
          <button onClick={goAdmin} style={footerLink}>Owner Login</button>
        </div>
        <div>
          <div style={footerHead}>Contact</div>
          <div style={{ ...footerLink, cursor: "default" }}>{RESTAURANT.phone}</div>
          <div style={{ ...footerLink, cursor: "default" }}>{RESTAURANT.address}</div>
        </div>
      </div>
      <div style={{ maxWidth: 1180, margin: "34px auto 0", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 18, fontSize: 12, color: "rgba(255,255,255,.4)" }}>
        © {new Date().getFullYear()} {RESTAURANT.name} {RESTAURANT.sub}. All rights reserved.
      </div>
    </footer>
  );
}

const footerHead: CSSProperties = { color: "rgba(255,255,255,.4)", fontSize: 12, fontWeight: 700, letterSpacing: ".04em", marginBottom: 14 };
const footerLink: CSSProperties = { display: "block", background: "none", border: "none", color: "rgba(255,255,255,.75)", fontSize: 14, marginBottom: 11, cursor: "pointer", padding: 0, textAlign: "left", fontFamily: "Inter, sans-serif" };
const socialIconStyle: CSSProperties = { width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center" };
