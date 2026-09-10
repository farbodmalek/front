export type ProductAttribute = {
  name: string;   // مثلاً "سایز" یا "رنگ"
  value: string;  // مثلاً "38-40" یا "قرمز"
};

export type ProductVariant = {
  id: string;
  attributes: ProductAttribute[];
  stock: number;
  priceOverride?: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  basePrice: number;
  discountPrice?: number;
  images: string[];
  variants: ProductVariant[];
};
