import { Link, createFileRoute } from "@tanstack/react-router";
import {
  type CSSProperties,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Leaf,
  Truck,
  ShieldCheck,
  BadgePercent,
  RotateCcw,
  ShoppingBag,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  X,
  PackageCheck,
} from "lucide-react";
import heroImg from "@/assets/hero-products.jpg";
import oilImg from "@/assets/oil-pour.jpg";
import masalaImg from "@/assets/masala-bowls.jpg";
import kadalaiBanner from "@/assets/product-banners/kadalai.png";
import kambuBanner from "@/assets/product-banners/kambu.png";
import malliBanner from "@/assets/product-banners/malli.png";
import manjalBanner from "@/assets/product-banners/manjal.png";
import milagaiBanner from "@/assets/product-banners/milagai.png";
import naattuSarkaraiBanner from "@/assets/product-banners/naattu-sarkarai.png";
import ragiBanner from "@/assets/product-banners/ragi.png";
import sambarBanner from "@/assets/product-banners/sambar.png";
import shikakaiBanner from "@/assets/product-banners/shikakai.png";
import siruthaniyaBanner from "@/assets/product-banners/siruthaniya.png";
import wheatBanner from "@/assets/product-banners/wheat.png";
import storyImg from "@/assets/story-craft.jpg";
import { OrderConfirmationModal } from "@/components/order-confirmation-modal";
import { ProductShowcaseCard } from "@/components/product-showcase-card";
import { SiteFooter } from "@/components/site-footer";
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
    links: [{ rel: "canonical", href: "https://menmithafoodproducts.com/" }],
  }),
  component: Home,
});

const FEATURES = [
  { icon: Truck, title: "Free Shipping", sub: "Above ₹999 only" },
  { icon: ShieldCheck, title: "Certified Organic", sub: "100% guarantee" },
  { icon: BadgePercent, title: "Huge Savings", sub: "At lowest price" },
  { icon: RotateCcw, title: "Easy Returns", sub: "No questions asked" },
];

const HERO_PICKS = [
  {
    name: "Naatu Sarkarai",
    sub: "Natural sweetener",
    price: "₹65",
    img: naattuSarkaraiBanner,
    productId: "jaggery-powder-500g",
  },
  {
    name: "Sambar Thool",
    sub: "Home-made masala",
    price: "₹40",
    img: sambarBanner,
    productId: "sambar-masala-200g",
  },
  {
    name: "Manjal Thool",
    sub: "Golden turmeric",
    price: "₹25",
    img: manjalBanner,
    productId: "manjal-powder-200g",
  },
];

