import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { User, AuthTokens } from "../types";

export interface RegisterPayload {
  fullName: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    ENDPOINTS.auth.register,
    payload
  );
  return data;
}
