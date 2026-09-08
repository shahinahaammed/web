import { ShieldCheck, User, ArrowLeft } from "lucide-react";
import { T } from "../data/site";
import { navLinkStyle } from "../components/ui";

type LoginRole = "customer" | "admin";

interface LoginPageProps {
  onSelect: (role: LoginRole) => void;
  onBack: () => void;
  onContinueAsGuest: () => void;
}

const roles = [
  {
    id: "customer" as const,
    icon: User,
    title: "Customer Login",
    description: "Create an account, view your orders, and track your order history.",
  },
  {
    id: "admin" as const,
    icon: ShieldCheck,
    title: "Admin Login",
    description: "Secure access to orders, menu management, and customer accounts.",
  },
];

export default function LoginPage({ onSelect, onBack, onContinueAsGuest }: LoginPageProps) {
  return (
    <div style={{ minHeight: "75vh", background: T.sand, padding: "50px 20px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <button onClick={onBack} style={{ ...navLinkStyle, color: T.ink, display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
          <ArrowLeft size={15} /> Back to site
        </button>
        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <div style={{ color: T.coralDeep, fontWeight: 700, fontSize: 13, marginBottom: 7 }}>ACCOUNT ACCESS</div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, color: T.ink, margin: 0 }}>
            Choose your login
          </h1>
          <p style={{ color: T.ink60, margin: "10px auto 0", maxWidth: 580, lineHeight: 1.6 }}>
            Select Customer Login for your personal account or Admin Login for restaurant management.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18 }} className="tw-2col">
          {roles.map(({ id, icon: Icon, title, description }) => (
            <button key={id} onClick={() => onSelect(id)} style={{ textAlign: "left", background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 16, padding: 24, cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 11, background: id === "admin" ? T.ink : T.tideLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 17 }}>
                <Icon size={21} color={id === "admin" ? "#fff" : T.tide} />
              </div>
              <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 21, fontWeight: 600, color: T.ink, margin: "0 0 8px" }}>{title}</h2>
              <p style={{ color: T.ink60, fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>{description}</p>
              <div style={{ marginTop: 18, color: T.tide, fontWeight: 700, fontSize: 13.5 }}>Continue →</div>
            </button>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 22, paddingTop: 20, borderTop: `1px solid ${T.line}` }}>
          <div style={{ color: T.ink60, fontSize: 13, marginBottom: 10 }}>Just want to order? No account needed.</div>
          <button
            type="button"
            onClick={onContinueAsGuest}
            style={{ background: "transparent", border: `1.5px solid ${T.coral}`, color: T.coralDeep, borderRadius: 9, padding: "11px 20px", cursor: "pointer", fontWeight: 700, fontSize: 13.5 }}
          >
            Continue as Guest →
          </button>
        </div>
      </div>
    </div>
  );
}
