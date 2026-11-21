export const ENDPOINTS = {
  // ---- سرویس اصلی فروشگاه (SarafBackend/ProductController، پورت 5107) ----
  products: "/api/product",
  productBySlug: (slug: string) => `/api/product/slug/${slug}`,
  productById: (id: string) => `/api/product/${id}`,
  featuredProducts: "/api/product/featured",
  productsByCategory: (categoryId: number) => `/api/product/category/${categoryId}`,
  // هنوز در بک‌اند ساخته نشده‌اند:
  categories: "/api/categories",
  cart: "/api/cart",
  orders: "/api/orders",

  // ---- سرویس Auth (پروژه‌ی جدا) ----
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
};
