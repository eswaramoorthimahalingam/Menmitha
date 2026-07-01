import { ChevronDown, Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { BUSINESS_INFO, BUSINESS_LINKS } from "@/lib/business-info";

type SiteNavbarProps = {
  cartCount?: number;
  onCart?: () => void;
};

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", hasMenu: true },
  { label: "Categories", href: "/shop#categories", badge: "Fresh", hasMenu: true },
  { label: "Products", href: "/shop#products", badge: "Hot", hasMenu: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteNavbar({ cartCount = 0, onCart }: SiteNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("/");
  const cartContent = (
    <>
      <ShoppingBag className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 animate-scale-in items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-primary">
          {cartCount}
        </span>
      )}
    </>
  );

  useEffect(() => {
    const sectionLinks = NAV_LINKS.filter((link) => link.href.includes("#"));
    const sectionIds = sectionLinks
      .map((link) => link.href.split("#")[1])
      .filter((id): id is string => Boolean(id));

    const syncLocation = () => {
      if (window.location.pathname !== "/") {
        setActiveHref(window.location.pathname);
        return;
      }

      setActiveHref(window.location.hash ? `/#${window.location.hash.slice(1)}` : "/");
    };

    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      if (window.location.pathname !== "/") return;
      if (window.scrollY < 240) setActiveHref("/");
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("hashchange", syncLocation);
    onScroll();
    syncLocation();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveHref(`/#${visible.target.id}`);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", syncLocation);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="border-b border-gold/50 bg-primary text-xs text-primary-foreground">
        <div className="mx-auto flex max-w-[100rem] items-center justify-between px-6 py-2.5">
          <a
            href={BUSINESS_LINKS.primaryPhone}
            className="font-semibold transition-colors hover:text-gold"
          >
            Call us: {BUSINESS_INFO.primaryPhone}
          </a>
          <span className="hidden font-semibold md:inline">
            Free shipping across India on orders above ₹999{" "}
            <a href="/shop" className="text-gold underline decoration-gold/70 underline-offset-2">
              Shop now
            </a>
          </span>
          <span className="hidden sm:inline">GSTIN: {BUSINESS_INFO.gstin}</span>
        </div>
      </div>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "border-b border-primary/15 bg-white/95 text-foreground shadow-card backdrop-blur"
            : "border-b border-gold/25 bg-cream/95 text-foreground backdrop-blur"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[100rem] items-center justify-between gap-6 px-6">
          <a href="/" className="flex shrink-0 items-center">
            <BrandLogo />
          </a>

          <nav className="hidden items-center gap-8 text-xs font-extrabold uppercase tracking-wide lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveHref(link.href)}
                className={`nav-link inline-flex items-center gap-1.5 ${
                  activeHref === link.href ? "nav-link-active" : ""
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="rounded-sm bg-gold px-1.5 py-0.5 text-[9px] leading-none text-primary shadow-sm shadow-gold/20">
                    {link.badge}
                  </span>
                )}
                {link.hasMenu && <ChevronDown className="h-3 w-3" />}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 text-foreground">
            <button
              className="rounded-full p-2.5 text-primary transition-colors hover:bg-accent hover:text-primary"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              className="hidden rounded-full p-2.5 text-primary transition-colors hover:bg-accent hover:text-primary sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            <a
              href="/account"
              className="rounded-full p-2.5 text-primary transition-colors hover:bg-accent hover:text-primary"
              aria-label="Account"
            >
              <UserRound className="h-5 w-5" />
            </a>
            {onCart ? (
              <button
                onClick={onCart}
                className="relative rounded-full p-2.5 text-primary transition-colors hover:bg-accent hover:text-primary"
                aria-label="Cart"
              >
                {cartContent}
              </button>
            ) : (
              <a
                href="/shop"
                className="relative rounded-full p-2.5 text-primary transition-colors hover:bg-accent hover:text-primary"
                aria-label="Shop products"
              >
                {cartContent}
              </a>
            )}
            <button
              className="rounded-full p-2.5 text-primary transition-colors hover:bg-accent hover:text-primary lg:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
