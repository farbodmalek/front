"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCartStore } from "@/features/cart/store";
import { formatPrice } from "@/lib/utils/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = items.length === 0;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-h1 font-light text-ink mb-10">سبد خرید</h1>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-16">
            {/* لیست آیتم‌ها */}
            <div>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.variantId}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-5 py-6 border-b border-line">
                      <div className="w-24 h-32 bg-line/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-ink-muted text-small">تصویر</span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-body text-ink">{item.title}</h3>
                            <p className="text-small text-ink-muted mt-1">
                              {item.attributes.map((a) => a.value).join(" / ")}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            aria-label="حذف از سبد"
                            className="text-ink-muted hover:text-rosewood-dark transition-colors"
                          >
                            <X size={18} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(q) => updateQuantity(item.variantId, q)}
                          />
                          <span className="text-body text-ink">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link
                href="/products"
                className="inline-block mt-8 text-body text-ink-muted hover:text-ink transition-colors"
              >
                ادامه خرید
              </Link>
            </div>

            {/* خلاصه سفارش */}
            <motion.div
              layout
              className="border border-line p-6 h-fit sticky top-28"
            >
              <h2 className="text-h2 font-light text-ink mb-6">خلاصه سفارش</h2>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-body">
                  <span className="text-ink-muted">جمع کالاها</span>
                  <span className="text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-body">
                  <span className="text-ink-muted">هزینه ارسال</span>
                  <span className="text-ink-muted">در مرحله بعد</span>
                </div>
              </div>

              <div className="flex justify-between text-body border-t border-line pt-4 mb-8">
                <span className="text-ink">مجموع</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full">
                  ادامه فرآیند خرید
                </Button>
              </Link>
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <ShoppingBag size={40} strokeWidth={1.2} className="text-ink-muted mb-6" />
      <h2 className="text-h2 font-light text-ink mb-2">سبد خرید شما خالی است</h2>
      <p className="text-body text-ink-muted mb-8">
        محصولی برای نمایش وجود ندارد. نگاهی به کالکشن جدید بیندازید.
      </p>
      <Link href="/products">
        <Button size="lg">مشاهده محصولات</Button>
      </Link>
    </motion.div>
  );
}
