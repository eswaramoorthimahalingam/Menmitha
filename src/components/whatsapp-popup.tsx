import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

import { BUSINESS_INFO, BUSINESS_LINKS } from "@/lib/business-info";

export function WhatsAppPopup() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-3">
      {open && (
        <div className="w-[min(20rem,calc(100vw-2.5rem))] border border-border bg-white p-4 text-foreground shadow-elegant">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold">Menmitha Food Products</p>
              <p className="mt-1 text-sm text-muted-foreground">
                WhatsApp: {BUSINESS_INFO.whatsapp}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close WhatsApp popup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <a
            href={BUSINESS_LINKS.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessageCircle className="h-4 w-4" />
            Open WhatsApp
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elegant transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366]/45 focus:ring-offset-2"
        aria-label="Open WhatsApp popup"
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </div>
  );
}
