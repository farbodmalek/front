import { authClient } from "@/lib/api/authClient";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { AuthResponse } from "../types";

export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  const { data } = await authClient.post<AuthResponse>(ENDPOINTS.auth.refresh, {
    refreshToken,
  });
  return data;
}
