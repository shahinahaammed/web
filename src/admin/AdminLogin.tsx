import { useState } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { T } from "../data/site";
import { Field, Button, inputStyle, navLinkStyle } from "../components/ui";

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  goHome: () => void;
}

export default function AdminLogin({ onLogin, goHome }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Enter your admin email and password.");
      return;
    }
    setBusy(true);
    const res = await onLogin(email.trim(), password);
    setBusy(false);
    if (!res.ok) setError(res.error || "Incorrect admin credentials.");
  };

  return (
    <div style={{ minHeight: "75vh", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 34, width: "100%", maxWidth: 380 }}>
        <button onClick={goHome} style={{ ...navLinkStyle, color: T.ink60, display: "flex", alignItems: "center", gap: 6, marginBottom: 18, fontSize: 13 }}>
          <ArrowLeft size={14} /> Back to site
        </button>
        <div style={{ width: 46, height: 46, borderRadius: 10, background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <ShieldCheck size={20} color="#fff" />
        </div>
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: T.ink, marginBottom: 6 }}>Admin login</h2>
        <p style={{ color: T.ink60, fontSize: 13.5, marginBottom: 20 }}>Full access: orders, menu, and customer accounts.</p>

        <Field label="Admin email">
          <input
            type="email"
            style={inputStyle}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && void submit()}
            placeholder="admin@yourrestaurant.com"
          />
        </Field>
        <Field label="Password" error={error}>
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && void submit()}
            placeholder="Enter admin password"
          />
        </Field>

        <Button variant="dark" full onClick={() => void submit()}>{busy ? "Signing in…" : "Log In"}</Button>

        <p style={{ fontSize: 11.5, color: T.ink40, marginTop: 16, lineHeight: 1.5 }}>
          Admin accounts are created in Supabase Auth (email + password) and given the "admin" role in the profiles table — see BACKEND_SETUP.md.
        </p>
      </div>
    </div>
  );
}
