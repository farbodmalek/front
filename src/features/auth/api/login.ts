import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { User, AuthTokens } from "../types";

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    ENDPOINTS.auth.login,
    payload
  );
  return data;
}
