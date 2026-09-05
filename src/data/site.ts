import type { Category, MenuItem, OrderStatus } from "../types";

export const T = {
  ink: "#0B2436",
  inkDeep: "#071827",
  tide: "#2E7A76",
  tideLight: "#DCEEEC",
  coral: "#E1673D",
  coralDeep: "#C24F2A",
  sand: "#F6F1E6",
  foam: "#FFFFFF",
  brass: "#C79A3E",
  line: "#E4DCC9",
  ink60: "rgba(11,36,54,0.6)",
  ink40: "rgba(11,36,54,0.4)",
};

export const CATEGORIES: Category[] = [
  { id: "fresh-fish", label: "Fresh Fish", icon: "fish" },
  { id: "prawns", label: "Prawns", icon: "prawn" },
  { id: "crab", label: "Crab", icon: "crab" },
  { id: "lobster", label: "Lobster", icon: "lobster" },
  { id: "squid", label: "Squid", icon: "squid" },
  { id: "grilled", label: "Grilled Seafood", icon: "fish" },
  { id: "fried", label: "Fried Seafood", icon: "prawn" },
  { id: "seafood-rice", label: "Seafood Rice", icon: "bowl" },
  { id: "biriyani", label: "Biriyani", icon: "bowl" },
  { id: "soups", label: "Soups", icon: "bowl" },
  { id: "starters", label: "Starters", icon: "plate" },
  { id: "main-course", label: "Main Course", icon: "plate" },
  { id: "drinks", label: "Drinks", icon: "cup" },
  { id: "desserts", label: "Desserts", icon: "dessert" },
];

