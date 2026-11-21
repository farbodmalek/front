"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, Heart } from "lucide-react";
import { useWishlistStore } from "@/features/wishlist/store";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { useQuickViewStore } from "../store/quickView";

export interface ProductCardData {
  id?: string;
  imageUrl?: string;
  slug: string;
  title: string;
  categoryName: string;
  basePrice: number;
  discountPrice?: number;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const hasDiscount = !!product.discountPrice;
  const openQuickView = useQuickViewStore((s) => s.open);
  const router = useRouter();
  const inWishlist = useWishlistStore((s) => (product.id ? s.ids.includes(product.id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.id) return;
    const result = await toggleWishlist(product.id);
    if (result === null) router.push("/login?redirect=/wishlist");
  }

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
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              "تصویر محصول"
            )}
          </motion.div>

          {product.id && (
            <button
              onClick={handleWishlist}
              aria-label={inWishlist ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
              className="absolute top-3 left-3 z-10 w-9 h-9 bg-cream/90 flex items-center justify-center text-ink-muted hover:text-rosewood-dark transition-colors"
            >
              <Heart
                size={17}
                strokeWidth={1.5}
                className={cn(inWishlist && "fill-rosewood-dark text-rosewood-dark")}
              />
            </button>
          )}

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
