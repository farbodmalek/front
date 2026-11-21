"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../store";
import { useAuthReady } from "../hooks";

interface AuthGuardProps {
  children: ReactNode;
  // اگر true باشد، فقط ادمین‌ها وارد می‌شوند
  requireAdmin?: boolean;
}

// ⚠️ این محافظ فقط برای «تجربه کاربری» است (کاربر را به صفحه ورود می‌برد).
// امنیت واقعی همیشه سمت سرور است: [Authorize] / [Authorize(Roles = "Admin")].
export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const ready = useAuthReady();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.user?.isAdmin ?? false);

  const allowed = isAuthenticated && (!requireAdmin || isAdmin);

  useEffect(() => {
    if (!ready) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (requireAdmin && !isAdmin) {
      router.replace("/");
    }
  }, [ready, isAuthenticated, isAdmin, requireAdmin, pathname, router]);

  if (!ready || !allowed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="text-body text-ink-muted animate-pulse">در حال بررسی...</span>
      </div>
    );
  }

  return <>{children}</>;
}
