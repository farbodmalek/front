// شکل داده‌ها دقیقاً مطابق خروجی سرویس Auth (GirlyShop.AuthService)

export type User = {
  id: number;
  fullName: string;
  phone: string;
  email?: string | null;
  isAdmin: boolean;
};

export type AuthTokens = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

export type AuthResponse = {
  user: User;
  tokens: AuthTokens;
};
