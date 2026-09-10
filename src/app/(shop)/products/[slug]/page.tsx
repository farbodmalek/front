"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { ProductGallery } from "@/features/product/components/ProductGallery";
import {
  VariantSelector,
  findMatchingVariant,
} from "@/features/product/components/VariantSelector";
import { Product } from "@/features/product/types";
import { getFinalPrice } from "@/features/product/utils";
import { formatPrice } from "@/lib/utils/format";
import { useCartStore } from "@/features/cart/store";

// نمونه داده — بعداً با فراخوانی API واقعی بر اساس params.slug جایگزین می‌شود
function getMockProduct(slug: string): Product {
  return {
    id: "1",
    title: "پیراهن مجلسی حریر",
    slug,
    description:
      "پیراهن مجلسی از پارچه حریر درجه‌یک، مناسب مهمانی و مراسم شب. دارای آستر داخلی و دوخت دست‌دوز روی یقه.",
    category: { id: "c1", name: "لباس مجلسی", slug: "lebas-majlesi" },
    basePrice: 1850000,
    discountPrice: 1490000,
    images: ["1", "2", "3", "4"],
    variants: [
      { id: "v1", attributes: [{ name: "سایز", value: "36" }, { name: "رنگ", value: "مشکی" }], stock: 5 },
      { id: "v2", attributes: [{ name: "سایز", value: "38" }, { name: "رنگ", value: "مشکی" }], stock: 0 },
      { id: "v3", attributes: [{ name: "سایز", value: "40" }, { name: "رنگ", value: "مشکی" }], stock: 3 },
      { id: "v4", attributes: [{ name: "سایز", value: "36" }, { name: "رنگ", value: "بردو" }], stock: 2 },
      { id: "v5", attributes: [{ name: "سایز", value: "38" }, { name: "رنگ", value: "بردو" }], stock: 4 },
    ],
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = useMemo(() => getMockProduct(params.slug), [params.slug]);
  const addItem = useCartStore((s) => s.addItem);

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const matchedVariant = findMatchingVariant(product.variants, selectedAttributes);
  const allAttributesSelected =
    Object.keys(selectedAttributes).length ===
    new Set(product.variants.flatMap((v) => v.attributes.map((a) => a.name))).size;

  const canAddToCart = !!matchedVariant && matchedVariant.stock > 0;
  const finalPrice = getFinalPrice(product);
  const hasDiscount = !!product.discountPrice;

  function handleSelect(attributeName: string, value: string) {
    setSelectedAttributes((prev) => ({ ...prev, [attributeName]: value }));
    setAdded(false);
  }

  function handleAddToCart() {
    if (!matchedVariant) return;
    addItem({
      variantId: matchedVariant.id,
      productId: product.id,
      title: product.title,
      image: product.images[0],
      price: matchedVariant.priceOverride ?? finalPrice,
      quantity,
      attributes: matchedVariant.attributes,
    });
    setAdded(true);
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* مسیر ناوبری */}
        <nav className="text-small text-ink-muted mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-ink">خانه</Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-ink">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <ProductGallery imageCount={product.images.length} />

          <div>
            <p className="text-small text-ink-muted mb-2">{product.category.name}</p>
            <h1 className="text-h1 font-light text-ink mb-4">{product.title}</h1>

            <div className="flex items-center gap-3 mb-8">
              {hasDiscount ? (
                <>
                  <span className="text-h2 text-rosewood-dark">
                    {formatPrice(product.discountPrice!)}
                  </span>
                  <span className="text-body text-ink-muted line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                </>
              ) : (
                <span className="text-h2 text-ink">{formatPrice(product.basePrice)}</span>
              )}
            </div>

            <p className="text-body text-ink-muted leading-8 mb-10">
              {product.description}
            </p>

            <div className="mb-10">
              <VariantSelector
                variants={product.variants}
                selectedAttributes={selectedAttributes}
                onSelect={handleSelect}
              />
            </div>

            {allAttributesSelected && !canAddToCart && (
              <p className="text-small text-rosewood-dark mb-4">
                این ترکیب در حال حاضر موجود نیست
              </p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={matchedVariant?.stock ?? 99}
              />
              <Button
                size="lg"
                className="flex-1"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
              >
                {added ? "به سبد اضافه شد" : "افزودن به سبد خرید"}
              </Button>
              <button
                aria-label="افزودن به علاقه‌مندی‌ها"
                className="w-12 h-12 flex items-center justify-center border border-line text-ink-muted hover:text-rosewood-dark hover:border-rosewood transition-colors"
              >
                <Heart size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
