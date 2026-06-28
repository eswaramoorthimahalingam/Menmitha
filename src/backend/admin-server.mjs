import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const PORT = Number(process.env.ADMIN_PORT ?? 8787);
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://127.0.0.1:5173";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const DATA_FILE = path.join(process.cwd(), ".data", "admin-store.json");
const FINAL_STATUSES = new Set(["delivered", "cancelled"]);

const seedProducts = [
  [
    "groundnut-oil-1l",
    "MFP-OIL-GN-1L",
    "Cold-Pressed Groundnut Oil",
    "Cold-Pressed Oils",
    "Wooden chekku · 1 L",
    "1 L bottle",
    420,
    520,
    42,
    6,
    18,
  ],
  [
    "sesame-oil-1l",
    "MFP-OIL-SE-1L",
    "Cold-Pressed Sesame Oil",
    "Cold-Pressed Oils",
    "Wooden chekku · 1 L",
    "1 L bottle",
    480,
    580,
    24,
    4,
    12,
  ],
  [
    "coconut-oil-500ml",
    "MFP-OIL-CO-500",
    "Cold-Pressed Coconut Oil",
    "Cold-Pressed Oils",
    "Pure & unrefined · 500 ml",
    "500 ml bottle",
    350,
    420,
    16,
    3,
    10,
  ],
  [
    "jaggery-powder-500g",
    "MFP-JAG-500",
    "Natural Jaggery Powder",
    "Jaggery & Sweeteners",
    "Chemical-free · 500 g",
    "500 g pack",
    180,
    220,
    58,
    5,
    20,
  ],
  [
    "sambar-masala-200g",
    "MFP-MAS-SAM-200",
    "Home-Made Sambar Masala",
    "Home-Made Masalas",
    "Small batch · 200 g",
    "200 g pouch",
    145,
    175,
    37,
    7,
    16,
  ],
  [
    "rasam-masala-200g",
    "MFP-MAS-RAS-200",
    "Home-Made Rasam Masala",
    "Home-Made Masalas",
    "Sun-dried spices · 200 g",
    "200 g pouch",
    135,
    170,
    21,
    4,
    14,
  ],
  [
    "wheat-flour-1kg",
    "MFP-FLR-WHT-1K",
    "Stone-Ground Wheat Flour",
    "Flours & Staples",
    "Whole wheat · 1 kg",
    "1 kg pack",
    95,
    120,
    63,
    8,
    24,
  ],
  [
    "shikakai-powder-200g",
    "MFP-HRB-SHI-200",
    "Herbal Shikakai Powder",
    "Herbal Powders",
    "100% natural · 200 g",
    "200 g pouch",
    160,
    200,
    12,
    2,
    12,
  ],
].map(([id, sku, name, category, tagline, unit, price, mrp, stock, reserved, reorderPoint]) => ({
  id,
  sku,
  name,
  category,
  tagline,
  description: "",
  unit,
  price,
  mrp,
  stock,
  reserved,
  reorderPoint,
  img: "",
  active: true,
  updatedAt: new Date().toISOString(),
}));

let clients = new Set();

async function readStore() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    const store = { inventory: seedProducts, orders: [] };
    await writeStore(store);
    return store;
  }
}

async function writeStore(store) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2));
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PUT,PATCH,OPTIONS",
    "access-control-allow-headers": "content-type,x-admin-password",
  });
  res.end(JSON.stringify(body));
}

function sendError(res, status, error) {
  sendJson(res, status, { error });
}

function sendRedirect(res, location) {
  res.writeHead(302, {
    location,
    "access-control-allow-origin": "*",
  });
  res.end();
}

function isAdminAuthorized(req, url) {
  const suppliedPassword =
    req.headers["x-admin-password"] ?? url.searchParams.get("adminPassword") ?? "";
  return String(suppliedPassword) === ADMIN_PASSWORD;
}

