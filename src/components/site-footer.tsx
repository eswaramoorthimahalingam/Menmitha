import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="bg-primary pb-10 pt-20 text-primary-foreground">
      <div className="mx-auto grid max-w-[100rem] gap-10 px-6 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-4">
          <BrandLogo light />
          <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/75">
            From our home to your home — honest food made the traditional way. No chemicals, no
            preservatives, just care.
          </p>
          <div className="flex gap-3 pt-2">
            {[Instagram, Facebook, Youtube].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            "Cold-Pressed Oils",
            "Home-Made Masalas",
            "Jaggery",
            "Flours & Staples",
            "Herbal Powders",
          ]}
        />
        <FooterCol
          title="Company"
          links={["Our Story", "Our Process", "Blog", "Wholesale", "Contact"]}
        />

        <div className="space-y-3 text-sm lg:col-span-2">
          <h4 className="font-display text-lg">Reach us</h4>
          <p className="flex items-start gap-2 text-primary-foreground/75">
            <MapPin className="mt-0.5 h-4 w-4 flex-none" /> Tamil Nadu, India
          </p>
          <p className="flex items-center gap-2 text-primary-foreground/75">
            <Phone className="h-4 w-4" /> +91 00000 00000
          </p>
          <p className="flex items-center gap-2 text-primary-foreground/75">
            <Mail className="h-4 w-4" /> hello@menmitha.com
          </p>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[100rem] flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 pt-6 text-xs text-primary-foreground/60">
        <p>© {new Date().getFullYear()} Menmitha Food Products. All rights reserved.</p>
        <p>Crafted with care · Rooted in tradition.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="space-y-3 lg:col-span-3">
      <h4 className="font-display text-lg">{title}</h4>
      <ul className="space-y-2 text-sm text-primary-foreground/75">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition-colors hover:text-gold">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
