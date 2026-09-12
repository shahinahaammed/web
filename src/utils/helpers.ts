import { RESTAURANT } from "../data/site";

import type {
  Order,
  OrderType,
} from "../types";

export const money = (n: number): string => {
  return `AED ${Number(n).toFixed(2)}`;
};

/**
 * Supabase/PostgREST errors are plain objects shaped like
 * { message, details, hint, code } — they do NOT extend the
 * native Error class. Using `error instanceof Error` on them
 * always returns false, which was silently hiding the real
 * database/RLS error behind generic fallback text. This reads
 * the message off anything error-shaped, falling back only if
 * nothing usable is found.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const withMessage = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
    if (typeof withMessage.message === "string" && withMessage.message.trim()) {
      const parts = [withMessage.message];
      if (typeof withMessage.details === "string" && withMessage.details.trim()) parts.push(withMessage.details);
      if (typeof withMessage.hint === "string" && withMessage.hint.trim()) parts.push(`(${withMessage.hint})`);
      return parts.join(" — ");
    }
  }
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}

export function orderTypeLabel(
  t: OrderType | null
): string {
  if (t === "dine-in") return "Dine-In";

  if (t === "takeaway") return "Takeaway";

  if (t === "delivery") return "Home Delivery";

  return "";
}

export function buildWhatsAppLink(
  order: Order
): string {
  const {
    orderNumber,
    orderType,
    form,
    items,
    total,
  } = order;

  const lines: string[] = [
    `*New Order — ${orderNumber}*`,
    `Type: ${orderTypeLabel(orderType)}`,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
  ];

  if (orderType === "dine-in") {
    lines.push(
      `Table: ${form.tableNumber}`,
      `Guests: ${form.people}`
    );
  }

  if (orderType === "takeaway") {
    lines.push(
      `Pickup time: ${form.pickupTime || "ASAP"}`
    );
  }

  if (orderType === "delivery") {
    lines.push(
      `Address: ${form.address}, ${form.area}`,
      `Building/Villa: ${form.building}${
        form.flat ? `, Flat ${form.flat}` : ""
      }`
    );

    if (form.deliveryInstructions) {
      lines.push(
        `Delivery notes: ${form.deliveryInstructions}`
      );
    }
  }

  lines.push("", "Items:");

  items.forEach((item) => {
    lines.push(
      `${item.qty} x ${item.name} — ${money(
        item.price * item.qty
      )}`
    );
  });

  lines.push("", `Total: ${money(total)}`);

  if (form.instructions) {
    lines.push(
      `Special instructions: ${form.instructions}`
    );
  }

  const whatsappNumber = RESTAURANT.whatsapp.replace(/\D/g, "");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    lines.join("\n")
  )}`;
}