function requireAdmin(req, res, url) {
  if (isAdminAuthorized(req, url)) return true;
  sendError(res, 401, "Admin password required.");
  return false;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function broadcast(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of clients) res.write(payload);
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueProductId(store, name) {
  const base = slugify(name) || "product";
  let id = base;
  let count = 2;
  while (store.inventory.some((product) => product.id === id)) {
    id = `${base}-${count}`;
    count += 1;
  }
  return id;
}

function nextSku(store, category) {
  const prefix =
    slugify(category)
      .split("-")
      .map((part) => part[0])
      .join("")
      .slice(0, 4)
      .toUpperCase() || "NEW";
  return `MFP-${prefix}-${String(store.inventory.length + 1).padStart(3, "0")}`;
}

function activeStatus(status) {
  return !FINAL_STATUSES.has(status);
}

function createOrderId(orders) {
  const today = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const count = orders.filter((order) => order.id.includes(today)).length + 1;
  return `MFP-${today}-${String(count).padStart(3, "0")}`;
}

function normalizeCustomer(customer) {
  return {
    name: String(customer?.name ?? "").trim(),
    phone: String(customer?.phone ?? "").trim(),
    address: String(customer?.address ?? "").trim(),
    notes: String(customer?.notes ?? "").trim() || undefined,
  };
}

async function handleCreateOrder(res, body) {
  const store = await readStore();
  const customer = normalizeCustomer(body.customer);
  const lines = Array.isArray(body.items) ? body.items : [];

  if (!customer.name || !customer.phone || !customer.address) {
    return sendError(res, 400, "Name, phone and address are required.");
  }
  if (!lines.length) return sendError(res, 400, "Order needs at least one item.");

  const orderItems = [];
  for (const line of lines) {
    const quantity = Math.floor(safeNumber(line.quantity, 0));
    const product = store.inventory.find((item) => item.id === line.productId);
    if (!product || !product.active) return sendError(res, 404, "Product is unavailable.");
    if (quantity < 1) return sendError(res, 400, "Item quantity must be at least 1.");
    if (product.stock < quantity) {
      return sendError(res, 409, `${product.name} has only ${product.stock} in stock.`);
    }
    orderItems.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      unit: product.unit,
      quantity,
      price: product.price,
    });
  }

  for (const item of orderItems) {
    const product = store.inventory.find((entry) => entry.id === item.productId);
    product.stock -= item.quantity;
    product.reserved += item.quantity;
    product.updatedAt = new Date().toISOString();
  }

  const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 70;
  const order = {
    id: createOrderId(store.orders),
    createdAt: new Date().toISOString(),
    status: "new",
    customer,
    items: orderItems,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };

  store.orders.unshift(order);
  await writeStore(store);
  broadcast({ type: "order-created", order, orders: store.orders, inventory: store.inventory });
  return sendJson(res, 201, order);
}

async function handleCreateInventory(res, body) {
  const store = await readStore();
  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "").trim();
  const description = String(body.description ?? "").trim();
  const unit = String(body.unit ?? "").trim() || "1 unit";
  const basePrice = safeNumber(body.mrp ?? body.price, 0);
  const discount = Math.min(100, safeNumber(body.discount, 0));
  const salePrice =
    "price" in body ? safeNumber(body.price, 0) : Math.round(basePrice * (1 - discount / 100));
  const stock = Math.floor(safeNumber(body.stock, 0));
  const reorderPoint = Math.floor(safeNumber(body.reorderPoint, 5));
  const images = Array.isArray(body.images)
    ? body.images.filter((image) => typeof image === "string" && image.startsWith("data:image/"))
    : [];

  if (!name) return sendError(res, 400, "Product name is required.");
  if (!category) return sendError(res, 400, "Category is required.");
  if (basePrice <= 0 && salePrice <= 0) return sendError(res, 400, "Price must be greater than 0.");

  const product = {
    id: uniqueProductId(store, name),
    sku: String(body.sku ?? "").trim() || nextSku(store, category),
    name,
    category,
    tagline: String(body.tagline ?? unit).trim() || unit,
    description,
    unit,
    price: salePrice || basePrice,
    mrp: basePrice || salePrice,
    stock,
    reserved: 0,
    reorderPoint,
    img: String(body.img ?? images[0] ?? "").trim(),
    images,
    active: body.active == null ? true : Boolean(body.active),
    updatedAt: new Date().toISOString(),
  };

  store.inventory.unshift(product);
  await writeStore(store);
  broadcast({ type: "product-created", product, inventory: store.inventory });
  return sendJson(res, 201, product);
}

async function handleUpdateOrder(res, orderId, body) {
  const allowed = new Set([
    "new",
    "accepted",
    "packing",
    "ready",
    "shipped",
    "delivered",
    "cancelled",
  ]);
  if (!allowed.has(body.status)) return sendError(res, 400, "Invalid order status.");

  const store = await readStore();
  const order = store.orders.find((item) => item.id === orderId);
  if (!order) return sendError(res, 404, "Order not found.");

  const previousStatus = order.status;
  order.status = body.status;

  if (activeStatus(previousStatus) && body.status === "cancelled") {
    for (const item of order.items) {
      const product = store.inventory.find((entry) => entry.id === item.productId);
      if (product) {
        product.stock += item.quantity;
        product.reserved = Math.max(0, product.reserved - item.quantity);
        product.updatedAt = new Date().toISOString();
      }
    }
  }

  if (activeStatus(previousStatus) && body.status === "delivered") {
    for (const item of order.items) {
      const product = store.inventory.find((entry) => entry.id === item.productId);
      if (product) {
        product.reserved = Math.max(0, product.reserved - item.quantity);
        product.updatedAt = new Date().toISOString();
      }
    }
  }

  await writeStore(store);
  broadcast({ type: "order-updated", order, orders: store.orders, inventory: store.inventory });
  return sendJson(res, 200, order);
}

