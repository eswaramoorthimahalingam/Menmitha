import { Link, createFileRoute } from "@tanstack/react-router";
import { type Dispatch, type FormEvent, type SetStateAction, useEffect, useState } from "react";
import {
  Leaf,
  Truck,
  ShieldCheck,
  BadgePercent,
  RotateCcw,
  ShoppingBag,
  Heart,
  Star,
  ArrowRight,
  Plus,
  Minus,
  X,
  PackageCheck,
} from "lucide-react";
import heroImg from "@/assets/hero-products.jpg";
import oilImg from "@/assets/oil-pour.jpg";
import masalaImg from "@/assets/masala-bowls.jpg";
import storyImg from "@/assets/story-craft.jpg";
import { OrderConfirmationModal } from "@/components/order-confirmation-modal";
import { SiteNavbar } from "@/components/site-navbar";
import { CATALOG_PRODUCTS, PRODUCT_IMAGES, type Order, type Product } from "@/data/catalog";
import { createOrder, fetchInventory, getApiBase } from "@/lib/admin-api";
import { mergeInventoryProducts } from "@/lib/product-utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Menmitha Food Products — Cold-Pressed Oils & Home-Made Masalas" },
      {
        name: "description",
        content:
          "Made the traditional way. Cold-pressed chekku oils, home-made masalas, jaggery and natural staples — no chemicals, no preservatives.",
      },
      { property: "og:title", content: "Menmitha Food Products" },
      {
        property: "og:description",
        content: "From our home to your home — honest food made with care.",
      },
    ],
  }),
  component: Home,
});

const FEATURES = [
  { icon: Truck, title: "Free Shipping", sub: "Above ₹999 only" },
  { icon: ShieldCheck, title: "Certified Organic", sub: "100% guarantee" },
  { icon: BadgePercent, title: "Huge Savings", sub: "At lowest price" },
  { icon: RotateCcw, title: "Easy Returns", sub: "No questions asked" },
];

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 },
    );

    const observeReveal = (root: ParentNode = document) => {
      root.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => io.observe(el));
    };

    observeReveal();
    const mutations = new MutationObserver((entries) => {
      entries.forEach((entry) => {
        entry.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(".reveal")) io.observe(node);
          observeReveal(node);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      io.disconnect();
    };
  }, []);
}

function Home() {
  useReveal();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(CATALOG_PRODUCTS);
  useEffect(() => {
    fetchInventory()
      .then((inventory) => setProducts(mergeInventoryProducts(inventory)))
      .catch(() => setProducts(CATALOG_PRODUCTS));
  }, []);

  const addToCart = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    setCartOpen(true);
  };
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const bestSellers = products.filter((product) => product.featured).slice(0, 8);
  const trending = products.filter((product) => product.trending).slice(0, 8);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar cartCount={cartCount} onCart={() => setCartOpen(true)} />
      <Hero />
      <FeatureStrip />
      <Story />
      <CategoryBand products={products} />
      <ProductGrid
        title="Best Selling Products"
        eyebrow="Loved by our families"
        items={bestSellers.length ? bestSellers : products.slice(0, 8)}
        onAdd={addToCart}
      />
      <OilStory />
      <MasalaStory />
      <Promo />
      <ProductGrid
        title="Trending Products"
        eyebrow="Fresh from our kitchen"
        items={trending.length ? trending : products.slice(0, 8)}
        onAdd={addToCart}
      />
      <Marquee />
      <Reviews />
      <Newsletter />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        setCart={setCart}
        products={products}
      />
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-hero text-primary-foreground"
    >
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.04_150)] via-[oklch(0.14_0.04_150)/0.6] to-transparent" />

      {/* floating leaves */}
      <Leaf className="absolute top-20 right-10 h-24 w-24 text-leaf/30 float-slow" />
      <Leaf className="absolute bottom-24 left-12 h-16 w-16 text-leaf/30 float-slower -rotate-45" />
      <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-leaf/15 blur-3xl spin-slow" />

      <div className="relative mx-auto max-w-[100rem] px-6 py-28 lg:py-40 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-7">
          <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs uppercase tracking-[0.2em]">
            <Leaf className="h-3.5 w-3.5 text-leaf" /> Menmitha Food Products
          </div>
          <h1 className="reveal font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-balance">
            Made the <span className="italic text-gold">Traditional</span> Way.
          </h1>
          <p className="reveal max-w-xl text-lg text-primary-foreground/80 leading-relaxed">
            Every ingredient is carefully selected and processed without chemicals or preservatives.
            We preserve native food traditions while ensuring quality, hygiene and trust — from our
            home to yours.
          </p>
          <div className="reveal flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#shop"
              className="btn-shine inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-gold text-primary font-semibold shadow-glow hover:scale-[1.02] transition-transform"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/25 hover:bg-white/10 transition-colors text-sm"
            >
              Our Story
            </a>
          </div>
          <div className="reveal flex items-center gap-6 pt-4 text-sm text-primary-foreground/70">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-primary bg-gradient-to-br from-leaf to-gold"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1">Trusted by 5,000+ households across South India</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="reveal relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-gold blur-3xl opacity-30 spin-slow" />
            <img
              src={PRODUCT_IMAGES.jaggery}
              alt="Jaggery powder"
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl float-slow"
            />
            <div className="absolute top-6 -left-6 z-20 bg-background text-foreground rounded-2xl p-4 shadow-elegant float-slower">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-leaf/15 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-leaf" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">100%</p>
                  <p className="text-sm font-semibold">Chemical-free</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 -right-4 z-20 bg-background text-foreground rounded-2xl p-4 shadow-elegant float-slow">
              <p className="text-xs text-muted-foreground">Cold pressed</p>
              <p className="text-sm font-semibold">Wooden chekku</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Feature strip ---------- */
