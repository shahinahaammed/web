import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase";
import type { Customer, MenuItem, Order, OrderStatus, OrderType, CheckoutForm, CartItem } from "../types";

const mapMenu = (row: any): MenuItem => ({
  id: row.id,
  category: row.category,
  name: row.name,
  desc: row.description ?? "",
  price: Number(row.price),
  popular: !!row.popular,
  available: !!row.available,
  imageUrl: row.image_url ?? "",
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
  const payload = items.map((item) => ({ id: item.id, category: item.category, name: item.name, description: item.desc, price: item.price, popular: item.popular, available: item.available, image_url: item.imageUrl ?? null }));
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
  const cleanForm: CheckoutForm = {
    name: String(order.form.name ?? ""),
    phone: String(order.form.phone ?? ""),
    tableNumber: String(order.form.tableNumber ?? ""),
    people: String(order.form.people ?? ""),
    pickupTime: String(order.form.pickupTime ?? ""),
    area: String(order.form.area ?? ""),
    building: String(order.form.building ?? ""),
    flat: String(order.form.flat ?? ""),
    address: String(order.form.address ?? ""),
    deliveryInstructions: String(order.form.deliveryInstructions ?? ""),
    instructions: String(order.form.instructions ?? ""),
  };

  const cleanItems: CartItem[] = order.items.map((item) => ({
    id: String(item.id),
    category: String(item.category),
    name: String(item.name),
    desc: String(item.desc ?? ""),
    price: Number(item.price),
    popular: Boolean(item.popular),
    available: Boolean(item.available),
    qty: Number(item.qty),
  }));

  // Bypassing the supabase-js .insert() builder here deliberately: it was
  // triggering a "Converting circular structure to JSON" crash even with a
  // fully-primitive, hand-verified payload, which points to the SDK/bundler
  // interaction rather than our data. A plain fetch() against Supabase's
  // REST API sidesteps that machinery entirely.
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token ?? SUPABASE_ANON_KEY;

  // Build the JSON text from already-coerced primitive values. This avoids
  // the circular-structure failure that was occurring in the browser build
  // when JSON.stringify() was given the original application object graph.
  const jsonString = (value: unknown) => JSON.stringify(String(value ?? ""));
  const jsonNumber = (value: unknown) => {
    const number = Number(value);
    return Number.isFinite(number) ? String(number) : "0";
  };
  const jsonBoolean = (value: unknown) => (Boolean(value) ? "true" : "false");

  const normalizedOrderType: OrderType =
    order.orderType === "dine-in" || order.orderType === "takeaway" || order.orderType === "delivery"
      ? order.orderType
      : (() => { throw new Error(`Invalid order type: ${String(order.orderType)}`); })();

  const bodyText = `{
    "order_number": ${jsonString(String(order.orderNumber))},
    "customer_id": ${order.customerId ? jsonString(String(order.customerId)) : "null"},
    "order_type": ${jsonString(normalizedOrderType)},
    "form": {
      "name": ${jsonString(cleanForm.name)},
      "phone": ${jsonString(cleanForm.phone)},
      "tableNumber": ${jsonString(cleanForm.tableNumber)},
      "people": ${jsonString(cleanForm.people)},
      "pickupTime": ${jsonString(cleanForm.pickupTime)},
      "area": ${jsonString(cleanForm.area)},
      "building": ${jsonString(cleanForm.building)},
      "flat": ${jsonString(cleanForm.flat)},
      "address": ${jsonString(cleanForm.address)},
      "deliveryInstructions": ${jsonString(cleanForm.deliveryInstructions)},
      "instructions": ${jsonString(cleanForm.instructions)}
    },
    "items": [${cleanItems.map((item) => `{
      "id": ${jsonString(item.id)},
      "category": ${jsonString(item.category)},
      "name": ${jsonString(item.name)},
      "desc": ${jsonString(item.desc)},
      "price": ${jsonNumber(item.price)},
      "popular": ${jsonBoolean(item.popular)},
      "available": ${jsonBoolean(item.available)},
      "qty": ${jsonNumber(item.qty)}
    }`).join(",")}],
    "subtotal": ${jsonNumber(order.subtotal)},
    "delivery_fee": ${jsonNumber(order.deliveryFee)},
    "total": ${jsonNumber(order.total)},
    "status": ${jsonString(String(order.status))}
  }`;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
      Prefer: "return=minimal",
    },
    body: bodyText,
  });

  if (!response.ok) {
    let message = `Order could not be saved (${response.status}).`;
    try {
      const errBody = await response.json();
      if (errBody?.message) message = errBody.message;
      if (errBody?.hint) message += ` (${errBody.hint})`;
    } catch {
      // response wasn't JSON — keep the generic status-based message
    }
    throw new Error(message);
  }
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
