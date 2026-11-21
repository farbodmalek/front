import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/store";
import { refreshAccessToken } from "@/features/auth/session";

// کلاینت سرویس اصلی فروشگاه (محصولات، سفارش‌ها، ...)
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ۱) به هر درخواست «کارت ورود» (Access Token) را می‌چسباند
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().tokens?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// ۲) اگر کارت ورود تمام شده بود (401)، با «کلید رزرو» یکی تازه می‌گیرد و همان درخواست را تکرار می‌کند
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetriableConfig | undefined;

    if (axios.isAxiosError(error) && error.response?.status === 401 && original && !original._retried) {
      original._retried = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(original);
      }
      // رفرش شکست خورد → logout انجام شده و محافظ‌های صفحه (AuthGuard) کاربر را به /login می‌برند
    }

    return Promise.reject(error);
  }
);
