import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export type Address = {
  id: number;
  title: string;
  recipientName?: string | null;
  phoneNumber?: string | null;
  city?: string | null;
  postalCode?: string | null;
  detail: string;
  isDefault: boolean;
};

export type AddressInput = {
  title: string;
  recipientName?: string;
  phoneNumber?: string;
  city?: string;
  postalCode?: string;
  detail: string;
  isDefault?: boolean;
};

// هر درخواست، «لیست به‌روز آدرس‌ها» را برمی‌گرداند
export async function getAddresses(): Promise<Address[]> {
  const { data } = await apiClient.get<Address[]>(ENDPOINTS.addresses);
  return data;
}

export async function createAddress(input: AddressInput): Promise<Address[]> {
  const { data } = await apiClient.post<Address[]>(ENDPOINTS.addresses, input);
  return data;
}

export async function updateAddress(id: number, input: AddressInput): Promise<Address[]> {
  const { data } = await apiClient.put<Address[]>(ENDPOINTS.address(id), input);
  return data;
}

export async function deleteAddress(id: number): Promise<Address[]> {
  const { data } = await apiClient.delete<Address[]>(ENDPOINTS.address(id));
  return data;
}

// برای نمایش در کارت/ریویو: «شهر، آدرس کامل»
export function addressSummary(a: Address): string {
  return [a.city, a.detail].filter(Boolean).join("، ");
}
