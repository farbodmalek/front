"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./store";

// true وقتی که: صفحه در مرورگر لود شده و اطلاعات ذخیره‌شده (localStorage) خوانده شده.
// قبل از این لحظه نباید درباره «لاگین هست یا نه» تصمیم بگیریم (تا پرش و خطای hydration نداشته باشیم).
export function useAuthReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const persistApi = useAuthStore.persist;
    if (persistApi.hasHydrated()) {
      setReady(true);
    }
    const unsubscribe = persistApi.onFinishHydration(() => setReady(true));
    return unsubscribe;
  }, []);

  return ready;
}