const CATEGORY_BANNERS = [
  {
    title: "Naatu Sarkarai",
    sub: "100% natural country sugar with rich traditional sweetness.",
    img: naattuSarkaraiBanner,
    accent: "oklch(0.42 0.1 45)",
    productId: "jaggery-powder-500g",
  },
  {
    title: "Kambu",
    sub: "Pearl millet goodness for everyday fibre and nourishment.",
    img: kambuBanner,
    accent: "oklch(0.5 0.16 130)",
    productId: "kambu-500g",
  },
  {
    title: "Ragi Maavu",
    sub: "Calcium-rich ragi flour prepared for wholesome family meals.",
    img: ragiBanner,
    accent: "oklch(0.48 0.02 250)",
    productId: "ragi-flour-500g",
  },
  {
    title: "Kadalai Maavu",
    sub: "Protein-rich gram flour for snacks, batters and traditional recipes.",
    img: kadalaiBanner,
    accent: "oklch(0.62 0.13 70)",
    productId: "kadalai-flour-500g",
  },
  {
    title: "Kothumai Maavu",
    sub: "Fine wheat flour made for soft chapatis and everyday cooking.",
    img: wheatBanner,
    accent: "oklch(0.48 0.08 55)",
    productId: "wheat-flour-1kg",
  },
  {
    title: "Siruthaniya Maavu",
    sub: "A nourishing millet mix made with carefully selected grains.",
    img: siruthaniyaBanner,
    accent: "oklch(0.58 0.05 72)",
    productId: "siruthaniya-health-mix-500g",
  },
  {
    title: "Shikakai Thool",
    sub: "Traditional herbal powder prepared without artificial additives.",
    img: shikakaiBanner,
    accent: "oklch(0.35 0.1 38)",
    productId: "shikakai-powder-200g",
  },
  {
    title: "Milagai Thool",
    sub: "Bright red chilli powder with natural aroma and heat.",
    img: milagaiBanner,
    accent: "oklch(0.55 0.2 28)",
    productId: "milagai-powder-200g",
  },
  {
    title: "Sambar Thool",
    sub: "Aromatic spice blend for soulful South Indian sambar.",
    img: sambarBanner,
    accent: "oklch(0.62 0.15 55)",
    productId: "sambar-masala-200g",
  },
  {
    title: "Malli Thool",
    sub: "Coriander powder with warm fragrance and clean flavour.",
    img: malliBanner,
    accent: "oklch(0.62 0.1 82)",
    productId: "malli-powder-200g",
  },
  {
    title: "Manjal Thool",
    sub: "Golden turmeric powder, naturally vibrant and earthy.",
    img: manjalBanner,
    accent: "oklch(0.74 0.16 85)",
    productId: "manjal-powder-200g",
  },
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
      <SiteFooter />
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section id="home" className="commerce-hero">
      <div
        className="commerce-hero-media"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      />
      <div className="commerce-hero-scrim" />

      <div className="commerce-hero-inner">
        <div className="commerce-hero-copy">
          <div className="commerce-hero-kicker reveal">
            <Leaf className="h-3.5 w-3.5" /> Traditional South Indian pantry
          </div>
          <h1 className="reveal">Pure staples for homes that still cook with care.</h1>
          <p className="reveal">
            Cold-pressed oils, home-made masalas, millet flours and natural sweeteners packed fresh
            for everyday family kitchens.
          </p>
          <div className="commerce-hero-actions reveal">
            <Link
              to="/product/$productId"
              params={{ productId: "sambar-masala-200g" }}
              className="commerce-hero-primary"
            >
              Buy best seller <ShoppingBag className="h-4 w-4" />
            </Link>
            <a href="#shop" className="commerce-hero-secondary">
              Shop categories <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="commerce-hero-proof reveal">
            <div className="flex items-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span>Trusted by 5,000+ households</span>
            <span>Free delivery above ₹999</span>
          </div>
        </div>

        <div className="commerce-hero-picks reveal" aria-label="Featured products">
          {HERO_PICKS.map((item) => (
            <Link
              key={item.productId}
              to="/product/$productId"
              params={{ productId: item.productId }}
              className="commerce-hero-pick"
            >
              <img src={item.img} alt={item.name} />
              <span>
                <strong>{item.name}</strong>
                <small>{item.sub}</small>
              </span>
              <em>{item.price}</em>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Feature strip ---------- */
function FeatureStrip() {
  return (
    <section className="commerce-benefits">
      <div className="mx-auto grid max-w-[100rem] grid-cols-2 gap-px px-6 md:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, sub }, i) => (
          <div
            key={title}
            className="commerce-benefit reveal"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <Icon className="h-5 w-5" />
            <div>
              <p>{title}</p>
              <span>{sub}</span>
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
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const activeBanner = CATEGORY_BANNERS[activeBannerIndex];
  const cats = [
    {
      name: "Cold-Pressed Oils",
      category: "Cold-Pressed Oils",
      img: PRODUCT_IMAGES.oil,
      productId: "groundnut-oil-1l",
      tone: "oklch(0.76 0.17 75)",
      soft: "oklch(0.92 0.08 68)",
      count: products.filter((p) => p.category === "Cold-Pressed Oils").length,
    },
    {
      name: "Home-Made Masalas",
      category: "Home-Made Masalas",
      img: PRODUCT_IMAGES.masala,
      productId: "sambar-masala-200g",
      tone: "oklch(0.69 0.17 18)",
      soft: "oklch(0.91 0.07 22)",
      count: products.filter((p) => p.category === "Home-Made Masalas").length,
    },
    {
      name: "Jaggery & Sweeteners",
      category: "Jaggery & Sweeteners",
      img: PRODUCT_IMAGES.jaggery,
      productId: "jaggery-powder-500g",
      tone: "oklch(0.66 0.14 190)",
      soft: "oklch(0.91 0.05 190)",
      count: products.filter((p) => p.category === "Jaggery & Sweeteners").length,
    },
    {
      name: "Flours & Staples",
      category: "Flours & Staples",
      img: PRODUCT_IMAGES.wheat,
      productId: "wheat-flour-1kg",
      tone: "oklch(0.62 0.16 142)",
      soft: "oklch(0.91 0.06 142)",
      count: products.filter((p) => p.category === "Flours & Staples").length,
    },
  ];
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBannerIndex((current) => (current + 1) % CATEGORY_BANNERS.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const showPreviousBanner = () => {
    setActiveBannerIndex(
      (current) => (current - 1 + CATEGORY_BANNERS.length) % CATEGORY_BANNERS.length,
    );
  };
  const showNextBanner = () => {
    setActiveBannerIndex((current) => (current + 1) % CATEGORY_BANNERS.length);
  };

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

        <div
          className="category-banner-slider reveal"
          style={{ "--banner-accent": activeBanner.accent } as CSSProperties}
        >
          <div className="category-banner-copy">
            <p>Featured product</p>
            <h3>{activeBanner.title}</h3>
            <span>{activeBanner.sub}</span>
            <Link
              to="/product/$productId"
              params={{ productId: activeBanner.productId }}
              className="category-banner-cta"
            >
              Shop now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Link
            to="/product/$productId"
            params={{ productId: activeBanner.productId }}
            className="category-banner-frame"
            aria-label={`View ${activeBanner.title}`}
          >
            <img src={activeBanner.img} alt={activeBanner.title} />
          </Link>

          <button
            onClick={showPreviousBanner}
            className="category-banner-arrow left-4"
            aria-label="Previous product banner"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={showNextBanner}
            className="category-banner-arrow right-4"
            aria-label="Next product banner"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="category-banner-thumbs" aria-label="Product banner slides">
            {CATEGORY_BANNERS.map((banner, index) => (
              <button
                key={banner.title}
                onClick={() => setActiveBannerIndex(index)}
                className={index === activeBannerIndex ? "is-active" : ""}
                aria-label={`Show ${banner.title}`}
              >
                <img src={banner.img} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-16 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c, i) => {
            return (
              <Link
                key={c.name}
                to="/product/$productId"
                params={{ productId: c.productId }}
                className="category-showcase-card reveal"
                style={
                  {
                    "--card-accent": c.tone,
                    "--card-soft": c.soft,
                    transitionDelay: `${i * 80}ms`,
                  } as CSSProperties
                }
              >
                <div className="category-showcase-image">
                  <img src={c.img} alt={c.name} loading="lazy" />
                </div>
                <div className="category-showcase-content">
                  <span>Shop category</span>
                  <h3>{c.name}</h3>
                  <p>{c.count} products</p>
                  <div className="category-showcase-button">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </div>
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
        <div className="grid gap-x-6 gap-y-16 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductShowcaseCard key={p.id} product={p} index={i} onAdd={onAdd} />
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
