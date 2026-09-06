import { useState } from "react";
import { User, ArrowLeft } from "lucide-react";
import { T } from "../data/site";
import { Field, Button, inputStyle, navLinkStyle } from "../components/ui";

interface CustomerAuthProps {
  onSignup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  onLogin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  onBack: () => void;
}

export default function CustomerAuth({ onSignup, onLogin, onBack }: CustomerAuthProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (mode === "signup" && !name.trim()) return setError("Enter your full name.");
    if (!email.trim() || !password.trim()) return setError("Enter your email address and password.");
    setBusy(true);
    const res = mode === "signup" ? await onSignup(name.trim(), email.trim(), password) : await onLogin(email.trim(), password);
    setBusy(false);
    if (!res.ok) setError(res.error || "Authentication failed.");
  };

  return (
    <div style={{ minHeight: "75vh", background: T.sand, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${T.line}`, padding: 34, width: "100%", maxWidth: 380 }}>
        <button onClick={onBack} style={{ ...navLinkStyle, color: T.ink60, display: "flex", alignItems: "center", gap: 6, marginBottom: 18, fontSize: 13 }}><ArrowLeft size={14} /> Back</button>
        <div style={{ width: 46, height: 46, borderRadius: 10, background: T.tideLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><User size={20} color={T.tide} /></div>
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: T.ink, marginBottom: 6 }}>{mode === "login" ? "Customer login" : "Create your account"}</h2>
        <p style={{ color: T.ink60, fontSize: 13.5, marginBottom: 20 }}>{mode === "login" ? "Log in to see your order history." : "Create an account to track your orders."}</p>
        {mode === "signup" && <Field label="Full name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></Field>}
        <Field label="Email address"><input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
        <Field label="Password" error={error}><input type="password" style={inputStyle} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && void submit()} placeholder="Enter your password" /></Field>
        <Button variant="dark" full onClick={() => void submit()}>{busy ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}</Button>
        <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ ...navLinkStyle, color: T.tide, width: "100%", textAlign: "center", marginTop: 16, fontSize: 13.5 }}>{mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}</button>
      </div>
    </div>
  );
}
