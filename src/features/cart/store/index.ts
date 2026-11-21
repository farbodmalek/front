import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/features/auth/store";
import { getShopErrorMessage } from "@/lib/api/errors";
import * as cartApi from "../api";
import { CartItem } from "../types";

type CartStore = {
  items: CartItem[];
  // پیام خطا (مثلاً «موجودی کافی نیست») یا null اگر همه‌چیز درست بود
  addItem: (item: CartItem) => Promise<string | null>;
  removeItem: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<string | null>;
  clear: () => Promise<void>;
  // فقط سبد داخل مرورگر را خالی می‌کند (مثلاً بعد از خروج یا ثبت سفارش)
  clearLocal: () => void;
  // سبد سرور را می‌خواند و جای سبد محلی می‌گذارد
  refresh: () => Promise<void>;
  // بعد از ورود: سبد مهمان را به سبد سرور اضافه می‌کند
  mergeGuestCart: () => Promise<void>;
};

const isLoggedIn = () => useAuthStore.getState().isAuthenticated;

// قانون: وقتی کاربر وارد شده، «سرور» مرجع سبد است. وقتی مهمان است، سبد فقط در مرورگر می‌ماند.
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (item) => {
        // ۱) فوراً در صفحه نشان بده (تعداد، اگر از قبل بود جمع می‌شود)
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          return {
            items: existing
              ? state.items.map((i) =>
                  i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i
                )
              : [...state.items, item],
          };
        });
        if (!isLoggedIn()) return null;

        // ۲) سرور را هم به‌روز کن و جوابِ سرور (قیمت و موجودی واقعی) را بگذار
        try {
          set({ items: await cartApi.addCartItem(item.variantId, item.quantity) });
          return null;
        } catch (error) {
          await get().refresh();
          return getShopErrorMessage(error);
        }
      },

      removeItem: async (variantId) => {
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) }));
        if (!isLoggedIn()) return;
        try {
          set({ items: await cartApi.removeCartItem(variantId) });
        } catch {
          await get().refresh();
        }
      },

      updateQuantity: async (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        }));
        if (!isLoggedIn()) return null;
        try {
          set({ items: await cartApi.setCartItemQuantity(variantId, quantity) });
          return null;
        } catch (error) {
          await get().refresh();
          return getShopErrorMessage(error);
        }
      },

      clear: async () => {
        set({ items: [] });
        if (!isLoggedIn()) return;
        try {
          await cartApi.clearServerCart();
        } catch {
          /* سبد محلی خالی شده؛ خطای شبکه مهم نیست */
        }
      },

      clearLocal: () => set({ items: [] }),

      refresh: async () => {
        if (!isLoggedIn()) return;
        try {
          set({ items: await cartApi.fetchCart() });
        } catch {
          /* اگر سرور خاموش بود، سبد فعلی می‌ماند */
        }
      },

      mergeGuestCart: async () => {
        if (!isLoggedIn()) return;
        const guestLines = get().items.map((i) => ({ variantId: i.variantId, quantity: i.quantity }));
        try {
          set({
            items:
              guestLines.length > 0 ? await cartApi.mergeCart(guestLines) : await cartApi.fetchCart(),
          });
        } catch {
          /* نشد؛ سبد محلی می‌ماند */
        }
      },
    }),
    { name: "cart-storage" }
  )
);
