"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Package } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
  thumbnails: number;
}

const mockOrders: Order[] = [
  { id: "AV-482913", date: "۱۴۰۴/۰۶/۱۰", itemsCount: 3, total: 2450000, status: "delivered", thumbnails: 3 },
  { id: "AV-482744", date: "۱۴۰۴/۰۶/۰۲", itemsCount: 1, total: 640000, status: "shipped", thumbnails: 1 },
  { id: "AV-481920", date: "۱۴۰۴/۰۵/۲۲", itemsCount: 2, total: 1120000, status: "processing", thumbnails: 2 },
  { id: "AV-479311", date: "۱۴۰۴/۰۴/۳۰", itemsCount: 1, total: 150000, status: "cancelled", thumbnails: 1 },
];

const filterTabs: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "processing", label: "در حال پردازش" },
  { id: "shipped", label: "ارسال شده" },
  { id: "delivered", label: "تحویل شده" },
  { id: "cancelled", label: "لغو شده" },
];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");

  const filteredOrders = useMemo(
    () =>
      activeFilter === "all"
        ? mockOrders
        : mockOrders.filter((o) => o.status === activeFilter),
    [activeFilter]
  );

  const totalSpent = mockOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1 className="text-h1 font-light text-ink mb-8">سفارش‌های من</h1>

      {/* آمار سریع */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border border-line px-6 py-5">
          <p className="text-small text-ink-muted mb-2">تعداد سفارش‌ها</p>
          <p className="text-h1 font-light text-ink">{mockOrders.length}</p>
        </div>
        <div className="border border-line px-6 py-5">
          <p className="text-small text-ink-muted mb-2">مجموع خرید</p>
          <p className="text-h1 font-light text-ink">{formatPrice(totalSpent)}</p>
        </div>
      </div>

      {/* فیلتر وضعیت */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              "px-4 py-2 text-small border transition-colors",
              activeFilter === tab.id
                ? "bg-ink text-cream border-ink"
                : "border-line text-ink-muted hover:border-ink hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-line">
          <Package size={32} strokeWidth={1.2} className="text-ink-muted mb-4" />
          <p className="text-body text-ink-muted">سفارشی با این وضعیت پیدا نشد.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileHover={{ y: -3 }}
              >
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 border border-line px-6 py-5 bg-surface shadow-sm hover:shadow-lg hover:border-ink/70 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    {/* پشته تصاویر مینیاتوری */}
                    <div className="hidden sm:flex -space-x-3 space-x-reverse flex-shrink-0">
                      {Array.from({ length: order.thumbnails }).map((_, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 bg-line/50 border-2 border-surface flex items-center justify-center"
                          style={{ zIndex: order.thumbnails - i }}
                        >
                          <span className="text-[10px] text-ink-muted">تصویر</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-body text-ink">{order.id}</p>
                      <p className="text-small text-ink-muted mt-1">
                        {order.date} · {order.itemsCount} کالا
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <Badge variant={order.status} />
                    <span className="text-body text-ink hidden sm:block whitespace-nowrap">
                      {formatPrice(order.total)}
                    </span>
                    <ChevronLeft
                      size={18}
                      strokeWidth={1.5}
                      className="text-ink-muted group-hover:text-ink group-hover:-translate-x-1 transition-all flex-shrink-0"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
