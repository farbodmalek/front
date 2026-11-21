import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export type OrderListItem = {
  orderNumber: string;
  createdAt: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
  customerName?: string | null;
  customerPhone?: string | null;
};

export type OrderItem = {
  productId?: string | null;
  productName: string;
  variantDescription?: string | null;
  sku?: string | null;
  unitPrice: number;
  quantity: number;
  imageUrl?: string | null;
};

export type OrderDetail = {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingMethod: string;
  shippingMethodTitle: string;
  paymentMethod: string;
  paymentMethodTitle: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  customerName?: string | null;
  customerPhone?: string | null;
  items: OrderItem[];
};

export type PlaceOrderInput = {
  addressId: number;
  shippingMethod: string;
  paymentMethod: string;
};

// ثبت سفارش از روی سبد خرید سرور؛ شماره‌ی سفارش (AV-100001) را برمی‌گرداند
export async function placeOrder(input: PlaceOrderInput): Promise<string> {
  const { data } = await apiClient.post<{ orderNumber: string }>(ENDPOINTS.orders, input);
  return data.orderNumber;
}

export async function getMyOrders(): Promise<OrderListItem[]> {
  const { data } = await apiClient.get<OrderListItem[]>(ENDPOINTS.orders);
  return data;
}

export async function getMyOrder(orderNumber: string): Promise<OrderDetail> {
  const { data } = await apiClient.get<OrderDetail>(ENDPOINTS.order(orderNumber));
  return data;
}

export async function cancelMyOrder(orderNumber: string): Promise<void> {
  await apiClient.post(ENDPOINTS.orderCancel(orderNumber));
}
