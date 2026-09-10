"use client";

import { useCartStore } from "@/features/cart/store";
import { formatPrice } from "@/lib/utils/format";

interface ReviewStepProps {
  addressLabel: string;
  shippingLabel: string;
  paymentLabel: string;
}

export function ReviewStep({ addressLabel, shippingLabel, paymentLabel }: ReviewStepProps) {
  const items = useCartStore((s) => s.items);

  return (
    <div className="flex flex-col gap-8">
      <SummaryRow label="آدرس تحویل" value={addressLabel} />
      <SummaryRow label="روش ارسال" value={shippingLabel} />
      <SummaryRow label="روش پرداخت" value={paymentLabel} />

      <div>
        <h3 className="text-body text-ink mb-4">اقلام سفارش</h3>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-body">
              <span className="text-ink-muted">
                {item.title} ({item.attributes.map((a) => a.value).join(" / ")}) × {item.quantity}
              </span>
              <span className="text-ink">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-4">
      <span className="text-small text-ink-muted">{label}</span>
      <span className="text-body text-ink">{value}</span>
    </div>
  );
}
