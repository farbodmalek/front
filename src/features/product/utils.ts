import { Product } from "./types";

export function getFinalPrice(product: Product): number {
  return product.discountPrice ?? product.basePrice;
}
