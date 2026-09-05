import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { T, SUPER_ADMIN_PASSWORD } from "../data/site";
import { Field, Button, inputStyle, navLinkStyle } from "../components/ui";

interface SuperAdminLoginProps {
  onLogin: () => void;
  goHome: () => void;
}

export default function SuperAdminLogin({ onLogin, goHome }: SuperAdminLoginProps) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    if (pw === SUPER_ADMIN_PASSWORD) onLogin();
    else setError("Incorrect password. Try again.");
  };
  return (
    <div style={{ minHeight: "75vh", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 34, width: "100%", maxWidth: 380 }}>
        <div style={{ width: 46, height: 46, borderRadius: 10, background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <ShieldCheck size={20} color="#fff" />
        </div>
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: T.ink, marginBottom: 6 }}>Admin login</h2>
        <p style={{ color: T.ink60, fontSize: 13.5, marginBottom: 20 }}>Full access: orders, menu, and customer accounts.</p>
        <Field label="Password" error={error}>
          <input type="password" style={inputStyle} value={pw} onChange={(e) => { setPw(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Enter admin password" />
        </Field>
        <Button variant="dark" full onClick={submit}>Log In</Button>
        <button onClick={goHome} style={{ ...navLinkStyle, color: T.ink60, width: "100%", textAlign: "center", marginTop: 14, fontSize: 13 }}>← Back to site</button>
        <p style={{ fontSize: 11.5, color: T.ink40, marginTop: 16, lineHeight: 1.5 }}>Demo password: <strong>{SUPER_ADMIN_PASSWORD}</strong>. Change SUPER_ADMIN_PASSWORD in data/site.ts before going live.</p>
      </div>
    </div>
  );
}
