export const ENDPOINTS = {
  // ---- سرویس اصلی فروشگاه (SarafBackend، پورت 5107) ----
  products: "/api/product",
  productBySlug: (slug: string) => `/api/product/slug/${slug}`,
  productById: (id: string) => `/api/product/${id}`,
  featuredProducts: "/api/product/featured",
  productsByCategory: (categoryId: number) => `/api/product/category/${categoryId}`,

  categories: "/api/categories",

  cart: "/api/cart",
  cartItems: "/api/cart/items",
  cartItem: (variantId: string) => `/api/cart/items/${variantId}`,
  cartMerge: "/api/cart/merge",

  addresses: "/api/addresses",
  address: (id: number) => `/api/addresses/${id}`,

  wishlist: "/api/wishlist",
  wishlistIds: "/api/wishlist/ids",
  wishlistItem: (productId: string) => `/api/wishlist/${productId}`,

  orders: "/api/orders",
  order: (orderNumber: string) => `/api/orders/${orderNumber}`,
  orderCancel: (orderNumber: string) => `/api/orders/${orderNumber}/cancel`,

  // ---- پنل ادمین ----
  admin: {
    dashboard: "/api/admin/dashboard",
    orders: "/api/admin/orders",
    order: (orderNumber: string) => `/api/admin/orders/${orderNumber}`,
    orderStatus: (orderNumber: string) => `/api/admin/orders/${orderNumber}/status`,
    categories: "/api/admin/categories",
    category: (id: number) => `/api/admin/categories/${id}`,
    products: "/api/admin/products",
    productStatus: (id: string) => `/api/admin/products/${id}/status`,
    uploads: "/api/admin/uploads",
  },

  // ---- سرویس Auth (پروژه‌ی جدا) ----
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
};
