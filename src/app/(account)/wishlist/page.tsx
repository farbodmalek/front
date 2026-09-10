"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";

interface WishlistItem {
  slug: string;
  title: string;
  categoryName: string;
  price: number;
}

const initialWishlist: WishlistItem[] = [
  { slug: "p1", title: "پیراهن مجلسی حریر", categoryName: "لباس مجلسی", price: 1490000 },
  { slug: "p3", title: "ست لباس زیر دنتلا", categoryName: "لباس زیر", price: 640000 },
  { slug: "p8", title: "شلوار جین راسته", categoryName: "پوشاک روزمره", price: 720000 },
];

export default function WishlistPage() {
  const [items, setItems] = useState(initialWishlist);

  function handleRemove(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  return (
    <div>
      <h1 className="text-h1 font-light text-ink mb-10">علاقه‌مندی‌ها</h1>

      {items.length === 0 ? (
        <p className="text-body text-ink-muted">
          هنوز محصولی به لیست علاقه‌مندی‌ها اضافه نکرده‌اید.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <button
                  onClick={() => handleRemove(item.slug)}
                  aria-label="حذف از علاقه‌مندی‌ها"
                  className="absolute top-2 left-2 z-10 w-8 h-8 bg-cream/90 flex items-center justify-center text-ink-muted hover:text-rosewood-dark transition-colors"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>

                <Link href={`/products/${item.slug}`} className="block">
                  <div className="aspect-[3/4] bg-line/40 flex items-center justify-center">
                    <span className="text-ink-muted text-small">تصویر محصول</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-small text-ink-muted">{item.categoryName}</span>
                    <h3 className="text-body text-ink">{item.title}</h3>
                    <span className="text-body text-ink">{formatPrice(item.price)}</span>
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
