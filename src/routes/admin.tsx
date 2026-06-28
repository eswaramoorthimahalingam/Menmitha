import { createFileRoute, Link } from "@tanstack/react-router";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  IndianRupee,
  KeyRound,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Save,
  Search,
  Truck,
  Warehouse,
  X,
} from "lucide-react";

import { CATALOG_PRODUCTS, type Order, type OrderStatus } from "@/data/catalog";
import {
  clearStoredAdminPassword,
  createInventoryProduct,
  fetchAdminSnapshot,
  getApiBase,
  getStoredAdminPassword,
  subscribeAdminEvents,
  updateInventory,
  updateOrderStatus,
  verifyAdminPassword,
  type InventoryProduct,
  type NewInventoryProduct,
} from "@/lib/admin-api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Menmitha Live Orders & Inventory" },
      {
        name: "description",
        content: "Menmitha admin panel for live order and inventory management.",
      },
    ],
  }),
  component: AdminPanel,
});

const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "accepted",
  "packing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New",
  accepted: "Accepted",
  packing: "Packing",
  ready: "Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const LOCAL_PRODUCT = new Map(CATALOG_PRODUCTS.map((product) => [product.id, product]));

const PRODUCT_CATEGORIES = [
  "Cold-Pressed Oils",
  "Home-Made Masalas",
  "Jaggery & Sweeteners",
  "Flours & Staples",
  "Herbal Powders",
];

function initialInventory(): InventoryProduct[] {
  const now = new Date().toISOString();
  return CATALOG_PRODUCTS.map((product) => ({
    ...product,
    active: true,
    updatedAt: now,
  }));
}

function enrichInventory(products: InventoryProduct[]) {
  return products.map((product) => ({
    ...LOCAL_PRODUCT.get(product.id),
    ...product,
    img: LOCAL_PRODUCT.get(product.id)?.img ?? product.img,
    description: LOCAL_PRODUCT.get(product.id)?.description ?? product.description,
  }));
}

function AdminPanel() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const storedPassword = getStoredAdminPassword();
    if (!storedPassword) {
      setChecking(false);
      return;
    }

    verifyAdminPassword(storedPassword)
      .then(() => setAuthenticated(true))
      .catch(() => {
        clearStoredAdminPassword();
        setAuthenticated(false);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="rounded-lg border border-border bg-card p-8 text-center shadow-elegant">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        clearStoredAdminPassword();
        setAuthenticated(false);
      }}
    />
  );
}

function AdminLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await verifyAdminPassword(password);
      onAuthenticated();
    } catch (loginError) {
      clearStoredAdminPassword();
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-7 shadow-elegant">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Storefront
        </Link>
        <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-leaf/10 text-primary">
          <KeyRound className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-3xl">Admin panel</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the admin password to manage live orders and inventory.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            className="admin-input"
            autoComplete="current-password"
          />
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <button
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {submitting && <RefreshCw className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [inventory, setInventory] = useState<InventoryProduct[]>(initialInventory);
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");
  const [connection, setConnection] = useState<"syncing" | "live" | "offline">("syncing");
  const [savingProduct, setSavingProduct] = useState<string>();
  const [savingOrder, setSavingOrder] = useState<string>();
  const [addProductOpen, setAddProductOpen] = useState(false);

  const loadSnapshot = async () => {
    setConnection("syncing");
    try {
      const snapshot = await fetchAdminSnapshot();
      setInventory(enrichInventory(snapshot.inventory));
      setOrders(snapshot.orders);
      setConnection("live");
    } catch {
      setConnection("offline");
    }
  };

  useEffect(() => {
    void loadSnapshot();
    const close = subscribeAdminEvents((event) => {
      setConnection("live");
      if (event.inventory) setInventory(enrichInventory(event.inventory));
      if (event.orders) setOrders(event.orders);
      if (event.product) {
        setInventory((current) => {
          const product = enrichInventory([event.product!])[0];
          const exists = current.some((item) => item.id === product.id);
          return exists
            ? current.map((item) => (item.id === product.id ? product : item))
            : [product, ...current];
        });
      }
      if (event.order) {
        setOrders((current) => {
          const exists = current.some((order) => order.id === event.order?.id);
          return exists
            ? current.map((order) => (order.id === event.order?.id ? event.order : order))
            : [event.order!, ...current];
        });
      }
    });
    return close;
  }, []);

  const metrics = useMemo(() => {
    const openOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
    const todayRevenue = orders
      .filter((order) => order.status !== "cancelled")
      .reduce((total, order) => total + order.total, 0);
    const lowStock = inventory.filter((product) => product.stock <= product.reorderPoint);
    const inventoryValue = inventory.reduce(
      (total, product) => total + product.stock * product.price,
      0,
    );
    return { openOrders, todayRevenue, lowStock, inventoryValue };
  }, [inventory, orders]);

  const filteredInventory = inventory.filter((product) => {
    const text = `${product.name} ${product.sku} ${product.category}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const filteredOrders = orders.filter((order) => {
    const text = [
      order.id,
      order.status,
      order.customer.name,
      order.customer.phone,
      order.customer.address,
      ...order.items.map((item) => `${item.name} ${item.sku}`),
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = text.includes(orderQuery.toLowerCase());
    const matchesStatus = orderFilter === "all" || order.status === orderFilter;
    return matchesQuery && matchesStatus;
  });

  const setProductField = (
    id: string,
    field: "stock" | "reserved" | "price" | "mrp" | "reorderPoint" | "active",
    value: number | boolean,
  ) => {
    setInventory((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, [field]: value, updatedAt: new Date().toISOString() }
          : product,
      ),
    );
  };

  const saveProduct = async (product: InventoryProduct) => {
    setSavingProduct(product.id);
    try {
      const saved = await updateInventory(product.id, {
        stock: product.stock,
        reserved: product.reserved,
        price: product.price,
        mrp: product.mrp,
        reorderPoint: product.reorderPoint,
        active: product.active,
      });
      setInventory((current) =>
        current.map((item) => (item.id === saved.id ? enrichInventory([saved])[0] : item)),
      );
      setConnection("live");
    } catch {
      setConnection("offline");
    } finally {
      setSavingProduct(undefined);
    }
  };

  const saveOrderStatus = async (order: Order, status: OrderStatus) => {
    setSavingOrder(order.id);
    try {
      const saved = await updateOrderStatus(order.id, status);
      setOrders((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      setConnection("live");
    } catch {
      setConnection("offline");
    } finally {
      setSavingOrder(undefined);
    }
  };

  const addProduct = async (payload: NewInventoryProduct) => {
    const created = await createInventoryProduct(payload);
    setInventory((current) => [enrichInventory([created])[0], ...current]);
    setConnection("live");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Storefront
            </Link>
            <h1 className="mt-2 font-display text-3xl">Live Orders & Inventory</h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                connection === "live"
                  ? "bg-leaf/10 text-primary"
                  : connection === "syncing"
                    ? "bg-gold/15 text-primary"
                    : "bg-destructive/10 text-destructive"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {connection === "live" ? "Live" : connection === "syncing" ? "Syncing" : "Offline"}
            </span>
            <button
              onClick={() => void loadSnapshot()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted"
              aria-label="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={onLogout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {connection === "offline" && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            API offline at {getApiBase()}. Local catalog preview is still available.
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <Metric
            icon={ClipboardList}
            label="Open orders"
            value={metrics.openOrders.length.toString()}
          />
          <Metric
            icon={IndianRupee}
            label="Order value"
            value={`₹${metrics.todayRevenue.toLocaleString("en-IN")}`}
          />
          <Metric icon={Warehouse} label="Low stock" value={metrics.lowStock.length.toString()} />
          <Metric
            icon={Package}
            label="Stock value"
            value={`₹${metrics.inventoryValue.toLocaleString("en-IN")}`}
          />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_1.35fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold">
                  Orders
                </p>
                <h2 className="font-display text-2xl">Live queue</h2>
              </div>
              <Truck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_160px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={orderQuery}
                  onChange={(event) => setOrderQuery(event.target.value)}
                  placeholder="Search orders, customer, product"
                  className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-leaf"
                />
              </label>
              <select
                value={orderFilter}
                onChange={(event) => setOrderFilter(event.target.value as OrderStatus | "all")}
                className="rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-leaf"
              >
                <option value="all">All statuses</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABEL[status]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {filteredOrders.length === 0 && (
                <div className="rounded-lg border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
                  No matching orders.
                </div>
              )}
              {filteredOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()} · {order.customer.name}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      disabled={savingOrder === order.id}
                      onChange={(event) =>
                        void saveOrderStatus(order, event.target.value as OrderStatus)
                      }
                      className="rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-leaf"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <Link
                          to="/product/$productId"
                          params={{ productId: item.productId }}
                          className="truncate pr-3 hover:text-primary"
                        >
                          {item.quantity} x {item.name}
                        </Link>
                        <span className="font-semibold">₹{item.quantity * item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">{order.customer.phone}</span>
                      <span className="font-semibold text-primary">₹{order.total}</span>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {order.customer.address}
                    </p>
                    {order.customer.notes && (
                      <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                        {order.customer.notes}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-leaf font-semibold">
                  Inventory
                </p>
                <h2 className="font-display text-2xl">Product control</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="relative block min-w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search SKU or product"
                    className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-leaf"
                  />
                </label>
                <button
                  onClick={() => setAddProductOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Reserved</th>
                      <th className="px-4 py-3">Reorder</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Active</th>
                      <th className="px-4 py-3 text-right">Save</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredInventory.map((product) => {
                      const low = product.stock <= product.reorderPoint;
                      return (
                        <tr key={product.id} className={low ? "bg-gold/10" : undefined}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {product.img ? (
                                <img
                                  src={product.img}
                                  alt=""
                                  className="h-12 w-12 rounded-md object-contain"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                  <Package className="h-5 w-5" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {product.sku} · {product.unit}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <NumberInput
                              value={product.stock}
                              onChange={(value) => setProductField(product.id, "stock", value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <NumberInput
                              value={product.reserved}
                              onChange={(value) => setProductField(product.id, "reserved", value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <NumberInput
                              value={product.reorderPoint}
                              onChange={(value) =>
                                setProductField(product.id, "reorderPoint", value)
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <NumberInput
                              value={product.price}
                              onChange={(value) => setProductField(product.id, "price", value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={product.active}
                              onChange={(event) =>
                                setProductField(product.id, "active", event.target.checked)
                              }
                              className="h-5 w-5 accent-primary"
                              aria-label={`Set ${product.name} active`}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => void saveProduct(product)}
                              disabled={savingProduct === product.id}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
                              aria-label={`Save ${product.name}`}
                            >
                              {savingProduct === product.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <AddProductModal
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        onCreate={addProduct}
      />
    </div>
  );
}

type ProductFormState = {
  name: string;
  category: string;
  customCategory: string;
  description: string;
  unit: string;
  stock: string;
  basePrice: string;
  discount: string;
  reorderPoint: string;
  images: string[];
};

const EMPTY_PRODUCT_FORM: ProductFormState = {
  name: "",
  category: PRODUCT_CATEGORIES[0],
  customCategory: "",
  description: "",
  unit: "",
  stock: "",
  basePrice: "",
  discount: "0",
  reorderPoint: "5",
  images: [],
};

function salePrice(basePrice: string, discount: string) {
  const base = Number(basePrice) || 0;
  const percent = Math.min(100, Math.max(0, Number(discount) || 0));
  return Math.round(base * (1 - percent / 100));
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function AddProductModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: NewInventoryProduct) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductFormState>(EMPTY_PRODUCT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const update = (field: keyof ProductFormState, value: string | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const addImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 5 - form.images.length);
    const images = await Promise.all(files.map(readFileAsDataUrl));
    update("images", [...form.images, ...images].slice(0, 5));
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    update(
      "images",
      form.images.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const category = form.category === "__custom" ? form.customCategory : form.category;
    const base = Number(form.basePrice);
    const discount = Math.min(100, Math.max(0, Number(form.discount) || 0));

    if (!form.name.trim()) return setError("Product name is required.");
    if (!category.trim()) return setError("Category is required.");
    if (!Number.isFinite(base) || base <= 0) return setError("Base price must be greater than 0.");

    setSaving(true);
    try {
      await onCreate({
        name: form.name.trim(),
        category: category.trim(),
        description: form.description.trim(),
        unit: form.unit.trim() || "1 unit",
        mrp: base,
        discount,
        price: salePrice(form.basePrice, form.discount),
        stock: Math.max(0, Math.floor(Number(form.stock) || 0)),
        reorderPoint: Math.max(0, Math.floor(Number(form.reorderPoint) || 0)),
        img: form.images[0],
        images: form.images,
        active: true,
      });
      setForm(EMPTY_PRODUCT_FORM);
      onClose();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to add product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-elegant">
        <div className="flex items-start justify-between gap-4 bg-gradient-primary px-7 py-6 text-primary-foreground">
          <div>
            <h2 className="flex items-center gap-2 font-display text-3xl">
              <Plus className="h-6 w-6" /> Add New Product
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/75">
              Fill details to list a new product
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="max-h-[calc(92vh-96px)] overflow-y-auto px-7 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Product name" className="md:col-span-2">
              <input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="e.g. Cold-Pressed Groundnut Oil"
                className="admin-input"
              />
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
                className="admin-input"
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="__custom">Custom category</option>
              </select>
            </Field>

            <Field label="Stock quantity">
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => update("stock", event.target.value)}
                placeholder="e.g. 100"
                className="admin-input"
              />
            </Field>

            {form.category === "__custom" && (
              <Field label="Custom category" className="md:col-span-2">
                <input
                  value={form.customCategory}
                  onChange={(event) => update("customCategory", event.target.value)}
                  placeholder="e.g. Seasonal Specials"
                  className="admin-input"
                />
              </Field>
            )}

            <Field label="Description" className="md:col-span-2">
              <textarea
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Describe the product..."
                rows={4}
                className="admin-input resize-none"
              />
            </Field>

            <Field label="Base / market price">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">₹</span>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.basePrice}
                  onChange={(event) => update("basePrice", event.target.value)}
                  placeholder="0"
                  className="admin-input pl-9"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Original MRP price</p>
            </Field>

            <Field label="Discount">
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.discount}
                  onChange={(event) => update("discount", event.target.value)}
                  className="admin-input pr-9"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-destructive">
                  %
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Sale price: ₹{salePrice(form.basePrice, form.discount)}
              </p>
            </Field>

            <Field label="Unit">
              <input
                value={form.unit}
                onChange={(event) => update("unit", event.target.value)}
                placeholder="e.g. 500 g pack"
                className="admin-input"
              />
            </Field>

            <Field label="Reorder point">
              <input
                type="number"
                min={0}
                value={form.reorderPoint}
                onChange={(event) => update("reorderPoint", event.target.value)}
                className="admin-input"
              />
            </Field>

            <Field label="Product images" className="md:col-span-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/50 px-4 py-6 text-sm text-muted-foreground hover:bg-muted">
                <ImagePlus className="h-5 w-5" />
                Choose up to 5 images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={addImages}
                />
              </label>
              {form.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {form.images.map((image, index) => (
                    <div
                      key={image.slice(0, 30)}
                      className="relative h-20 w-20 rounded-lg bg-muted"
                    >
                      <img src={image} alt="" className="h-full w-full rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
          </div>

          {error && (
            <div className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-muted px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/80"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {saving && <RefreshCw className="h-4 w-4 animate-spin" />}
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-5 w-5 text-leaf" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <input
      type="number"
      min={0}
      value={Number.isFinite(value) ? value : 0}
      onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
      className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-leaf"
    />
  );
}
