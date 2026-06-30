import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Grid3X3, ListFilter, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type ReactNode } from "react";

import { ProductShowcaseCard } from "@/components/product-showcase-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { CATALOG_PRODUCTS, PRODUCT_IMAGES, type Product } from "@/data/catalog";
import { fetchInventory } from "@/lib/admin-api";
import { mergeInventoryProducts } from "@/lib/product-utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Menmitha Food Products" },
      {
        name: "description",
        content:
          "Shop cold-pressed oils, home-made masalas, jaggery, flours and traditional staples from Menmitha.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [products, setProducts] = useState<Product[]>(CATALOG_PRODUCTS);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  useEffect(() => {
    fetchInventory()
      .then((inventory) => setProducts(mergeInventoryProducts(inventory)))
      .catch(() => setProducts(CATALOG_PRODUCTS));
  }, []);

  const filtered = useMemo(() => {
    const scoped =
      category === "All" ? products : products.filter((product) => product.category === category);

    return [...scoped].sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      if (sort === "Newest") return Number(Boolean(b.tag)) - Number(Boolean(a.tag));
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [category, products, sort]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />
      <PageBand title="Shop" crumb="Home / Shop" />

      <main className="retail-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-5">
            <Panel title="Home">
              <nav className="space-y-1 text-sm">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-muted ${
                      category === item ? "font-bold text-ruby" : ""
                    }`}
                  >
                    <span>{item}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </nav>
            </Panel>

            <Panel title="Filter By">
              <div className="space-y-5 text-sm">
                <FilterGroup title="Categories">
                  {categories.slice(1).map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={category === item}
                        onChange={() => setCategory(category === item ? "All" : item)}
                        className="h-4 w-4 accent-[var(--color-ruby)]"
                      />
                      <span>
                        {item} ({products.filter((product) => product.category === item).length})
                      </span>
                    </label>
                  ))}
                </FilterGroup>

                <FilterGroup title="Availability">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 accent-[var(--color-ruby)]" />
                    <span>In stock ({products.filter((product) => product.stock > 0).length})</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 accent-[var(--color-ruby)]" />
                    <span>Small batch ({products.filter((product) => product.tag).length})</span>
                  </label>
                </FilterGroup>

                <FilterGroup title="Price">
                  <p className="text-muted-foreground">₹95 - ₹580</p>
                  <input
                    type="range"
                    min="95"
                    max="580"
                    defaultValue="580"
                    className="w-full accent-[var(--color-ruby)]"
                  />
                </FilterGroup>

                <FilterGroup title="Food Style">
                  {["Cold pressed", "Sun dried", "Stone ground", "Chemical free"].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 accent-[var(--color-ruby)]" />
                      <span>{item}</span>
                    </label>
                  ))}
                </FilterGroup>
              </div>
            </Panel>
          </aside>

          <section>
            <div className="retail-panel p-5">
              <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
                Menmitha brings traditional pantry staples into a clean online shopping experience:
                wooden-chekku oils, home-made spice blends, natural jaggery and stone-ground
                essentials prepared without chemicals or preservatives.
              </p>
            </div>

            <section id="categories" className="mt-8 scroll-mt-28">
              <h2 className="text-lg font-extrabold">Subcategories</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Oils", PRODUCT_IMAGES.oil, "Cold-Pressed Oils"],
                  ["Masalas", PRODUCT_IMAGES.masala, "Home-Made Masalas"],
                  ["Jaggery", PRODUCT_IMAGES.jaggery, "Jaggery & Sweeteners"],
                  ["Flours", PRODUCT_IMAGES.wheat, "Flours & Staples"],
                ].map(([name, image, target]) => (
                  <button
                    key={name}
                    onClick={() => setCategory(target)}
                    className="group retail-panel flex aspect-square flex-col items-center justify-center p-4 text-center transition-colors hover:border-ruby"
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-20 w-20 object-contain transition-transform group-hover:scale-105"
                    />
                    <span className="mt-3 text-sm font-bold">{name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section id="products" className="mt-8 scroll-mt-28">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button className="flex h-9 w-9 items-center justify-center bg-ruby text-white">
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center border border-border bg-white">
                    <ListFilter className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center border border-border bg-white">
                    <Search className="h-4 w-4" />
                  </button>
                  <p className="ml-2 text-sm text-muted-foreground">
                    There are {filtered.length} products.
                  </p>
                </div>

                <label className="flex items-center gap-3 text-sm">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span>Sort by:</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="h-10 min-w-44 border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ruby/40"
                  >
                    {["Featured", "Newest", "Price: Low to High", "Price: High to Low"].map(
                      (item) => (
                        <option key={item}>{item}</option>
                      ),
                    )}
                  </select>
                </label>
              </div>

              <div className="mt-10 grid gap-x-6 gap-y-16 pt-8 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product, index) => (
                  <ProductShowcaseCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function PageBand({ title, crumb }: { title: string; crumb: string }) {
  return (
    <section className="page-band py-9 text-center">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-xs font-semibold text-muted-foreground">{crumb}</p>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="retail-panel">
      <h2 className="border-b border-border bg-muted/55 px-4 py-3 font-extrabold">{title}</h2>
      <div className="p-4">{children}</div>
    </section>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-extrabold">{title}</h3>
      <div className="space-y-2 text-muted-foreground">{children}</div>
    </div>
  );
}
