import {
  BadgeCheck,
  Facebook,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Youtube,
} from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { BUSINESS_INFO, BUSINESS_LINKS } from "@/lib/business-info";

export function SiteFooter() {
  return (
    <footer className="bg-white text-foreground">
      <div className="mx-auto grid max-w-[100rem] gap-10 px-6 py-14 lg:grid-cols-[1.55fr_0.75fr_0.9fr_1.1fr_1fr]">
        <div className="space-y-7">
          <div className="flex items-center gap-5">
            <div className="border-r border-border pr-5">
              <BrandLogo />
            </div>
            <div>
              <p className="text-2xl font-semibold leading-none">Menmitha</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.22em] text-primary">
                Food Products
              </p>
            </div>
          </div>

          <p className="max-w-md text-sm leading-8 text-muted-foreground">
            Nature's wisdom, crafted for your well-being. Traditional foods made with care,
            freshness and honest ingredients.
          </p>

          <div className="space-y-4 text-sm leading-7">
            <p className="flex items-start gap-3">
              <MapPin className="mt-1 h-4 w-4 flex-none text-primary" />
              <span>{BUSINESS_INFO.address}</span>
            </p>
            <a
              href={BUSINESS_LINKS.email}
              className="flex items-center gap-3 transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4 flex-none text-primary" />
              {BUSINESS_INFO.email}
            </a>
          </div>

          <div className="flex gap-3">
            {[
              [Instagram, "Instagram"],
              [Facebook, "Facebook"],
              [Youtube, "YouTube"],
            ].map(([Icon, label]) => (
              <a
                key={label}
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-primary"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Explore"
          links={[
            ["Home", "/"],
            ["About", "/about"],
            ["Shop", "/shop"],
            ["Products", "/shop#products"],
            ["Contact", "/contact"],
          ]}
        />
        <FooterCol
          title="Support"
          links={[
            ["FAQ's", "#"],
            ["Shipping Policy", "#"],
            ["Return & Cancellation", "#"],
            ["Terms of Use", "#"],
            ["Privacy Policy", "#"],
          ]}
        />

        <div>
          <FooterTitle>Trusted Standards</FooterTitle>
          <ul className="mt-7 space-y-7 text-sm">
            <StandardItem icon={Leaf} text="100% Pure & Natural" />
            <StandardItem icon={ShieldCheck} text="Quality Checked" />
            <StandardItem icon={BadgeCheck} text="FSSAI Approved" />
            <li className="flex items-center gap-3">
              <span className="text-lg" aria-hidden="true">
                🧾
              </span>
              <span>GSTIN: {BUSINESS_INFO.gstin}</span>
            </li>
          </ul>
        </div>

        <div>
          <FooterTitle>Working Hours</FooterTitle>
          <div className="mt-7 space-y-5 text-sm">
            <div className="grid grid-cols-[1fr_auto] gap-6">
              <span>Mon - Sat</span>
              <span>9 AM - 7 PM</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-6">
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-7">
            <p className="text-sm font-semibold text-primary">For any queries</p>
            <a
              href={BUSINESS_LINKS.primaryPhone}
              className="mt-4 flex items-center gap-3 text-sm transition-colors hover:text-primary"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
            <a
              href={BUSINESS_LINKS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-3 text-sm transition-colors hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} <span className="font-bold text-foreground">Menmitha</span>.
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: { children: string }) {
  return (
    <div>
      <h4 className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">
        {children}
      </h4>
      <div className="mt-4 h-px bg-border" />
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <FooterTitle>{title}</FooterTitle>
      <ul className="mt-7 space-y-6 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="transition-colors hover:text-primary">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StandardItem({ icon: Icon, text }: { icon: typeof Leaf; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-primary" />
      <span>{text}</span>
    </li>
  );
}
