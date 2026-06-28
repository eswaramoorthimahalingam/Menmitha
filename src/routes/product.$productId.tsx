import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

import { OrderConfirmationModal } from "@/components/order-confirmation-modal";
import { SiteNavbar } from "@/components/site-navbar";
import { CATALOG_PRODUCTS, type Order, type Product } from "@/data/catalog";
import { createOrder, fetchInventory } from "@/lib/admin-api";
import { mergeInventoryProducts, productDiscount, productGallery } from "@/lib/product-utils";

export const Route = createFileRoute("/product/$productId")({
  head: () => ({
    meta: [
      { title: "Product — Menmitha Food Products" },
      {
        name: "description",
        content: "View product details, pricing, stock and place a live Menmitha order.",
      },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const [products, setProducts] = useState<Product[]>(CATALOG_PRODUCTS);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "placing" | "placed" | "error">("idle");
  const [message, setMessage] = useState("");
  const [placedOrder, setPlacedOrder] = useState<Order>();

  useEffect(() => {
    fetchInventory()
      .then((inventory) => setProducts(mergeInventoryProducts(inventory)))
      .catch(() => setProducts(CATALOG_PRODUCTS));
  }, []);

  const product = products.find((item) => item.id === productId);
  const gallery = useMemo(() => (product ? productGallery(product) : []), [product]);

  useEffect(() => {
    setSelectedImage(gallery[0] ?? "");
  }, [gallery]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNavbar />
        <div className="px-6 py-12">
          <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <h1 className="mt-4 font-display text-3xl">Product not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This product may be inactive or unavailable.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = productDiscount(product);
  const availableStock = Math.max(0, product.stock - product.reserved);
  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
  const total = quantity * product.price + (quantity * product.price >= 999 ? 0 : 70);

  const updateCustomer = (field: keyof typeof customer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("placing");
    setMessage("");

    try {
      const order = await createOrder({
        customer: {
          ...customer,
          notes: customer.notes.trim() || undefined,
        },
        items: [{ productId: product.id, quantity }],
      });
      setStatus("placed");
      setPlacedOrder(order);
      setMessage(`Order ${order.id} placed successfully. Total ₹${order.total}.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to place order.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />

      <main className="mx-auto max-w-[100rem] px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="grid gap-4 md:grid-cols-[88px_1fr]">
            <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">
              {gallery.map((image) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`h-20 w-20 shrink-0 rounded-lg border bg-card p-2 ${
                    selectedImage === image ? "border-primary" : "border-border"
                  }`}
                  aria-label="Select product image"
                >
                  <img src={image} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
            <div className="order-1 flex min-h-[420px] items-center justify-center rounded-lg border border-border bg-gradient-cream p-8 md:order-2">
              <img
                src={selectedImage || product.img}
                alt={product.name}
                className="max-h-[520px] w-full object-contain"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-leaf">
                {product.category}
              </p>
              <h1 className="mt-3 font-display text-4xl leading-tight lg:text-5xl">
                {product.name}
              </h1>
              <p className="mt-3 text-muted-foreground">{product.tagline || product.unit}</p>
            </div>

            <div className="flex items-center gap-2 text-gold">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">128 reviews</span>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <span className="text-4xl font-semibold text-primary">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="pb-1 text-lg text-muted-foreground line-through">
                    ₹{product.mrp}
                  </span>
                  <span className="mb-1 rounded-full bg-leaf/10 px-3 py-1 text-xs font-bold text-primary">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Info icon={Truck} title="Delivery" text="Fast dispatch" />
              <Info icon={ShieldCheck} title="Quality" text="No chemicals" />
              <Info icon={CheckCircle2} title="Stock" text={`${availableStock} available`} />
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-display text-2xl">Place product order</h2>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/60 p-3">
                <span className="text-sm font-semibold">Quantity</span>
                <div className="inline-flex items-center rounded-full border border-border bg-background">
                  <button
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="flex h-9 w-9 items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((current) => Math.min(Math.max(1, availableStock), current + 1))
                    }
                    className="flex h-9 w-9 items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <form onSubmit={placeOrder} className="mt-4 space-y-3">
                <input
                  required
                  value={customer.name}
                  onChange={(event) => updateCustomer("name", event.target.value)}
                  placeholder="Name"
                  className="admin-input"
                />
                <input
                  required
                  value={customer.phone}
                  onChange={(event) => updateCustomer("phone", event.target.value)}
                  placeholder="Phone"
                  className="admin-input"
                />
                <textarea
                  required
                  value={customer.address}
                  onChange={(event) => updateCustomer("address", event.target.value)}
                  placeholder="Delivery address"
                  rows={3}
                  className="admin-input resize-none"
                />
                <input
                  value={customer.notes}
                  onChange={(event) => updateCustomer("notes", event.target.value)}
                  placeholder="Notes"
                  className="admin-input"
                />
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">Estimated total</span>
                  <span className="text-xl font-semibold text-primary">₹{total}</span>
                </div>
                <button
                  disabled={status === "placing" || availableStock <= 0}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {status === "placing" ? "Placing order..." : "Order now"}
                </button>
              </form>

              {message && (
                <div
                  className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                    status === "placed"
                      ? "bg-leaf/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.55fr]">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Product description</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {product.description ||
                "Prepared in small batches with traditional methods and carefully selected ingredients."}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Order management</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Product orders created here are sent directly to the admin live queue with stock
              reserved automatically.
            </p>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-3xl">Related products</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to="/product/$productId"
                  params={{ productId: item.id }}
                  className="product-card rounded-lg border border-border bg-card p-4"
                >
                  <div className="aspect-square rounded-md bg-gradient-cream p-5">
                    <img src={item.img} alt={item.name} className="h-full w-full object-contain" />
                  </div>
                  <h3 className="mt-3 font-display text-lg">{item.name}</h3>
                  <p className="text-sm font-semibold text-primary">₹{item.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <OrderConfirmationModal
        open={Boolean(placedOrder)}
        orderId={placedOrder?.id}
        total={placedOrder?.total}
        onClose={() => setPlacedOrder(undefined)}
      />
    </div>
  );
}

function Info({ icon: Icon, title, text }: { icon: typeof Heart; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <Icon className="h-5 w-5 text-leaf" />
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
