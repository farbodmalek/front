"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useWishlistStore } from "@/features/wishlist/store";
import { useCartStore } from "../store";

// نامرئی است. فقط سبد مرورگر را با سبد سرور هماهنگ نگه می‌دارد:
//  - صفحه‌ای که با کاربر واردشده باز می‌شود → سبد سرور خوانده می‌شود
//  - مهمان وارد می‌شود → سبد مهمان با سبد سرور ادغام می‌شود
//  - کاربر خارج می‌شود → سبد مرورگر خالی می‌شود (سبد سرور سر جایش می‌ماند)
export function CartSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const previous = useRef<boolean | null>(null);

  useEffect(() => {
    const { refresh, mergeGuestCart, clearLocal } = useCartStore.getState();

    if (previous.current === null) {
      if (isAuthenticated) void refresh();
    } else if (!previous.current && isAuthenticated) {
      void mergeGuestCart();
    } else if (previous.current && !isAuthenticated) {
      clearLocal();
    }

    // علاقه‌مندی‌ها: برای پر شدن قلب‌ها
    if (isAuthenticated) void useWishlistStore.getState().load();
    else useWishlistStore.getState().reset();

    previous.current = isAuthenticated;
  }, [isAuthenticated]);

  return null;
}
