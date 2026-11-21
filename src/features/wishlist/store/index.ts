import { create } from "zustand";
import { useAuthStore } from "@/features/auth/store";
import * as wishlistApi from "../api";

type WishlistStore = {
  ids: string[];
  loaded: boolean;
  load: () => Promise<void>;
  reset: () => void;
  // true یعنی «الان در علاقه‌مندی‌هاست». اگر کاربر وارد نشده باشد null برمی‌گرداند.
  toggle: (productId: string) => Promise<boolean | null>;
};

// فقط شناسه‌ها را نگه می‌دارد تا قلب‌های لیست محصولات پر شوند.
export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  ids: [],
  loaded: false,

  load: async () => {
    if (!useAuthStore.getState().isAuthenticated) return;
    try {
      set({ ids: await wishlistApi.getWishlistIds(), loaded: true });
    } catch {
      /* ساکت: فقط قلب‌ها خالی می‌مانند */
    }
  },

  reset: () => set({ ids: [], loaded: false }),

  toggle: async (productId) => {
    if (!useAuthStore.getState().isAuthenticated) return null;

    const isIn = get().ids.includes(productId);
    set((s) => ({ ids: isIn ? s.ids.filter((id) => id !== productId) : [...s.ids, productId] }));

    try {
      if (isIn) await wishlistApi.removeFromWishlist(productId);
      else await wishlistApi.addToWishlist(productId);
      return !isIn;
    } catch {
      // برگردان به حالت قبل
      set((s) => ({ ids: isIn ? [...s.ids, productId] : s.ids.filter((id) => id !== productId) }));
      return isIn;
    }
  },
}));