export const SEED_MENU: MenuItem[] = [
  { id: "m1", category: "fresh-fish", name: "Grilled Hammour Fillet", desc: "Whole hammour fillet, chargrilled with lemon and herbs.", price: 68, popular: true, available: true },
  { id: "m2", category: "fresh-fish", name: "Pan-Seared Salmon", desc: "Norwegian salmon, crisp skin, brown butter and dill.", price: 72, popular: false, available: true },
  { id: "m3", category: "fresh-fish", name: "Steamed Sea Bass", desc: "Whole sea bass steamed with ginger, soy and scallion.", price: 65, popular: false, available: true },
  { id: "m4", category: "prawns", name: "Garlic Butter Prawns", desc: "Jumbo prawns, roasted garlic butter, chilli flake.", price: 58, popular: true, available: true },
  { id: "m5", category: "prawns", name: "Prawn Masala", desc: "Prawns simmered in a spiced tomato-onion masala.", price: 55, popular: false, available: true },
  { id: "m6", category: "prawns", name: "Chilli Prawns", desc: "Wok-tossed prawns, dried chilli, spring onion.", price: 60, popular: false, available: true },
  { id: "m7", category: "crab", name: "Whole Chilli Crab", desc: "Whole mud crab in a sweet-spicy chilli sauce.", price: 145, popular: true, available: true },
  { id: "m8", category: "crab", name: "Crab Curry", desc: "Crab claws in a coconut and curry-leaf gravy.", price: 95, popular: false, available: true },
  { id: "m9", category: "crab", name: "Butter Garlic Crab", desc: "Whole crab, roasted garlic butter, cracked pepper.", price: 130, popular: false, available: false },
  { id: "m10", category: "lobster", name: "Grilled Half Lobster", desc: "Half lobster, char-grilled, garlic herb butter.", price: 165, popular: true, available: true },
  { id: "m11", category: "lobster", name: "Lobster Thermidor", desc: "Lobster in a creamy mustard-cheese gratin.", price: 190, popular: false, available: true },
  { id: "m12", category: "lobster", name: "Lobster Bisque Roll", desc: "Buttered roll filled with lobster bisque salad.", price: 85, popular: false, available: true },
  { id: "m13", category: "squid", name: "Crispy Fried Calamari", desc: "Lightly battered calamari rings, lemon aioli.", price: 45, popular: true, available: true },
  { id: "m14", category: "squid", name: "Squid Sambal", desc: "Squid tossed in a smoky sambal chilli paste.", price: 50, popular: false, available: true },
  { id: "m15", category: "squid", name: "Grilled Squid Skewers", desc: "Char-grilled squid skewers, lime and chilli oil.", price: 55, popular: false, available: true },
  { id: "m16", category: "grilled", name: "Mixed Seafood Grill Platter", desc: "Fish, prawn, squid and lobster off the grill.", price: 175, popular: true, available: true },
  { id: "m17", category: "grilled", name: "Grilled King Fish", desc: "King fish steak, charred, tamarind glaze.", price: 70, popular: false, available: true },
  { id: "m18", category: "grilled", name: "Grilled Prawn Skewers", desc: "Skewered prawns, smoked paprika butter.", price: 62, popular: false, available: true },
  { id: "m19", category: "fried", name: "Fish and Chips", desc: "Beer-battered fish, hand-cut chips, tartare.", price: 48, popular: false, available: true },
  { id: "m20", category: "fried", name: "Fried Fish Fingers", desc: "Crumbed fish fingers, house cocktail sauce.", price: 40, popular: false, available: true },
  { id: "m21", category: "fried", name: "Crispy Fried Prawns", desc: "Panko-crusted prawns, sweet chilli dip.", price: 52, popular: false, available: true },
  { id: "m22", category: "seafood-rice", name: "Seafood Fried Rice", desc: "Wok-fried rice with prawn, squid and fish cake.", price: 46, popular: true, available: true },
  { id: "m23", category: "seafood-rice", name: "Seafood Paella-Style Rice", desc: "Saffron rice, mussels, prawn and calamari.", price: 58, popular: false, available: true },
  { id: "m24", category: "seafood-rice", name: "Crab Fried Rice", desc: "Fried rice folded through with fresh crab meat.", price: 60, popular: false, available: true },
  { id: "m25", category: "biriyani", name: "Prawn Biriyani", desc: "Layered basmati biriyani with spiced prawn.", price: 52, popular: true, available: true },
  { id: "m26", category: "biriyani", name: "Fish Biriyani", desc: "Fragrant biriyani rice with marinated fish.", price: 50, popular: false, available: true },
  { id: "m27", category: "biriyani", name: "Mixed Seafood Biriyani", desc: "Prawn, fish and squid layered biriyani.", price: 65, popular: false, available: true },
  { id: "m28", category: "soups", name: "Seafood Chowder", desc: "Creamy chowder with prawn, fish and corn.", price: 38, popular: false, available: true },
  { id: "m29", category: "soups", name: "Hot and Sour Prawn Soup", desc: "Tamarind broth, prawn, lemongrass, chilli.", price: 35, popular: false, available: true },
  { id: "m30", category: "soups", name: "Crab and Corn Soup", desc: "Silken crab and sweetcorn soup, egg ribbons.", price: 36, popular: false, available: true },
  { id: "m31", category: "starters", name: "Seafood Spring Rolls", desc: "Crisp rolls filled with prawn and glass noodle.", price: 32, popular: false, available: true },
  { id: "m32", category: "starters", name: "Fish Cutlets", desc: "Pan-fried fish and potato cutlets, mint chutney.", price: 30, popular: false, available: true },
  { id: "m33", category: "starters", name: "Prawn Tempura", desc: "Light tempura prawns, soy-ginger dip.", price: 42, popular: false, available: true },
  { id: "m34", category: "main-course", name: "Fish Curry with Rice", desc: "Coconut fish curry, steamed rice, pickle.", price: 55, popular: false, available: true },
  { id: "m35", category: "main-course", name: "Butter Garlic Lobster Pasta", desc: "Linguine tossed with lobster and garlic butter.", price: 78, popular: true, available: true },
  { id: "m36", category: "main-course", name: "Grilled Fish Steak & Vegetables", desc: "Market fish steak, seasonal roasted vegetables.", price: 68, popular: false, available: true },
  { id: "m37", category: "drinks", name: "Fresh Lime Mint", desc: "Lime, mint and soda over ice.", price: 18, popular: false, available: true },
  { id: "m38", category: "drinks", name: "Mango Lassi", desc: "Churned yoghurt and mango.", price: 20, popular: false, available: true },
  { id: "m39", category: "drinks", name: "Iced Karak Tea", desc: "Spiced milk tea, chilled.", price: 15, popular: false, available: true },
  { id: "m40", category: "desserts", name: "Baked Cheesecake", desc: "Vanilla bean cheesecake, berry compote.", price: 28, popular: false, available: true },
  { id: "m41", category: "desserts", name: "Umm Ali", desc: "Warm bread pudding, cream, toasted nuts.", price: 26, popular: true, available: true },
  { id: "m42", category: "desserts", name: "Chocolate Lava Cake", desc: "Molten centre, vanilla ice cream.", price: 30, popular: false, available: true },
];

export const RESTAURANT = {
  name: "Tidewater",
  sub: "Seafood Co.",
  tagline: "Off the boat, onto the grill — today's catch, plated simply.",
  phone: "+9961723663",
  whatsapp: "+919961723663",
  address: "Jumeirah Fishing Harbour Road, Dubai, UAE",
  hours: [
    { d: "Monday – Thursday", h: "12:00 PM – 11:30 PM" },
    { d: "Friday – Saturday", h: "12:00 PM – 1:00 AM" },
    { d: "Sunday", h: "1:00 PM – 11:00 PM" },
  ],
  mapQuery: "Jumeirah Fishing Harbour, Dubai",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
};



export const DELIVERY_FEE = 15;
export const ADMIN_PASSWORD = "tidewater2026";
export const SUPER_ADMIN_PASSWORD = "tidewater-admin-2026";
export const STATUS_FLOW: OrderStatus[] = ["New", "Pending", "Preparing", "Ready", "Completed", "Cancelled"];
export const STATUS_COLOR: Record<OrderStatus, string> = {
  New: T.coral, Pending: T.brass, Preparing: "#3E7CB1",
  Ready: T.tide, Completed: "#4B8F5C", Cancelled: "#9A5555",
};
