export type User = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
