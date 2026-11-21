import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { OrderDetail, OrderListItem, OrderStatus } from "@/features/order/api";
import { Category } from "@/features/category/api";
import { ApiPagedResult, ApiProductDetail } from "@/features/product/api/types";

// ---------------- داشبورد ----------------
export type Dashboard = {
  totalProducts: number;
  todayOrders: number;
  pendingOrders: number;
  usersCount: number;
  monthSales: number;
};

export async function getDashboard(): Promise<Dashboard> {
  const { data } = await apiClient.get<Dashboard>(ENDPOINTS.admin.dashboard);
  return data;
}

// ---------------- سفارش‌ها ----------------
export async function getAdminOrders(params: {
  status?: OrderStatus | "all";
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<ApiPagedResult<OrderListItem>> {
  const { data } = await apiClient.get<ApiPagedResult<OrderListItem>>(ENDPOINTS.admin.orders, {
    params: {
      status: params.status && params.status !== "all" ? params.status : undefined,
      searchTerm: params.searchTerm || undefined,
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 50,
    },
  });
  return data;
}

export async function getAdminOrder(orderNumber: string): Promise<OrderDetail> {
  const { data } = await apiClient.get<OrderDetail>(ENDPOINTS.admin.order(orderNumber));
  return data;
}

export async function updateOrderStatus(orderNumber: string, status: OrderStatus): Promise<void> {
  await apiClient.put(ENDPOINTS.admin.orderStatus(orderNumber), { status });
}

// ---------------- دسته‌بندی‌ها ----------------
export async function getAdminCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>(ENDPOINTS.admin.categories);
  return data;
}

export async function saveCategory(
  id: number | null,
  input: { name: string; slug?: string; parentId?: number | null; isActive?: boolean }
): Promise<void> {
  const body = {
    name: input.name,
    slug: input.slug,
    parentId: input.parentId ?? null,
    isActive: input.isActive ?? true,
  };
  if (id) await apiClient.put(ENDPOINTS.admin.category(id), body);
  else await apiClient.post(ENDPOINTS.admin.categories, body);
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.admin.category(id));
}

// ---------------- محصولات ----------------
export type ProductStatus = "Draft" | "Published" | "Archived";

export type AdminProductListItem = {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  status: ProductStatus;
  categoryName: string;
  isFeatured: boolean;
  totalStock: number;
  primaryImageUrl?: string | null;
};

export async function getAdminProducts(
  params: { searchTerm?: string; pageNumber?: number; pageSize?: number } = {}
): Promise<ApiPagedResult<AdminProductListItem>> {
  const { data } = await apiClient.get<ApiPagedResult<AdminProductListItem>>(
    ENDPOINTS.admin.products,
    {
      params: {
        searchTerm: params.searchTerm || undefined,
        pageNumber: params.pageNumber ?? 1,
        pageSize: params.pageSize ?? 100,
      },
    }
  );
  return data;
}

export async function setProductStatus(id: string, status: ProductStatus): Promise<void> {
  await apiClient.put(ENDPOINTS.admin.productStatus(id), { status });
}

// محصول کامل برای فرم ویرایش (همه‌ی وضعیت‌ها؛ فقط ادمین)
export async function getAdminProduct(id: string): Promise<ApiProductDetail> {
  const { data } = await apiClient.get<ApiProductDetail>(ENDPOINTS.productById(id));
  return data;
}

export type SaveProductInput = {
  id?: string;
  categoryId: number;
  brandId?: number | null;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  isFeatured?: boolean;
  imageUrls: string[];
  variants: {
    sku: string;
    price: number;
    compareAtPrice?: number | null;
    stockQuantity: number;
    attributes: Record<string, string>;
  }[];
};

// ثبت (بدون id) یا ویرایش (با id)؛ شناسه‌ی محصول را برمی‌گرداند
export async function saveProduct(input: SaveProductInput): Promise<string> {
  const { data } = await apiClient.post<string>(ENDPOINTS.products, input);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.productById(id));
}

// ---------------- آپلود عکس ----------------
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<{ url: string }>(ENDPOINTS.admin.uploads, form);
  return data.url;
}
