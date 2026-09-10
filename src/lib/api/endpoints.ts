export const ENDPOINTS = {
  products: "/api/products",
  productBySlug: (slug: string) => `/api/products/${slug}`,
  categories: "/api/categories",
  cart: "/api/cart",
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",
  },
  orders: "/api/orders",
};
