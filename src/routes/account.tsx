import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut, Mail, MapPin, Phone, Save, UserRound } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import { SiteNavbar } from "@/components/site-navbar";
import {
  type CustomerAccount,
  getCurrentCustomer,
  signOutCustomer,
  updateCurrentCustomer,
} from "@/lib/auth";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — Menmitha Food Products" },
      { name: "description", content: "Manage your Menmitha customer account." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerAccount>();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const current = getCurrentCustomer();
    if (!current) {
      void navigate({ to: "/signin" });
      return;
    }

    setCustomer(current);
    setForm({
      name: current.name,
      phone: current.phone ?? "",
      address: current.address ?? "",
    });
  }, [navigate]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updated = updateCurrentCustomer(form);
    setCustomer(updated);
    setMessage("Account details saved.");
  };

  const logout = () => {
    signOutCustomer();
    void navigate({ to: "/signin" });
  };

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-gradient-cream text-foreground">
      <SiteNavbar />
      <main className="mx-auto max-w-[100rem] px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Storefront
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf/10 text-primary">
              <UserRound className="h-8 w-8" />
            </div>
            <h1 className="mt-5 font-display text-4xl">My account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Signed in as {customer.name}</p>

            <div className="mt-6 space-y-3 text-sm">
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-leaf" /> {customer.email}
              </p>
              {customer.phone && (
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-leaf" /> {customer.phone}
                </p>
              )}
              {customer.address && (
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-leaf" /> {customer.address}
                </p>
              )}
            </div>

            <button
              onClick={logout}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </section>

          <section className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-leaf">
              Delivery profile
            </p>
            <h2 className="mt-2 font-display text-3xl">Saved details</h2>

            <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
                  Name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  className="admin-input"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
                  Phone
                </span>
                <input
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  className="admin-input"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
                  Delivery address
                </span>
                <textarea
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                  rows={5}
                  className="admin-input resize-none"
                />
              </label>
              {message && (
                <div className="rounded-lg bg-leaf/10 px-4 py-3 text-sm text-primary md:col-span-2">
                  {message}
                </div>
              )}
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground md:col-span-2">
                <Save className="h-4 w-4" /> Save details
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
