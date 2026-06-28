import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { type FormEvent, useState } from "react";

import { SiteNavbar } from "@/components/site-navbar";
import { signUpCustomer } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Menmitha Food Products" },
      { name: "description", content: "Create your Menmitha customer account." },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      signUpCustomer(form);
      void navigate({ to: "/account" });
    } catch (signUpError) {
      setError(signUpError instanceof Error ? signUpError.message : "Unable to create account.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cream text-foreground">
      <SiteNavbar />
      <main className="mx-auto grid min-h-[calc(100vh-128px)] max-w-[100rem] place-items-center px-6 py-16">
        <section className="w-full max-w-xl rounded-3xl border border-border bg-card p-7 shadow-elegant">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Storefront
          </Link>
          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-leaf">
              Join Menmitha
            </p>
            <h1 className="mt-2 font-display text-4xl">Create account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Save your contact details for easier repeat orders.
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="relative block sm:col-span-2">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Full name"
                className="admin-input !pl-12"
                autoComplete="name"
              />
            </label>
            <label className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="Email"
                className="admin-input !pl-12"
                autoComplete="email"
              />
            </label>
            <label className="relative block">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="Phone"
                className="admin-input !pl-12"
                autoComplete="tel"
              />
            </label>
            <label className="relative block sm:col-span-2">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="password"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                placeholder="Password"
                className="admin-input !pl-12"
                autoComplete="new-password"
              />
            </label>
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive sm:col-span-2">
                {error}
              </div>
            )}
            <button className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground sm:col-span-2">
              Create account
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
