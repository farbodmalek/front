import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { toCardData } from "./mappers";
import { ApiPagedResult, ApiProductListItem } from "./types";
import { ProductCardData } from "../components/ProductCard";

// همه‌ی محصولات (فیلتر و مرتب‌سازی فعلاً سمت مرورگر انجام می‌شود)
export async function getProducts(pageSize = 100): Promise<ProductCardData[]> {
  const { data } = await apiClient.get<ApiPagedResult<ApiProductListItem>>(ENDPOINTS.products, {
    params: { pageNumber: 1, pageSize },
  });
  return data.items.map(toCardData);
}

// محصولات ویژه‌ی صفحه‌ی اصلی
export async function getFeaturedProducts(pageSize = 4): Promise<ProductCardData[]> {
  const { data } = await apiClient.get<ApiPagedResult<ApiProductListItem>>(
    ENDPOINTS.featuredProducts,
    { params: { pageNumber: 1, pageSize } }
  );
  return data.items.map(toCardData);
}
