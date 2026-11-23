"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";
import { useAuthReady } from "@/features/auth/hooks";

const navLinks = [
  { label: "جدیدترین‌ها", href: "/products?sort=newest" },
  { label: "لباس مجلسی", href: "/category/lebas-majlesi" },
  { label: "لباس زیر", href: "/category/lebas-zir" },
  { label: "جوراب", href: "/category/jorab" },
];

export function Header() {
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  // تا قبل از خوانده شدن localStorage فرض می‌کنیم کاربر لاگین نیست (جلوی خطای hydration)
  const authReady = useAuthReady();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accountHref = authReady && isAuthenticated ? "/profile" : "/login";

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-light tracking-tightish text-ink">
            sarel
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-body text-ink-muted hover:text-ink transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 right-0 w-full h-px bg-ink scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300 ease-out" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button aria-label="جستجو" className="text-ink hover:text-rosewood-dark transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href={accountHref} aria-label="حساب کاربری" className="text-ink hover:text-rosewood-dark transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link href="/cart" aria-label="سبد خرید" className="relative text-ink hover:text-rosewood-dark transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute -top-2 -left-2 w-4 h-4 bg-rosewood-dark text-cream text-[10px] flex items-center justify-center rounded-full"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
