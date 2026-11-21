import { authClient } from "@/lib/api/authClient";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { AuthResponse } from "../types";

export interface LoginPayload {
  phone: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  // سرویس Auth اسم فیلد را phoneNumber می‌خواهد
  const { data } = await authClient.post<AuthResponse>(ENDPOINTS.auth.login, {
    phoneNumber: payload.phone,
    password: payload.password,
  });
  return data;
}
