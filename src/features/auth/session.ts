import { refreshSession } from "./api/refresh";
import { useAuthStore } from "./store";

let refreshPromise: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const { tokens, setSession, logout } = useAuthStore.getState();
  if (!tokens?.refreshToken) {
    logout();
    return null;
  }

  try {
    const session = await refreshSession(tokens.refreshToken);
    setSession(session);
    return session.tokens.accessToken;
  } catch {
    // کلید رزرو منقضی یا باطل شده → کاربر باید دوباره وارد شود
    logout();
    return null;
  }
}

// اگر چند درخواست هم‌زمان 401 گرفتند، فقط «یک» رفرش انجام می‌شود
// (چون کلید رزرو یک‌بار مصرف است؛ دو رفرش هم‌زمان یکی‌شان را خراب می‌کرد).
export function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}
