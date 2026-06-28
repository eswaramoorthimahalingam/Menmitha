import { CheckCircle2, ShoppingBag, X } from "lucide-react";

type OrderConfirmationModalProps = {
  open: boolean;
  orderId?: string;
  total?: number;
  onClose: () => void;
};

export function OrderConfirmationModal({
  open,
  orderId,
  total,
  onClose,
}: OrderConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-elegant">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Close order confirmation"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf/10 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-display text-3xl">Order placed</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your order has been received and sent to the live admin order queue.
        </p>

        <div className="mt-6 grid gap-3 rounded-lg bg-muted/60 p-4 text-left text-sm">
          {orderId && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-semibold text-foreground">{orderId}</span>
            </div>
          )}
          {typeof total === "number" && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold text-primary">₹{total}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue shopping
        </button>
      </div>
    </div>
  );
}
