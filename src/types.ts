export type OrderType = "dine-in" | "takeaway" | "delivery";

export type View =
  | "home"
  | "orderType"
  | "menu"
  | "cart"
  | "checkout"
  | "confirmation"
  | "admin"
  | "customerAuth"
  | "customerOrders"
  | "superAdmin";

export type OrderStatus =
  | "New"
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

export type IconType =
  | "fish"
  | "prawn"
  | "crab"
  | "lobster"
  | "squid"
  | "bowl"
  | "plate"
  | "cup"
  | "dessert"
  | "whatsapp"
  | "instagram"
  | "facebook";

export interface Category {
  id: string;
  label: string;
  icon: IconType;
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  popular: boolean;
  available: boolean;
}

export interface CartItem extends MenuItem {
  qty: number;
}

export type Cart = Record<string, CartItem>;

export interface CheckoutForm {
  name: string;
  phone: string;
  tableNumber: string;
  people: string;
  pickupTime: string;
  area: string;
  building: string;
  flat: string;
  address: string;
  deliveryInstructions: string;
  instructions: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  password: string;
}

export interface Order {
  orderNumber: string;
  orderType: OrderType;
  form: CheckoutForm;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
  customerId?: string;
}