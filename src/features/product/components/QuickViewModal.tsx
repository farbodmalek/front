"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useQuickViewStore } from "../store/quickView";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCartStore } from "@/features/cart/store";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const demoSizes = ["36", "38", "40", "42"];

export function QuickViewModal() {
  const { product, isOpen, close } = useQuickViewStore();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // ریست وضعیت هر بار که محصول جدیدی باز می‌شود
  useEffect(() => {
    if (isOpen) {
      setSelectedSize(null);
      setQuantity(1);
      setAdded(false);
    }
  }, [isOpen, product?.slug]);

  // بستن مودال با کلید Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [close]);

  function handleAddToCart() {
    if (!product || !selectedSize) return;
    addItem({
      variantId: `${product.slug}-${selectedSize}`,
      productId: product.slug,
      title: product.title,
      image: "",
      price: product.discountPrice ?? product.basePrice,
      quantity,
      attributes: [{ name: "سایز", value: selectedSize }],
    });
    setAdded(true);
  }

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
        >
          {/* پس‌زمینه تیره */}
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            onClick={close}
          />

          {/* پنل مودال */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl bg-surface shadow-[0_40px_80px_-20px_rgba(43,38,34,0.25)] grid grid-cols-1 md:grid-cols-2"
          >
            <button
              onClick={close}
              aria-label="بستن"
              className="absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center bg-cream/90 text-ink-muted hover:text-ink transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <div className="aspect-square md:aspect-auto bg-line/40 flex items-center justify-center">
              <span className="text-ink-muted text-small">تصویر محصول</span>
            </div>

            <div className="p-8 flex flex-col">
              <span className="text-small text-ink-muted mb-2">{product.categoryName}</span>
              <h2 className="text-h2 font-light text-ink mb-4">{product.title}</h2>

              <div className="flex items-center gap-3 mb-8">
                {product.discountPrice ? (
                  <>
                    <span className="text-h2 text-rosewood-dark">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-body text-ink-muted line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-h2 text-ink">{formatPrice(product.basePrice)}</span>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-body text-ink mb-3">سایز</h3>
                <div className="flex flex-wrap gap-2">
                  {demoSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setAdded(false);
                      }}
                      className={cn(
                        "w-11 h-11 border text-small transition-colors",
                        selectedSize === size
                          ? "bg-ink text-cream border-ink"
                          : "border-line text-ink-muted hover:border-ink hover:text-ink"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!selectedSize}
                  onClick={handleAddToCart}
                >
                  {added ? "به سبد اضافه شد" : "افزودن به سبد خرید"}
                </Button>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={close}
                className="text-small text-ink-muted hover:text-ink text-center transition-colors"
              >
                مشاهده کامل محصول
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
