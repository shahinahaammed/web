import React, { type CSSProperties, type ReactNode, type ButtonHTMLAttributes } from "react";
import { ChevronRight } from "lucide-react";
import { T } from "../data/site";
import type { IconType } from "../types";

/* ============================================================
   SEA ICON — hand-drawn single-line seafood motif
   ============================================================ */
interface SeaIconProps {
  type?: IconType;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function SeaIcon({ type = "fish", size = 28, color = T.ink, strokeWidth = 1.6 }: SeaIconProps) {
  const p = {
    fill: "none" as const,
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<IconType, React.JSX.Element> = {
    fish: <svg viewBox="0 0 48 48" width={size} height={size}><path {...p} d="M6 24c6-10 16-14 26-11-3 3-4.5 7-4.5 11s1.5 8 4.5 11c-10 3-20-1-26-11Z" /><path {...p} d="M32 13c4 3 8 7 10 11-2 4-6 8-10 11" /><circle cx="14" cy="21" r="1.4" fill={color} stroke="none" /></svg>,
    prawn: <svg viewBox="0 0 48 48" width={size} height={size}><path {...p} d="M10 30c0-9 8-18 20-19 5-.4 9 1 9 4s-4 4-8 3.6" /><path {...p} d="M31 19c3 1 6 3 6 6s-4 5-9 4" /><path {...p} d="M10 30c-2 3-2 6 0 8 3 3 8 2 10-1" /><path {...p} d="M14 26l-4-3M17 22l-4-3M20 18l-3-3" /></svg>,
    crab: <svg viewBox="0 0 48 48" width={size} height={size}><ellipse {...p} cx="24" cy="24" rx="12" ry="8" /><path {...p} d="M14 20 6 14M12 26 4 27M34 20l8-6M36 26l8 1" /><path {...p} d="M18 16c-1-3 0-6 2-7M30 16c1-3 0-6-2-7" /><path {...p} d="M16 32l-3 6M32 32l3 6" /></svg>,
    lobster: <svg viewBox="0 0 48 48" width={size} height={size}><path {...p} d="M22 8c-2 3-2 6 0 9" /><path {...p} d="M26 8c2 3 2 6 0 9" /><ellipse {...p} cx="24" cy="22" rx="6" ry="7" /><path {...p} d="M24 29v11" /><path {...p} d="M24 29c-6 2-9 6-9 11M24 29c6 2 9 6 9 11" /><path {...p} d="M17 15c-4-1-7 1-8 4M31 15c4-1 7 1 8 4" /></svg>,
    squid: <svg viewBox="0 0 48 48" width={size} height={size}><ellipse {...p} cx="24" cy="16" rx="8" ry="10" /><path {...p} d="M17 24c-1 6-3 9-6 14M20 25c-1 7-2 10-3 15M24 26v16M28 25c1 7 2 10 3 15M31 24c1 6 3 9 6 14" /></svg>,
    bowl: <svg viewBox="0 0 48 48" width={size} height={size}><path {...p} d="M8 22h32c0 8-7 15-16 15S8 30 8 22Z" /><path {...p} d="M14 22c1-6 5-10 10-10s9 4 10 10" /></svg>,
    plate: <svg viewBox="0 0 48 48" width={size} height={size}><circle {...p} cx="24" cy="24" r="15" /><circle {...p} cx="24" cy="24" r="9" /></svg>,
    cup: <svg viewBox="0 0 48 48" width={size} height={size}><path {...p} d="M14 10h20l-2 24a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4L14 10Z" /><path {...p} d="M11 10h26" /><path {...p} d="M18 16c1 2 3 2 4 0s3-2 4 0 3 2 4 0" /></svg>,
    dessert: <svg viewBox="0 0 48 48" width={size} height={size}><path {...p} d="M10 20c0-6 6-11 14-11s14 5 14 11" /><path {...p} d="M8 20h32l-3 6H11l-3-6Z" /><path {...p} d="M13 26l2 12h18l2-12" /></svg>,
    whatsapp: <svg viewBox="0 0 32 32" width={size} height={size} fill={color}><path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.4.7 4.65 1.9 6.53L4 29l7.62-1.87A11.94 11.94 0 0 0 16.02 27C22.64 27 28 21.6 28 14.98 28 8.4 22.64 3 16.02 3Zm0 21.8c-2.03 0-3.9-.58-5.48-1.58l-.39-.24-4.52 1.11 1.13-4.42-.26-.4a9.72 9.72 0 0 1-1.6-5.27c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.02 6.93 2.87a9.71 9.71 0 0 1 2.87 6.93c0 5.42-4.4 9.8-9.5 9.8Zm5.36-7.34c-.29-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.15-.18.2-.3.29-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.06 3.16 5 4.43.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.09 1.75-.72 2-1.41.24-.7.24-1.29.17-1.41-.07-.13-.27-.2-.56-.35Z" /></svg>,
    instagram: <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1" fill={color} stroke="none" /></svg>,
    facebook: <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M14 22v-8h2.7l.4-3.3H14V8.5c0-.96.27-1.6 1.65-1.6H17V3.9C16.72 3.86 15.76 3.78 14.64 3.78c-2.34 0-3.94 1.43-3.94 4.05V10.7H8v3.3h2.7V22h3.3Z" /></svg>,
  };
  return paths[type] ?? paths.fish;
}

/* ============================================================
   WAVE DIVIDER
   ============================================================ */
interface WaveDividerProps {
  color?: string;
  flip?: boolean;
  bg?: string;
}

export function WaveDivider({ color = T.sand, flip = false, bg = "transparent" }: WaveDividerProps) {
  return (
    <div style={{ lineHeight: 0, background: bg, transform: flip ? "scaleY(-1)" : "none" }}>
      <svg viewBox="0 0 1200 60" width="100%" height="44" preserveAspectRatio="none">
        <path d="M0 30 C 150 60 350 0 600 24 C 850 48 1050 6 1200 28 L1200 60 L0 60 Z" fill={color} />
      </svg>
    </div>
  );
}

/* ============================================================
   PILL
   ============================================================ */
interface PillProps {
  children: ReactNode;
  tone?: "tide" | "brass" | "coral";
}

export function Pill({ children, tone = "tide" }: PillProps) {
  const bg = tone === "tide" ? T.tideLight : tone === "brass" ? "#F4E9CE" : "#F6DCD1";
  const fg = tone === "tide" ? T.tide : tone === "brass" ? "#8C6A1E" : T.coralDeep;
  return <span style={{ background: bg, color: fg, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: ".01em" }}>{children}</span>;
}

/* ============================================================
   BUTTON
   ============================================================ */
type ButtonVariant = "primary" | "dark" | "outline" | "outlineLight" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  style?: CSSProperties;
}

export function Button({ children, onClick, variant = "primary", size = "md", full = false, disabled = false, type = "button", style = {} }: ButtonProps) {
  const sizes: Record<ButtonSize, string> = { sm: "8px 14px", md: "12px 22px", lg: "16px 30px" };
  const fonts: Record<ButtonSize, number> = { sm: 13, md: 15, lg: 16.5 };
  const base: CSSProperties = {
    fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: fonts[size], padding: sizes[size],
    borderRadius: 8, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: full ? "100%" : "auto", transition: "transform .12s ease, opacity .12s ease",
    opacity: disabled ? 0.5 : 1, ...style,
  };
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: { background: T.coral, color: "#fff" },
    dark: { background: T.ink, color: "#fff" },
    outline: { background: "transparent", color: T.ink, border: `1.5px solid ${T.ink}` },
    outlineLight: { background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.6)" },
    ghost: { background: T.sand, color: T.ink },
    danger: { background: "#F6DCD1", color: T.coralDeep },
  };
  return (
    <button type={type} disabled={disabled} onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
      {children}
    </button>
  );
}

