"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/features/cart/store";
import { formatPrice } from "@/lib/utils/format";

export function OrderSummarySidebar({ shippingCost = 0 }: { shippingCost?: number }) {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  return (
    <motion.div layout className="border border-line p-6 h-fit sticky top-28">
      <h2 className="text-h2 font-light text-ink mb-6">سفارش شما</h2>

      <div className="flex flex-col gap-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <div className="w-14 h-18 bg-line/40 flex items-center justify-center flex-shrink-0 text-small text-ink-muted">
              تصویر
            </div>
            <div className="flex-1">
              <p className="text-small text-ink">{item.title}</p>
              <p className="text-small text-ink-muted mt-1">
                {item.attributes.map((a) => a.value).join(" / ")} × {item.quantity}
              </p>
            </div>
            <span className="text-small text-ink">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4 mb-4">
        <div className="flex justify-between text-body">
          <span className="text-ink-muted">جمع کالاها</span>
          <span className="text-ink">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-body">
          <span className="text-ink-muted">هزینه ارسال</span>
          <span className="text-ink">
            {shippingCost === 0 ? "—" : formatPrice(shippingCost)}
          </span>
        </div>
      </div>

      <div className="flex justify-between text-body border-t border-line pt-4">
        <span className="text-ink">مجموع</span>
        <span className="text-ink">{formatPrice(total)}</span>
      </div>
    </motion.div>
  );
}
