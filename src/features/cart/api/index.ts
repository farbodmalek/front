import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { CartItem } from "../types";

// شکل پاسخ سرور (CartDto)
type ApiCartItem = {
  variantId: string;
  productId: string;
  title: string;
  image?: string | null;
  price: number;
  quantity: number;
  stock: number;
  attributes: { name: string; value: string }[];
};
type ApiCart = { items: ApiCartItem[] };

function toItems(cart: ApiCart): CartItem[] {
  return cart.items.map((i) => ({
    variantId: i.variantId,
    productId: i.productId,
    title: i.title,
    image: i.image ?? "",
    price: i.price,
    quantity: i.quantity,
    stock: i.stock,
    attributes: i.attributes ?? [],
  }));
}

export async function fetchCart(): Promise<CartItem[]> {
  const { data } = await apiClient.get<ApiCart>(ENDPOINTS.cart);
  return toItems(data);
}

export async function addCartItem(variantId: string, quantity: number): Promise<CartItem[]> {
  const { data } = await apiClient.post<ApiCart>(ENDPOINTS.cartItems, { variantId, quantity });
  return toItems(data);
}

export async function setCartItemQuantity(variantId: string, quantity: number): Promise<CartItem[]> {
  const { data } = await apiClient.put<ApiCart>(ENDPOINTS.cartItem(variantId), { quantity });
  return toItems(data);
}

export async function removeCartItem(variantId: string): Promise<CartItem[]> {
  const { data } = await apiClient.delete<ApiCart>(ENDPOINTS.cartItem(variantId));
  return toItems(data);
}

export async function clearServerCart(): Promise<CartItem[]> {
  const { data } = await apiClient.delete<ApiCart>(ENDPOINTS.cart);
  return toItems(data);
}

// سبد مهمان (localStorage) را بعد از ورود به سبد سرور اضافه می‌کند
export async function mergeCart(lines: { variantId: string; quantity: number }[]): Promise<CartItem[]> {
  const { data } = await apiClient.post<ApiCart>(ENDPOINTS.cartMerge, { items: lines });
  return toItems(data);
}
