import { createFileRoute } from "@tanstack/react-router";
import { Award, CheckCircle2, Leaf, PackageCheck, Sparkles, Truck } from "lucide-react";
import { useState } from "react";

import heroProductsImg from "@/assets/hero-products.jpg";
import masalaImg from "@/assets/masala-bowls.jpg";
import oilImg from "@/assets/oil-pour.jpg";
import storyImg from "@/assets/story-craft.jpg";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Menmitha Food Products" },
      {
        name: "description",
        content:
          "Learn about Menmitha's traditional food-making methods, ingredient sourcing and small-batch process.",
      },
    ],
    links: [{ rel: "canonical", href: "https://menmithafoodproducts.com/about" }],
  }),
  component: AboutPage,
});

const TABS = {
  Development:
    "Menmitha began with recipes kept alive in family kitchens: oils pressed slowly, spices sun-dried patiently and pantry staples prepared without shortcuts. Our online store keeps that care visible while making it easier for families to order trusted essentials.",
  "Qualified team":
    "Every batch is handled by people who understand traditional preparation and modern hygiene. Ingredients are checked, cleaned, processed in smaller quantities and packed with the attention everyday food deserves.",
  Strategy:
    "We focus on fewer products made better: cold-pressed oils, home-made masalas, jaggery and staples. That lets us maintain quality, freshness and honest communication from sourcing to delivery.",
};

function AboutPage() {
  const [tab, setTab] = useState<keyof typeof TABS>("Development");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />
      <PageBand title="About Us" crumb="Home / About Us" />

      <main>
        <section className="retail-shell py-10">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap justify-center">
              {Object.keys(TABS).map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item as keyof typeof TABS)}
                  className={`border border-border px-8 py-4 text-sm font-extrabold ${
                    tab === item ? "border-b-white bg-white text-ruby" : "bg-muted/45"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="retail-panel -mt-px p-6 text-sm leading-7 text-muted-foreground md:p-8">
              <p>{TABS[tab]}</p>
              <p className="mt-4">
                We combine familiar South Indian taste with clear product information, reliable
                ordering and careful delivery so the store feels as dependable as buying from
                someone you know.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <img
              src={storyImg}
              alt="Menmitha team preparing traditional food products"
              className="h-full min-h-[360px] w-full object-cover"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <img
                src={heroProductsImg}
                alt="Menmitha products"
                className="h-48 w-full object-cover"
              />
              <img src={oilImg} alt="Cold pressed oil" className="h-48 w-full object-cover" />
              <img
                src={masalaImg}
                alt="Home made masalas"
                className="h-48 w-full object-cover sm:col-span-2"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="retail-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-ruby">
                Inspiration, Innovation,
              </p>
              <h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight">
                And traditional care in every everyday product.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  [Leaf, "Native ingredients", "Sourced from trusted farming and spice networks."],
                  [Sparkles, "Clean recipes", "No artificial colours, preservatives or chemicals."],
                  [
                    Award,
                    "Small batches",
                    "Prepared in measured batches for freshness and control.",
                  ],
                  [Truck, "Careful delivery", "Packed for safe dispatch across India."],
                ] as const
              ).map(([Icon, title, text]) => (
                <div key={title} className="retail-panel p-5">
                  <Icon className="h-6 w-6 text-ruby" />
                  <h3 className="mt-4 font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="retail-shell py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {(
              [
                [CheckCircle2, "Select", "Ingredients are chosen for aroma, freshness and purity."],
                [
                  PackageCheck,
                  "Prepare",
                  "Oils, powders and staples are made using traditional methods.",
                ],
                [
                  Truck,
                  "Deliver",
                  "Orders are packed cleanly and sent with simple tracking updates.",
                ],
              ] as const
            ).map(([Icon, title, text]) => (
              <div key={title} className="bg-muted/45 p-7">
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>
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
