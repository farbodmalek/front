import { authClient } from "@/lib/api/authClient";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { AuthResponse } from "../types";

export interface RegisterPayload {
  fullName: string;
  phone: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await authClient.post<AuthResponse>(ENDPOINTS.auth.register, {
    fullName: payload.fullName,
    phoneNumber: payload.phone,
    password: payload.password,
  });
  return data;
}
