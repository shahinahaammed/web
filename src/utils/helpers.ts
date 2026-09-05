import { RESTAURANT } from "../data/site";

import type {
  Order,
  OrderType,
} from "../types";

export const money = (n: number): string => {
  return `AED ${Number(n).toFixed(2)}`;
};

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

  return `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(
    lines.join("\n")
  )}`;
}