async function handleUpdateInventory(res, productId, body) {
  const store = await readStore();
  const product = store.inventory.find((item) => item.id === productId);
  if (!product) return sendError(res, 404, "Product not found.");

  for (const key of ["stock", "reserved", "price", "mrp", "reorderPoint"]) {
    if (key in body) product[key] = safeNumber(body[key], product[key]);
  }
  if ("active" in body) product.active = Boolean(body.active);
  product.updatedAt = new Date().toISOString();

  await writeStore(store);
  broadcast({ type: "inventory-updated", product, inventory: store.inventory });
  return sendJson(res, 200, product);
}

function handleEvents(req, res) {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
    "access-control-allow-origin": "*",
  });
  clients.add(res);
  readStore().then((store) => {
    res.write(`data: ${JSON.stringify({ type: "snapshot", ...store })}\n\n`);
  });
  req.on("close", () => clients.delete(res));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  if (req.method === "OPTIONS") return sendJson(res, 204, {});

  try {
    if (req.method === "GET" && url.pathname === "/") {
      return sendJson(res, 200, {
        name: "Menmitha Admin API",
        ok: true,
        adminPanel: `${FRONTEND_URL}/admin`,
        endpoints: [
          "GET /api/health",
          "GET /api/admin/session",
          "GET /api/inventory",
          "POST /api/inventory",
          "PUT /api/inventory/:productId",
          "GET /api/orders",
          "POST /api/orders",
          "PATCH /api/orders/:orderId",
          "GET /api/events",
        ],
      });
    }
    if (req.method === "GET" && url.pathname === "/admin") {
      return sendRedirect(res, `${FRONTEND_URL}/admin`);
    }
    if (req.method === "GET" && url.pathname === "/api") {
      return sendJson(res, 200, {
        ok: true,
        health: "/api/health",
        inventory: "/api/inventory",
        orders: "/api/orders",
      });
    }
    if (req.method === "GET" && url.pathname === "/api/health") {
      return sendJson(res, 200, { ok: true });
    }
    if (req.method === "GET" && url.pathname === "/api/admin/session") {
      if (!requireAdmin(req, res, url)) return;
      return sendJson(res, 200, { ok: true });
    }
    if (req.method === "GET" && url.pathname === "/api/events") {
      if (!requireAdmin(req, res, url)) return;
      return handleEvents(req, res);
    }
    if (req.method === "GET" && url.pathname === "/api/inventory") {
      const store = await readStore();
      return sendJson(res, 200, store.inventory);
    }
    if (req.method === "POST" && url.pathname === "/api/inventory") {
      if (!requireAdmin(req, res, url)) return;
      return handleCreateInventory(res, await readBody(req));
    }
    if (req.method === "GET" && url.pathname === "/api/orders") {
      if (!requireAdmin(req, res, url)) return;
      const store = await readStore();
      return sendJson(res, 200, store.orders);
    }
    if (req.method === "POST" && url.pathname === "/api/orders") {
      return handleCreateOrder(res, await readBody(req));
    }

    const orderMatch = url.pathname.match(/^\/api\/orders\/([^/]+)$/);
    if (req.method === "PATCH" && orderMatch) {
      if (!requireAdmin(req, res, url)) return;
      return handleUpdateOrder(res, decodeURIComponent(orderMatch[1]), await readBody(req));
    }

    const inventoryMatch = url.pathname.match(/^\/api\/inventory\/([^/]+)$/);
    if (req.method === "PUT" && inventoryMatch) {
      if (!requireAdmin(req, res, url)) return;
      return handleUpdateInventory(res, decodeURIComponent(inventoryMatch[1]), await readBody(req));
    }

    return sendError(res, 404, "Not found.");
  } catch (error) {
    return sendError(res, 500, error instanceof Error ? error.message : "Server error.");
  }
});

server.listen(PORT, () => {
  console.log(`Menmitha admin API listening on http://localhost:${PORT}`);
});
