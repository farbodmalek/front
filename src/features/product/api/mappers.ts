import { ProductCardData } from "../components/ProductCard";
import { Product } from "../types";
import { ApiProductDetail, ApiProductListItem } from "./types";

// بک‌اند → کارت محصول
export function toCardData(p: ApiProductListItem): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    imageUrl: p.primaryImageUrl ?? undefined,
    categoryName: p.categoryName,
    basePrice: p.basePrice,
    discountPrice: p.discountPrice ?? undefined,
  };
}

// بک‌اند → صفحه‌ی جزئیات محصول
export function toProduct(p: ApiProductDetail): Product {
  // اگر یکی از واریانت‌ها «قیمت قبل از تخفیف» (compareAtPrice) بالاتر از قیمت خودش داشته باشد، تخفیف دارد
  const discounted = p.variants.find(
    (v) => v.compareAtPrice != null && v.compareAtPrice > v.price
  );

  return {
    id: p.id,
    title: p.name,
    slug: p.slug,
    description: p.description ?? "",
    // بک‌اند slug دسته را نمی‌دهد؛ فعلاً شناسه‌ی دسته در لینک می‌آید
    category: { id: String(p.categoryId), name: p.categoryName, slug: String(p.categoryId) },
    basePrice: discounted?.compareAtPrice ?? p.basePrice,
    discountPrice: discounted ? discounted.price : undefined,
    images: p.imageUrls,
    variants: p.variants.map((v) => ({
      id: v.id,
      attributes: Object.entries(v.attributes ?? {}).map(([name, value]) => ({ name, value })),
      stock: v.stockQuantity,
      priceOverride: v.price,
    })),
  };
}
