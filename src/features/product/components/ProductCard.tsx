"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useQuickViewStore } from "../store/quickView";

export interface ProductCardData {
  slug: string;
  title: string;
  categoryName: string;
  basePrice: number;
  discountPrice?: number;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const hasDiscount = !!product.discountPrice;
  const openQuickView = useQuickViewStore((s) => s.open);

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="aspect-[3/4] bg-line/40 overflow-hidden relative">
          <motion.div
            className="w-full h-full flex items-center justify-center text-ink-muted text-small"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            تصویر محصول
          </motion.div>

          {hasDiscount && (
            <span className="absolute top-3 right-3 bg-sage text-cream text-small px-2 py-1">
              تخفیف
            </span>
          )}

          {/* دکمه مشاهده سریع — فقط روی هاور نمایان می‌شود */}
          <button
            onClick={handleQuickView}
            aria-label="مشاهده سریع"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-cream text-ink text-small px-4 py-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md hover:bg-ink hover:text-cream"
          >
            <Eye size={15} strokeWidth={1.5} />
            مشاهده سریع
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-1">
          <span className="text-small text-ink-muted">{product.categoryName}</span>
          <h3 className="text-body text-ink group-hover:text-rosewood-dark transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-body text-rosewood-dark">
                  {formatPrice(product.discountPrice!)}
                </span>
                <span className="text-small text-ink-muted line-through">
                  {formatPrice(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="text-body text-ink">{formatPrice(product.basePrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
