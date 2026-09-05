import { useState } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { T, CATEGORIES } from "../data/site";
import { SeaIcon, Pill, Button, Field, FilterChip, inputStyle } from "../components/ui";
import { money } from "../utils/helpers";
import type { CSSProperties } from "react";
import type { MenuItem } from "../types";

interface ItemForm {
  id: string | null;
  category: string;
  name: string;
  desc: string;
  price: string;
  popular: boolean;
  available: boolean;
}

export function emptyItemForm(): ItemForm {
  return { id: null, category: CATEGORIES[0].id, name: "", desc: "", price: "", popular: false, available: true };
}

interface AdminMenuManagerProps {
  menuItems: MenuItem[];
  saveMenu: (next: MenuItem[]) => void;
}

export default function AdminMenuManager({ menuItems, saveMenu }: AdminMenuManagerProps) {
  const [form, setForm] = useState<ItemForm>(emptyItemForm());
  const [editing, setEditing] = useState(false);
  const [filterCat, setFilterCat] = useState("all");

  const startAdd = () => { setForm(emptyItemForm()); setEditing(true); };
  const startEdit = (item: MenuItem) => { setForm({ ...item, price: String(item.price) }); setEditing(true); };
  const cancel = () => { setForm(emptyItemForm()); setEditing(false); };

  const submit = () => {
    if (!form.name.trim() || !form.price) return;
    const priceNum = parseFloat(form.price);
    if (form.id) {
      saveMenu(menuItems.map((m) => (m.id === form.id ? { ...m, ...form, id: m.id, price: priceNum } : m)));
    } else {
      const newItem: MenuItem = { ...form, id: "m" + Date.now(), price: priceNum };
      saveMenu([...menuItems, newItem]);
    }
    cancel();
  };

  const remove = (id: string) => { if (window.confirm("Delete this item?")) saveMenu(menuItems.filter((m) => m.id !== id)); };
  const toggle = (id: string, key: "available" | "popular") => saveMenu(menuItems.map((m) => (m.id === id ? { ...m, [key]: !m[key] } : m)));

  const visible = filterCat === "all" ? menuItems : menuItems.filter((m) => m.category === filterCat);

  const iconBtn: CSSProperties = { background: T.sand, border: "none", borderRadius: 7, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          <FilterChip active={filterCat === "all"} onClick={() => setFilterCat("all")}>All ({menuItems.length})</FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} active={filterCat === c.id} onClick={() => setFilterCat(c.id)}>{c.label}</FilterChip>
          ))}
        </div>
        <Button variant="primary" size="sm" onClick={startAdd}><PlusCircle size={15} /> Add Item</Button>
      </div>

      {editing && (
        <div style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, color: T.ink, marginBottom: 14 }}>{form.id ? "Edit item" : "New menu item"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="tw-2col">
            <Field label="Food name"><input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grilled King Fish" /></Field>
            <Field label="Category">
              <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description"><input style={inputStyle} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Short description" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, alignItems: "end" }} className="tw-3col">
            <Field label="Price (AED)"><input style={inputStyle} type="number" min="0" step="0.5" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" /></Field>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 14, color: T.ink }}>
              <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Mark as Popular
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 14, color: T.ink }}>
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Available
            </label>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="dark" onClick={submit}>{form.id ? "Save changes" : "Add item"}</Button>
            <Button variant="ghost" onClick={cancel}>Cancel</Button>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, overflow: "hidden" }}>
        {visible.length === 0 && <div style={{ padding: 30, textAlign: "center", color: T.ink60 }}>No items in this category yet.</div>}
        {visible.map((item, i) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < visible.length - 1 ? `1px solid ${T.line}` : "none", flexWrap: "wrap" }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: T.tideLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SeaIcon type={CATEGORIES.find((c) => c.id === item.category)?.icon} size={20} color={T.tide} />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600, color: T.ink }}>{item.name}</span>
                {item.popular && <Pill tone="brass">Popular</Pill>}
                {!item.available && <Pill tone="coral">Unavailable</Pill>}
              </div>
              <div style={{ fontSize: 12.5, color: T.ink60 }}>{CATEGORIES.find((c) => c.id === item.category)?.label} · {money(item.price)}</div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: T.ink60 }}>
              <input type="checkbox" checked={item.available} onChange={() => toggle(item.id, "available")} /> Available
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: T.ink60 }}>
              <input type="checkbox" checked={item.popular} onChange={() => toggle(item.id, "popular")} /> Popular
            </label>
            <button onClick={() => startEdit(item)} style={iconBtn}><Pencil size={15} color={T.ink} /></button>
            <button onClick={() => remove(item.id)} style={iconBtn}><Trash2 size={15} color={T.coralDeep} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