/* ============================================================
   FIELD
   ============================================================ */
interface FieldProps {
  label: ReactNode;
  children: ReactNode;
  error?: string;
}

export function Field({ label, children, error }: FieldProps) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 6 }}>{label}</span>
      {children}
      {error && <span style={{ display: "block", fontSize: 12, color: T.coralDeep, marginTop: 4 }}>{error}</span>}
    </label>
  );
}

/* ============================================================
   STEP INDICATOR — true ordering sequence
   ============================================================ */
interface StepIndicatorProps {
  step: number;
}

export function StepIndicator({ step }: StepIndicatorProps) {
  const steps = ["Order type", "Menu", "Cart", "Checkout", "Confirmed"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11.5, fontWeight: 700, background: i <= step ? T.coral : T.sand, color: i <= step ? "#fff" : T.ink60,
            }}>{i + 1}</div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: i <= step ? T.ink : T.ink40 }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ width: 16, height: 1.5, background: T.line }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ============================================================
   ORDER TYPE CARD
   ============================================================ */
interface OrderTypeCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}

export function OrderTypeCard({ icon, title, desc, onClick }: OrderTypeCardProps) {
  return (
    <button onClick={onClick} style={{
      background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: "26px 22px", textAlign: "left",
      cursor: "pointer", display: "flex", flexDirection: "column", gap: 12, width: "100%",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.coral; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 10, background: T.tideLight, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 19, fontWeight: 600, color: T.ink, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: T.ink60, lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.coral, fontSize: 13.5, fontWeight: 600 }}>Choose <ChevronRight size={15} /></div>
    </button>
  );
}

/* ============================================================
   SECTION HEADING
   ============================================================ */
interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ color: T.coralDeep, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{eyebrow}</div>
        <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "clamp(24px,3vw,32px)", color: T.ink, margin: 0 }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* ============================================================
   ROW — label/value line used in cart, checkout, confirmation
   ============================================================ */
interface RowProps {
  label: string;
  value: string;
  bold?: boolean;
}

export function Row({ label, value, bold = false }: RowProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: bold ? 17 : 14.5, fontWeight: bold ? 700 : 500, color: T.ink }}>
      <span style={{ color: bold ? T.ink : T.ink60 }}>{label}</span><span>{value}</span>
    </div>
  );
}

/* ============================================================
   FILTER CHIP — admin category filter
   ============================================================ */
interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function FilterChip({ active, onClick, children }: FilterChipProps) {
  return <button onClick={onClick} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${active ? T.ink : T.line}`, background: active ? T.ink : "#fff", color: active ? "#fff" : T.ink, fontSize: 12.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{children}</button>;
}

/* ============================================================
   SHARED STYLE OBJECTS
   ============================================================ */
export const inputStyle: CSSProperties = {
  width: "100%", padding: "11px 13px", borderRadius: 8, border: `1.5px solid ${T.line}`,
  fontFamily: "Inter, sans-serif", fontSize: 14.5, color: T.ink, background: "#fff", boxSizing: "border-box",
};

export const navLinkStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,.85)",
  fontFamily: "Inter, sans-serif",
  fontSize: 14.5,
  fontWeight: 500,
  cursor: "pointer",
  textDecoration: "none",
  textAlign: "left",
};

export const stepperBtn: CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 6,
  border: "none",
  background: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
