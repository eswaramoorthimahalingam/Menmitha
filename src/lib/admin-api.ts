import type { CartLine, Order, OrderStatus, Product } from "@/data/catalog";

export type InventoryProduct = Product & {
  active: boolean;
  updatedAt: string;
};

export type NewInventoryProduct = {
  name: string;
  category: string;
  description: string;
  unit: string;
  price: number;
  mrp?: number;
  discount?: number;
  stock: number;
  reorderPoint: number;
  img?: string;
  images?: string[];
  active?: boolean;
};

export type CheckoutPayload = {
  customer: Order["customer"];
  items: CartLine[];
};

type ApiEvent = {
  type: "snapshot" | "order-created" | "order-updated" | "inventory-updated" | "product-created";
  orders?: Order[];
  inventory?: InventoryProduct[];
  order?: Order;
  product?: InventoryProduct;
};

function defaultApiBase() {
  if (typeof window !== "undefined") {
    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    if (localHosts.has(window.location.hostname)) return "http://localhost:8787";
  }

  return import.meta.env.MODE === "development"
    ? "http://localhost:8787"
    : "https://api.menmithafoodproducts.com";
}

const DEFAULT_API_BASE = defaultApiBase();
const API_BASE = (import.meta.env.VITE_ADMIN_API_BASE as string | undefined) ?? DEFAULT_API_BASE;
const ADMIN_PASSWORD_STORAGE_KEY = "menmitha_admin_password";

export function getStoredAdminPassword() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) ?? "";
}

export function setStoredAdminPassword(password: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password);
}

export function clearStoredAdminPassword() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY);
}

function toHeaders(initHeaders: HeadersInit | undefined, options: { admin?: boolean }) {
  const headers = new Headers(initHeaders);
  headers.set("content-type", "application/json");

  if (options.admin) {
    const password = getStoredAdminPassword();
    if (password) headers.set("x-admin-password", password);
  }

  return headers;
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  options: { admin?: boolean } = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: toHeaders(init?.headers, options),
  });

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // Keep the status-based message when the body is not JSON.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function getApiBase() {
  return API_BASE;
}

export async function verifyAdminPassword(password: string) {
  await apiFetch<{ ok: true }>("/api/admin/session", {
    headers: { "x-admin-password": password },
  });
  setStoredAdminPassword(password);
}

export function createOrder(payload: CheckoutPayload) {
  return apiFetch<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminSnapshot() {
  const [inventory, orders] = await Promise.all([
    apiFetch<InventoryProduct[]>("/api/inventory"),
    apiFetch<Order[]>("/api/orders", undefined, { admin: true }),
  ]);
  return { inventory, orders };
}

export function fetchInventory() {
  return apiFetch<InventoryProduct[]>("/api/inventory");
}

export function createInventoryProduct(payload: NewInventoryProduct) {
  return apiFetch<InventoryProduct>(
    "/api/inventory",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { admin: true },
  );
}

export function updateInventory(
  productId: string,
  patch: Partial<
    Pick<InventoryProduct, "stock" | "reserved" | "price" | "mrp" | "reorderPoint" | "active">
  >,
) {
  return apiFetch<InventoryProduct>(
    `/api/inventory/${encodeURIComponent(productId)}`,
    {
      method: "PUT",
      body: JSON.stringify(patch),
    },
    { admin: true },
  );
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  return apiFetch<Order>(
    `/api/orders/${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
    { admin: true },
  );
}

export function subscribeAdminEvents(onEvent: (event: ApiEvent) => void) {
  if (typeof EventSource === "undefined") return undefined;
  const password = encodeURIComponent(getStoredAdminPassword());
  const events = new EventSource(`${API_BASE}/api/events?adminPassword=${password}`);
  events.onmessage = (message) => {
    try {
      onEvent(JSON.parse(message.data) as ApiEvent);
    } catch {
      // Ignore malformed server-sent events.
    }
  };
  return () => events.close();
}
