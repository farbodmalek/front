"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";
import { getWishlist, removeFromWishlist, WishlistProduct } from "@/features/wishlist/api";
import { useWishlistStore } from "@/features/wishlist/store";
import { getShopErrorMessage } from "@/lib/api/errors";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWishlist()
      .then(setItems)
      .catch((e) => setError(getShopErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(item: WishlistProduct) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    try {
      await removeFromWishlist(item.id);
      void useWishlistStore.getState().load();
    } catch (e) {
      setError(getShopErrorMessage(e));
      setItems((prev) => [item, ...prev]);
    }
  }

  return (
    <div>
      <h1 className="text-h1 font-light text-ink mb-10">علاقه‌مندی‌ها</h1>

      {error && <p className="text-body text-rosewood-dark mb-6">{error}</p>}

      {loading ? (
        <p className="text-body text-ink-muted">در حال بارگذاری...</p>
      ) : items.length === 0 ? (
        <p className="text-body text-ink-muted">هنوز محصولی به لیست علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <button
                  onClick={() => handleRemove(item)}
                  aria-label="حذف از علاقه‌مندی‌ها"
                  className="absolute top-2 left-2 z-10 w-8 h-8 bg-cream/90 flex items-center justify-center text-ink-muted hover:text-rosewood-dark transition-colors"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>

                <Link href={`/products/${item.slug}`} className="block">
                  <div className="aspect-[3/4] bg-line/40 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-ink-muted text-small">تصویر محصول</span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="text-small text-ink-muted">{item.categoryName}</span>
                    <h3 className="text-body text-ink">{item.title}</h3>
                    <span className="text-body text-ink">
                      {formatPrice(item.discountPrice ?? item.basePrice)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
