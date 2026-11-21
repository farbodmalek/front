import axios from "axios";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { toProduct } from "./mappers";
import { ApiProductDetail } from "./types";
import { Product } from "../types";

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// اگر محصول پیدا نشود (404) مقدار null برمی‌گرداند
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await apiClient.get<ApiProductDetail>(
      ENDPOINTS.productBySlug(encodeURIComponent(safeDecode(slug)))
    );
    return toProduct(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}
