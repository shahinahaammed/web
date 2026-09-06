import { supabase } from "./supabase";
import type { Customer, MenuItem, Order, OrderStatus, OrderType, CheckoutForm, CartItem } from "../types";

const mapMenu = (row: any): MenuItem => ({
  id: row.id,
  category: row.category,
  name: row.name,
  desc: row.description ?? "",
  price: Number(row.price),
  popular: !!row.popular,
  available: !!row.available,
});

const mapOrder = (row: any): Order => ({
  orderNumber: row.order_number,
  orderType: row.order_type as OrderType,
  form: row.form as CheckoutForm,
  items: row.items as CartItem[],
  subtotal: Number(row.subtotal),
  deliveryFee: Number(row.delivery_fee),
  total: Number(row.total),
  status: row.status as OrderStatus,
  createdAt: new Date(row.created_at).getTime(),
  customerId: row.customer_id ?? undefined,
});

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getProfile(userId: string): Promise<Customer & { role: "customer" | "admin" }> {
  const { data, error } = await supabase.from("profiles").select("id,full_name,phone,role").eq("id", userId).single();
  if (error) throw error;
  return { id: data.id, name: data.full_name, phone: data.phone ?? "", role: data.role };
}

export async function customerSignup(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: { data: { full_name: name, email: normalizedEmail } },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Could not create your account.");
  if (!data.session) {
    throw new Error("Account created. Please check your email to verify your account, then log in.");
  }
  return getProfile(data.user.id);
}

export async function customerLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  if (!data.user) throw new Error("Could not sign in.");
  const profile = await getProfile(data.user.id);
  if (profile.role !== "customer") {
    await supabase.auth.signOut();
    throw new Error("This account is not a customer account.");
  }
  return profile;
}

export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("Could not sign in.");
  const profile = await getProfile(data.user.id);
  if (profile.role !== "admin") {
    await supabase.auth.signOut();
    throw new Error("This account does not have admin access.");
  }
  return profile;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadMenu(): Promise<MenuItem[]> {
  const { data, error } = await supabase.from("menu_items").select("*").order("category").order("name");
  if (error) throw error;
  return (data ?? []).map(mapMenu);
}

export async function upsertMenu(items: MenuItem[]) {
  const payload = items.map((item) => ({ id: item.id, category: item.category, name: item.name, description: item.desc, price: item.price, popular: item.popular, available: item.available }));
  const { error } = await supabase.from("menu_items").upsert(payload);
  if (error) throw error;
  return loadMenu();
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export async function loadOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapOrder);
}

export async function createOrder(order: Order) {
  const { error } = await supabase.from("orders").insert({
    order_number: order.orderNumber,
    customer_id: order.customerId ?? null,
    order_type: order.orderType,
    form: order.form,
    items: order.items,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    status: order.status,
  });
  if (error) throw error;
}

export async function updateOrderStatus(orderNumber: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("order_number", orderNumber);
  if (error) throw error;
}

export async function loadCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase.from("profiles").select("id,full_name,phone").eq("role", "customer").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, name: row.full_name, phone: row.phone ?? "" }));
}
