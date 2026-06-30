import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Mail, MapPin, Phone, Send, Truck } from "lucide-react";
import { type FormEvent, useState } from "react";

import heroProductsImg from "@/assets/hero-products.jpg";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Menmitha Food Products" },
      {
        name: "description",
        content:
          "Contact Menmitha Food Products for orders, delivery support and wholesale enquiries.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />
      <PageBand title="Contact Us" crumb="Home / Contact Us" />

      <main className="retail-shell py-10">
        <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="map-grid relative min-h-[430px] overflow-hidden">
            <div className="absolute left-6 top-6 max-w-xs bg-white p-5 shadow-card">
              <p className="font-extrabold">Menmitha Food Products</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Traditional pantry staples prepared and packed in Tamil Nadu, India.
              </p>
              <p className="mt-3 text-xs font-bold text-ruby">4.9 ★ Customer support</p>
            </div>
            <div className="absolute left-[53%] top-[47%] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ruby/20 p-2">
              <div className="h-full w-full rounded-full bg-ruby" />
            </div>
          </div>

          <form onSubmit={submit} className="bg-muted/45 p-7 md:p-9">
            <h2 className="text-3xl font-semibold">Get In Touch With Us</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For direct orders, delivery questions or wholesale requests, send us a note.
            </p>

            <div className="mt-6 space-y-4">
              <label className="grid gap-2 text-sm font-semibold md:grid-cols-[120px_1fr] md:items-center">
                <span>Subject</span>
                <select className="h-11 border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ruby/40">
                  <option>Customer service</option>
                  <option>Bulk order</option>
                  <option>Delivery support</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold md:grid-cols-[120px_1fr] md:items-center">
                <span>Email address</span>
                <input
                  required
                  type="email"
                  placeholder="your@email.com"
                  className="h-11 border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ruby/40"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold md:grid-cols-[120px_1fr] md:items-start">
                <span className="md:pt-3">Message</span>
                <textarea
                  required
                  rows={7}
                  placeholder="How can we help?"
                  className="resize-none border border-border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ruby/40"
                />
              </label>
              <label className="ml-0 flex items-start gap-3 text-xs text-muted-foreground md:ml-[120px]">
                <input
                  required
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-[var(--color-ruby)]"
                />
                <span>I agree to the terms and conditions and the privacy policy</span>
              </label>
              <div className="flex justify-end">
                <button className="retail-button px-8 py-3">
                  <Send className="h-4 w-4" /> Send
                </button>
              </div>
              {sent && (
                <p className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-primary">
                  Thanks. Your message is ready for follow-up.
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="mt-12 grid bg-muted/45 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [MapPin, "Tamil Nadu, India", "Traditional food products"],
              [Phone, "Call us", "+91 98765 43210"],
              [Mail, "Mail us", "hello@menmitha.com"],
              [Clock3, "Open time", "10:00AM - 6:00PM"],
            ] as const
          ).map(([Icon, title, text]) => (
            <div key={title} className="flex items-center gap-4 border-border p-6 lg:border-r">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ruby text-ruby">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-16 overflow-hidden bg-white">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div className="p-8 text-center lg:p-12">
              <Truck className="mx-auto h-9 w-9 text-ruby" />
              <h2 className="mt-4 text-3xl font-semibold">Subscribe To Our Newsletter</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                Get restock alerts, seasonal batch notes and simple recipe ideas from the Menmitha
                kitchen.
              </p>
              <form
                onSubmit={(event) => event.preventDefault()}
                className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 flex-1 border border-border px-4 text-sm outline-none focus:ring-2 focus:ring-ruby/40"
                />
                <button className="retail-button px-6">Subscribe</button>
              </form>
            </div>
            <img
              src={heroProductsImg}
              alt="Menmitha products"
              className="h-72 w-full object-cover lg:h-full"
            />
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
