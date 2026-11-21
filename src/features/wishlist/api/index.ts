import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { ProductCardData } from "@/features/product/components/ProductCard";
import { toCardData } from "@/features/product/api/mappers";
import { ApiProductListItem } from "@/features/product/api/types";

export type WishlistProduct = ProductCardData & { id: string };

export async function getWishlist(): Promise<WishlistProduct[]> {
  const { data } = await apiClient.get<ApiProductListItem[]>(ENDPOINTS.wishlist);
  return data.map((p) => ({ ...toCardData(p), id: p.id }));
}

export async function getWishlistIds(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>(ENDPOINTS.wishlistIds);
  return data;
}

export async function addToWishlist(productId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.wishlistItem(productId));
}

export async function removeFromWishlist(productId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.wishlistItem(productId));
}