function FeatureStrip() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-[100rem] px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {FEATURES.map(({ icon: Icon, title, sub }, i) => (
          <div
            key={title}
            className="reveal flex items-center gap-4 px-6 py-7"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Story ---------- */
function Story() {
  return (
    <section id="story" className="py-24 lg:py-32 bg-gradient-cream">
      <div className="mx-auto max-w-[100rem] px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div className="reveal relative mx-auto w-full max-w-3xl lg:max-w-2xl">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-primary opacity-10 blur-2xl" />
          <img
            src={storyImg}
            alt="Crafted with care"
            className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-elegant"
          />
          <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl p-5 shadow-elegant max-w-[220px]">
            <p className="text-3xl font-display text-primary">25+</p>
            <p className="text-xs text-muted-foreground mt-1">
              years of traditional recipes carried from our home to yours
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <p className="reveal text-xs uppercase tracking-[0.25em] text-leaf font-semibold">
            Our Story
          </p>
          <h2 className="reveal font-display text-4xl lg:text-5xl text-balance">
            Crafted with Care, Rooted in Tradition.
          </h2>
          <p className="reveal text-muted-foreground text-lg leading-relaxed">
            At Menmitha, every jar tells the story of patient hands and time-honoured methods. We
            select native ingredients, sun-dry them the way our grandmothers did, and stone-grind in
            small batches — so every spoon carries the soul of South Indian kitchens.
          </p>
          <ul className="reveal space-y-3 pt-2">
            {[
              "Single-origin ingredients from trusted farmers",
              "Cold-pressed in wooden chekku, never refined",
              "Sun-dried and stone-ground in small batches",
              "No preservatives, no colours, no chemicals — ever",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-1 h-5 w-5 rounded-full bg-leaf/15 flex items-center justify-center">
                  <Leaf className="h-3 w-3 text-leaf" />
                </span>
                <span className="text-foreground/85">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Category band ---------- */
function CategoryBand({ products }: { products: Product[] }) {
  const cats = [
    {
      name: "Cold-Pressed Oils",
      category: "Cold-Pressed Oils",
      img: PRODUCT_IMAGES.oil,
      count: products.filter((p) => p.category === "Cold-Pressed Oils").length,
    },
    {
      name: "Home-Made Masalas",
      category: "Home-Made Masalas",
      img: PRODUCT_IMAGES.masala,
      count: products.filter((p) => p.category === "Home-Made Masalas").length,
    },
    {
      name: "Jaggery & Sweeteners",
      category: "Jaggery & Sweeteners",
      img: PRODUCT_IMAGES.jaggery,
      count: products.filter((p) => p.category === "Jaggery & Sweeteners").length,
    },
    {
      name: "Flours & Staples",
      category: "Flours & Staples",
      img: PRODUCT_IMAGES.wheat,
      count: products.filter((p) => p.category === "Flours & Staples").length,
    },
  ];
  return (
    <section id="shop" className="py-20">
      <div className="mx-auto max-w-[100rem] px-6">
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <div>
            <p className="reveal text-xs uppercase tracking-[0.25em] text-leaf font-semibold">
              Shop by category
            </p>
            <h2 className="reveal font-display text-4xl lg:text-5xl mt-2">
              Pantry essentials, the old way.
            </h2>
          </div>
          <a
            href="#"
            className="reveal text-sm font-medium text-primary inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            View all categories <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cats.map((c, i) => {
            const targetProduct = products.find((product) => product.category === c.category);

            return (
              <Link
                key={c.name}
                to="/product/$productId"
                params={{ productId: targetProduct?.id ?? CATALOG_PRODUCTS[0].id }}
                className="reveal group relative rounded-3xl overflow-hidden bg-card border border-border product-card"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="aspect-[4/5] bg-gradient-cream flex items-center justify-center">
                  <img src={c.img} alt={c.name} className="h-56 w-56 object-contain" />
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl">{c.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.count} products</p>
                  </div>
                  <span className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:rotate-45 transition-transform">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Product Grid ---------- */
function ProductGrid({
  title,
  eyebrow,
  items,
  onAdd,
}: {
  title: string;
  eyebrow: string;
  items: Product[];
  onAdd: (id: string) => void;
}) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[100rem] px-6">
        <div className="text-center mb-12">
          <p className="reveal text-xs uppercase tracking-[0.25em] text-leaf font-semibold">
            {eyebrow}
          </p>
          <h2 className="reveal font-display text-4xl lg:text-5xl mt-2">{title}</h2>
          <div className="reveal mx-auto mt-5 h-2 w-24 leaf-divider" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((p, i) => (
            <article
              key={p.id}
              className="product-card group relative rounded-3xl overflow-hidden bg-card border border-border"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="relative aspect-square bg-gradient-cream overflow-hidden">
                <Link
                  to="/product/$productId"
                  params={{ productId: p.id }}
                  className="block h-full"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-8"
                  />
                  {p.tag && (
                    <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-primary text-primary-foreground">
                      {p.tag}
                    </span>
                  )}
                </Link>
                <button
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <Link to="/product/$productId" params={{ productId: p.id }}>
                    <h3 className="font-display text-lg leading-tight hover:text-primary">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">{p.tagline}</p>
                </div>
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground">(128)</span>
                </div>
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <span className="text-lg font-semibold text-primary">₹{p.price}</span>
                    {p.mrp && (
                      <span className="ml-2 text-xs text-muted-foreground line-through">
                        ₹{p.mrp}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onAdd(p.id)}
                    className="btn-shine inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:scale-[1.03] transition-transform"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Oil & Masala story panels ---------- */
function OilStory() {
  const lines = [
    "Pure chekku oils made using the traditional wooden cold-press method.",
    "High-quality seeds are carefully selected for oil extraction.",
    "The slow pressing process retains natural aroma and nutrients.",
    "Unrefined and free from chemicals or preservatives.",
    "Groundnut, sesame and coconut oils — equal care, every batch.",
  ];
  return (
    <section
      id="oils"
      className="py-24 bg-primary text-primary-foreground relative overflow-hidden scroll-mt-24"
    >
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl" />
      <div className="mx-auto max-w-[100rem] px-6 grid lg:grid-cols-2 gap-14 items-center relative">
        <div className="reveal relative order-2 mx-auto w-full max-w-3xl lg:order-1 lg:max-w-2xl">
          <img
            src={oilImg}
            alt="Cold pressed oil"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-elegant"
          />
          <div className="absolute -top-6 -left-6 bg-gradient-gold text-primary rounded-2xl px-5 py-4 shadow-elegant">
            <p className="text-xs uppercase tracking-widest">Wooden Chekku</p>
            <p className="font-display text-xl">Cold Pressed</p>
          </div>
        </div>
        <div className="space-y-6 order-1 lg:order-2">
          <p className="reveal text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            The Menmitha Way
          </p>
          <h2 className="reveal font-display text-4xl lg:text-5xl text-balance">
            Cold-pressed oil, the way it was meant to be.
          </h2>
          <ul className="space-y-3 pt-2">
            {lines.map((l, i) => (
              <li
                key={i}
                className="reveal flex items-start gap-3 text-primary-foreground/85"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold flex-none" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MasalaStory() {
  const lines = [
    "Home-made masalas prepared with care and traditional expertise.",
    "Only high-quality, natural spices are selected for every blend.",
    "Cleaned, sun-dried and ground using traditional methods.",
    "No artificial colours, preservatives or chemicals — ever.",
    "Small batches that reflect authentic South Indian taste.",
  ];
  return (
    <section id="masalas" className="py-24 bg-gradient-cream scroll-mt-24">
      <div className="mx-auto max-w-[100rem] px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div className="space-y-6">
          <p className="reveal text-xs uppercase tracking-[0.25em] text-leaf font-semibold">
            From our kitchen
          </p>
          <h2 className="reveal font-display text-4xl lg:text-5xl text-balance">
            Home-made masalas, sun-dried for soul.
          </h2>
          <ul className="space-y-3 pt-2">
            {lines.map((l, i) => (
              <li
                key={i}
                className="reveal flex items-start gap-3 text-foreground/85"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-leaf flex-none" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal relative mx-auto w-full max-w-3xl lg:max-w-2xl">
          <img
            src={masalaImg}
            alt="Home made masalas"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-elegant"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Promo banner ---------- */
function Promo() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[100rem] px-6">
        <div className="reveal relative overflow-hidden rounded-3xl bg-gradient-primary text-primary-foreground p-10 lg:p-16 shadow-elegant">
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl spin-slow" />
          <Leaf className="absolute right-10 top-10 h-32 w-32 text-white/10" />
          <div className="relative max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              Limited time
            </p>
            <h2 className="font-display text-4xl lg:text-6xl text-balance">
              Get 25% off on your first purchase.
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              No registration needed. Code applied automatically at checkout.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href="#shop"
                className="btn-shine inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-gold text-primary font-semibold hover:scale-[1.02] transition-transform"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </a>
              <span className="inline-flex items-center px-5 py-3.5 rounded-full border border-white/25 text-sm font-mono tracking-widest">
                MENMITHA25
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Marquee ---------- */
function Marquee() {
  const words = [
    "Cold-Pressed",
    "Hand-Crafted",
    "Sun-Dried",
    "Stone-Ground",
    "Chemical-Free",
    "Small Batch",
    "From Our Home",
  ];
  const row = [...words, ...words];
  return (
    <section className="py-10 border-y border-border bg-card overflow-hidden">
      <div className="flex w-max marquee-track gap-12 whitespace-nowrap">
        {row.map((w, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-12 text-3xl lg:text-5xl font-display text-foreground/30"
          >
            <span>{w}</span>
            <Leaf className="h-7 w-7 text-leaf shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Reviews ---------- */
function Reviews() {
  const reviews = [
    {
      name: "Priya R.",
      city: "Chennai",
      text: "The groundnut oil has the exact aroma my mother used to bring home from the village mill. Truly authentic.",
      rating: 5,
    },
    {
      name: "Karthik S.",
      city: "Coimbatore",
      text: "Sambar masala tastes like home. You can tell it's small batch — no harshness, just warmth.",
      rating: 5,
    },
    {
      name: "Anitha M.",
      city: "Bengaluru",
      text: "Jaggery powder is clean and naturally sweet. Packaging is sturdy and delivery was fast.",
      rating: 5,
    },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[100rem] px-6">
        <div className="text-center mb-14">
          <p className="reveal text-xs uppercase tracking-[0.25em] text-leaf font-semibold">
            Voices from our kitchen
          </p>
          <h2 className="reveal font-display text-4xl lg:text-5xl mt-2">Customer reviews.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              className="reveal product-card rounded-3xl bg-card border border-border p-8 shadow-card"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="flex items-center gap-1 text-gold mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="font-display text-xl leading-snug text-balance">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary" />
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.city}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */
function Newsletter() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Leaf className="reveal mx-auto h-10 w-10 text-leaf" />
        <h2 className="reveal font-display text-3xl lg:text-4xl mt-4">
          Recipes, traditions and new arrivals.
        </h2>
        <p className="reveal text-muted-foreground mt-3">
          Join our family newsletter for honest food stories and early access to seasonal batches.
        </p>
        <form
          className="reveal mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 px-5 py-3.5 rounded-full bg-card border border-border focus:outline-none focus:ring-2 focus:ring-leaf"
          />
          <button className="btn-shine px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:scale-[1.02] transition-transform">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---------- Cart Drawer ---------- */
function CartDrawer({
  open,
  onClose,
  cart,
  setCart,
  products,
}: {
  open: boolean;
  onClose: () => void;
  cart: Record<string, number>;
  setCart: Dispatch<SetStateAction<Record<string, number>>>;
  products: Product[];
}) {
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", notes: "" });
  const [checkoutState, setCheckoutState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [placedOrder, setPlacedOrder] = useState<Order>();
  const items = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return product ? { ...product, qty } : undefined;
    })
    .filter((item): item is Product & { qty: number } => Boolean(item));
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 70;
  const total = subtotal + shipping;
  const set = (id: string, qty: number) => {
    const next = { ...cart };
    if (qty <= 0) delete next[id];
    else next[id] = qty;
    setCart(next);
  };
  const updateCustomer = (field: keyof typeof customer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };
  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) return;
    setCheckoutState("submitting");
    setCheckoutMessage("");

    try {
      const order = await createOrder({
        customer: {
          ...customer,
          notes: customer.notes.trim() || undefined,
        },
        items: items.map((item) => ({ productId: item.id, quantity: item.qty })),
      });
      setCart({});
      setCheckoutState("success");
      setPlacedOrder(order);
      setCheckoutMessage(`Order ${order.id} received. Total ₹${order.total}.`);
    } catch (error) {
      setCheckoutState("error");
      setCheckoutMessage(
        error instanceof Error ? error.message : `Unable to reach ${getApiBase()}.`,
      );
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card shadow-elegant transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-display text-2xl">Your Basket</h3>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <ShoppingBag className="h-10 w-10 mx-auto opacity-40" />
              <p className="mt-3 text-sm">Your basket is empty.</p>
            </div>
          )}
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 animate-fade-in">
              <div className="h-20 w-20 rounded-2xl bg-gradient-cream flex-none flex items-center justify-center">
                <img src={i.img} alt={i.name} className="h-16 w-16 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{i.name}</p>
                <p className="text-xs text-muted-foreground">{i.tagline}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="inline-flex items-center border border-border rounded-full">
                    <button
                      className="h-7 w-7 flex items-center justify-center"
                      onClick={() => set(i.id, i.qty - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-xs">{i.qty}</span>
                    <button
                      className="h-7 w-7 flex items-center justify-center"
                      onClick={() => set(i.id, i.qty + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-primary">₹{i.price * i.qty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">₹{subtotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-semibold">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-semibold text-primary">₹{total}</span>
          </div>
          <form onSubmit={submitCheckout} className="space-y-3">
            <input
              required
              value={customer.name}
              onChange={(e) => updateCustomer("name", e.target.value)}
              placeholder="Name"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf"
            />
            <input
              required
              value={customer.phone}
              onChange={(e) => updateCustomer("phone", e.target.value)}
              placeholder="Phone"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf"
            />
            <textarea
              required
              value={customer.address}
              onChange={(e) => updateCustomer("address", e.target.value)}
              placeholder="Delivery address"
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf"
            />
            <input
              value={customer.notes}
              onChange={(e) => updateCustomer("notes", e.target.value)}
              placeholder="Notes"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf"
            />
            <button
              disabled={!items.length || checkoutState === "submitting"}
              className="btn-shine w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-40 hover:scale-[1.01] transition-transform"
            >
              {checkoutState === "submitting" ? "Placing order..." : "Place order"}
            </button>
          </form>
          {checkoutMessage && (
            <div
              className={`flex items-start gap-2 rounded-xl px-4 py-3 text-xs ${checkoutState === "success" ? "bg-leaf/10 text-primary" : "bg-destructive/10 text-destructive"}`}
            >
              {checkoutState === "success" && <PackageCheck className="h-4 w-4 flex-none" />}
              <span>{checkoutMessage}</span>
            </div>
          )}
          <p className="text-[11px] text-center text-muted-foreground">
            Free shipping on orders above ₹999
          </p>
        </div>
      </aside>
      <OrderConfirmationModal
        open={Boolean(placedOrder)}
        orderId={placedOrder?.id}
        total={placedOrder?.total}
        onClose={() => setPlacedOrder(undefined)}
      />
    </>
  );
}
