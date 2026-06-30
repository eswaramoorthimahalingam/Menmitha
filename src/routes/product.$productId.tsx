import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Heart,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";

import { OrderConfirmationModal } from "@/components/order-confirmation-modal";
import { SiteFooter } from "@/components/site-footer";
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
              to="/shop"
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
      <PageBand crumb={`Home / ${product.category} / ${product.name}`} />

      <main className="retail-shell py-10">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.95fr]">
          <section className="grid gap-4 md:grid-cols-[76px_1fr]">
            <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:items-center">
              {gallery.map((image) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`h-20 w-20 shrink-0 border bg-white p-2 ${
                    selectedImage === image ? "border-ruby" : "border-border"
                  }`}
                  aria-label="Select product image"
                >
                  <img src={image} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
            <div className="order-1 flex aspect-[3/4] max-h-[760px] min-h-[430px] items-center justify-center overflow-hidden bg-muted/45 p-4 md:order-2">
              <img
                src={selectedImage || product.img}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <p className="text-xs font-extrabold text-ruby">{product.category}</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight lg:text-4xl">
                {product.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-ruby">(2 Reviews)</span>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              {product.mrp && product.mrp > product.price && (
                <span className="pb-1 text-lg text-muted-foreground line-through">
                  ₹{product.mrp}
                </span>
              )}
              <span className="text-2xl font-extrabold text-ruby">₹{product.price}</span>
            </div>

            <ul className="space-y-2 border-b border-border pb-5 text-sm leading-6 text-muted-foreground">
              <li>- {product.description}</li>
              <li>- Prepared in small batches with traditional quality checks</li>
              <li>- Packed for everyday cooking, gifting and family pantry use</li>
            </ul>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-14 text-sm font-extrabold">Size:</span>
                {[product.unit, "Family Pack", "Bulk"].map((item, index) => (
                  <button
                    key={item}
                    className={`border px-4 py-2 text-xs font-bold ${
                      index === 0 ? "border-ruby text-ruby" : "border-border bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="w-14 text-sm font-extrabold">Type:</span>
                <span className="h-7 w-7 border-2 border-white bg-leaf shadow-[0_0_0_1px_var(--color-border)]" />
                <span className="h-7 w-7 border-2 border-white bg-gold shadow-[0_0_0_1px_var(--color-border)]" />
              </div>
            </div>

            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm font-extrabold">
                <Clock3 className="h-4 w-4 text-ruby" /> Hurry up! Sale ends in:
              </p>
              <div className="flex gap-2">
                {[
                  ["735", "Days"],
                  ["02", "Hrs"],
                  ["40", "Min"],
                  ["22", "Sec"],
                ].map(([value, label]) => (
                  <div key={label} className="w-16 border border-border bg-white py-2 text-center">
                    <p className="text-sm font-extrabold">{value}</p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
              {product.mrp && product.mrp > product.price && (
                <span className="bg-ruby/10 px-3 py-2 text-xs font-extrabold text-ruby">
                  Save {discount}%
                </span>
              )}
              <span className="text-xs text-muted-foreground">Est. delivery time 2-3 days</span>
            </div>

            <div className="retail-panel p-5">
              <form onSubmit={placeOrder} className="space-y-4">
                <div className="flex gap-3">
                  <div className="inline-flex h-11 items-center border border-border bg-white">
                    <button
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      type="button"
                      className="flex h-10 w-10 items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity((current) => Math.min(Math.max(1, availableStock), current + 1))
                      }
                      type="button"
                      className="flex h-10 w-10 items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    disabled={status === "placing" || availableStock <= 0}
                    className="retail-button h-11 flex-1 px-6 disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {status === "placing" ? "Placing..." : "Add to cart"}
                  </button>
                </div>
                <button
                  disabled={status === "placing" || availableStock <= 0}
                  className="flex h-11 w-full items-center justify-center bg-black px-6 text-xs font-extrabold uppercase tracking-wide text-white disabled:opacity-50"
                >
                  Buy now
                </button>

                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  <input
                    required
                    value={customer.name}
                    onChange={(event) => updateCustomer("name", event.target.value)}
                    placeholder="Name"
                    className="h-11 border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ruby/40"
                  />
                  <input
                    required
                    value={customer.phone}
                    onChange={(event) => updateCustomer("phone", event.target.value)}
                    placeholder="Phone"
                    className="h-11 border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ruby/40"
                  />
                  <textarea
                    required
                    value={customer.address}
                    onChange={(event) => updateCustomer("address", event.target.value)}
                    placeholder="Delivery address"
                    rows={3}
                    className="resize-none border border-border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ruby/40 md:col-span-2"
                  />
                  <input
                    value={customer.notes}
                    onChange={(event) => updateCustomer("notes", event.target.value)}
                    placeholder="Notes"
                    className="h-11 border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ruby/40 md:col-span-2"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Estimated total</span>
                  <span className="text-xl font-extrabold text-ruby">₹{total}</span>
                </div>
              </form>

              {message && (
                <div
                  className={`mt-4 px-4 py-3 text-sm ${
                    status === "placed"
                      ? "bg-leaf/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-5 text-sm">
              <button className="inline-flex items-center gap-2 hover:text-ruby">
                <Heart className="h-4 w-4" /> Add to Wishlist
              </button>
              <span className="inline-flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-4 w-4" /> In Stock ({availableStock})
              </span>
            </div>
          </section>
        </div>

        <section className="retail-panel mt-16">
          <div className="border-b border-border px-6 pt-5">
            <div className="flex gap-8">
              <button className="border-b-2 border-ruby pb-4 text-sm font-extrabold text-ruby">
                Description
              </button>
              <button className="pb-4 text-sm font-extrabold">Product Details</button>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold">About This Item</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {product.description ||
                "Prepared in small batches with traditional methods and carefully selected ingredients."}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Product orders created here are sent directly to the admin live queue with stock
              reserved automatically.
            </p>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold">Related products</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to="/product/$productId"
                  params={{ productId: item.id }}
                  className="group bg-white"
                >
                  <div className="aspect-square bg-muted/45 p-6">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-bold leading-5">{item.name}</h3>
                  <p className="mt-1 text-sm font-extrabold text-ruby">₹{item.price}</p>
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
      <SiteFooter />
    </div>
  );
}

function PageBand({ crumb }: { crumb: string }) {
  return (
    <section className="page-band py-9 text-center">
      <p className="text-xs font-semibold text-muted-foreground">{crumb}</p>
    </section>
  );
}
