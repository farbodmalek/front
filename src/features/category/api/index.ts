import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export type Category = {
  id: number;
  parentId?: number | null;
  name: string;
  slug: string;
  isActive: boolean;
  productCount: number;
};

// دسته‌بندی‌های فعال (عمومی)
export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>(ENDPOINTS.categories);
  return data;
}
