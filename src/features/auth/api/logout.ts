import { authClient } from "@/lib/api/authClient";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "../store";

// خروج: اول فوراً از مرورگر پاک می‌شود (کاربر معطل نمی‌ماند)،
// بعد به سرور هم خبر می‌دهیم تا «کلید رزرو» باطل شود.
export async function logoutUser(): Promise<void> {
  const { tokens, logout } = useAuthStore.getState();
  logout();

  if (!tokens?.refreshToken) return;

  try {
    await authClient.post(ENDPOINTS.auth.logout, {
      refreshToken: tokens.refreshToken,
    });
  } catch {
    // اگر سرور در دسترس نبود مهم نیست؛ کاربر از مرورگر خارج شده است
  }
}
