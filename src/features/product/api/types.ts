// شکل داده‌ها دقیقاً مطابق خروجی ProductController (SarafBackend)

export type ApiProductListItem = {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  discountPrice?: number | null;
  primaryImageUrl?: string | null;
  categoryName: string;
  brandName?: string | null;
  isFeatured: boolean;
};

export type ApiProductVariant = {
  id: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stockQuantity: number;
  attributes: Record<string, string>;
};

export type ApiProductDetail = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  status: string;
  categoryId: number;
  categoryName: string;
  brandId?: number | null;
  brandName?: string | null;
  createdAt: string;
  imageUrls: string[];
  variants: ApiProductVariant[];
};

export type ApiPagedResult<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};
