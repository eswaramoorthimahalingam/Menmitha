import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mail, LockKeyhole, UserPlus } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import { SiteNavbar } from "@/components/site-navbar";
import { getCurrentCustomer, signInCustomer } from "@/lib/auth";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Menmitha Food Products" },
      { name: "description", content: "Sign in to your Menmitha customer account." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getCurrentCustomer()) void navigate({ to: "/account" });
  }, [navigate]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      signInCustomer(email, password);
      void navigate({ to: "/account" });
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Unable to sign in.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cream text-foreground">
      <SiteNavbar />
      <main className="mx-auto grid min-h-[calc(100vh-128px)] max-w-[100rem] place-items-center px-6 py-16">
        <section className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-elegant">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Storefront
          </Link>
          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-leaf">
              Welcome back
            </p>
            <h1 className="mt-2 font-display text-4xl">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access saved details for faster Menmitha orders.
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="admin-input !pl-12"
                autoComplete="email"
              />
            </label>
            <label className="relative block">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="admin-input !pl-12"
                autoComplete="current-password"
              />
            </label>
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <button className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">
              Sign in
            </button>
          </form>

          <Link
            to="/signup"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted"
          >
            <UserPlus className="h-4 w-4" /> Create account
          </Link>
        </section>
      </main>
    </div>
  );
}
