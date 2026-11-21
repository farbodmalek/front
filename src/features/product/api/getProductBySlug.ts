import axios from "axios";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { toProduct } from "./mappers";
import { ApiProductDetail } from "./types";
import { Product } from "../types";

// اگر محصول پیدا نشود (404) مقدار null برمی‌گرداند
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await apiClient.get<ApiProductDetail>(
      ENDPOINTS.productBySlug(encodeURIComponent(slug))
    );
    return toProduct(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}
