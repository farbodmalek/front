"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, MapPin, Heart, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/features/auth/store";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "سفارش‌های من", href: "/orders", icon: Package },
  { label: "آدرس‌های من", href: "/addresses", icon: MapPin },
  { label: "علاقه‌مندی‌ها", href: "/wishlist", icon: Heart },
  { label: "پروفایل", href: "/profile", icon: User },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="flex flex-col gap-8">
      <div>
        <p className="text-small text-ink-muted mb-1">خوش آمدید</p>
        <p className="text-body text-ink">{user?.fullName ?? "کاربر مهمان"}</p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-body transition-colors border-r-2",
                isActive
                  ? "border-ink text-ink bg-line/20"
                  : "border-transparent text-ink-muted hover:text-ink hover:bg-line/10"
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-body text-ink-muted hover:text-rosewood-dark transition-colors mt-4 border-r-2 border-transparent"
        >
          <LogOut size={18} strokeWidth={1.5} />
          خروج از حساب
        </button>
      </nav>
    </aside>
  );
}
