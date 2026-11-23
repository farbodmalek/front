"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, ShoppingBag, Tags, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "داشبورد", href: "/admin", icon: LayoutGrid },
  { label: "محصولات", href: "/admin/products", icon: Package },
  { label: "سفارش‌ها", href: "/admin/orders", icon: ShoppingBag },
  { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: Tags },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-l border-line min-h-screen bg-surface flex flex-col">
      <div className="px-6 py-8 border-b border-line">
        <Link href="/admin" className="text-xl font-light tracking-tightish text-ink">
          پنل مدیریت
        </Link>
        <p className="text-small text-ink-muted mt-1">sarel</p>
      </div>

      <nav className="flex flex-col gap-1 p-4 flex-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-body transition-colors",
                isActive
                  ? "bg-ink text-cream"
                  : "text-ink-muted hover:bg-line/20 hover:text-ink"
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-line">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-3 text-small text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowRight size={16} strokeWidth={1.5} />
          بازگشت به فروشگاه
        </Link>
      </div>
    </aside>
  );
}
