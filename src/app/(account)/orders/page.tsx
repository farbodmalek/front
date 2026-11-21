"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Package } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { getMyOrders, OrderListItem, OrderStatus } from "@/features/order/api";
import { getShopErrorMessage } from "@/lib/api/errors";

const filterTabs: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "processing", label: "در حال پردازش" },
  { id: "shipped", label: "ارسال شده" },
  { id: "delivered", label: "تحویل شده" },
  { id: "cancelled", label: "لغو شده" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((e) => setError(getShopErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(
    () => (activeFilter === "all" ? orders : orders.filter((o) => o.status === activeFilter)),
    [orders, activeFilter]
  );

  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1 className="text-h1 font-light text-ink mb-8">سفارش‌های من</h1>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border border-line px-6 py-5">
          <p className="text-small text-ink-muted mb-2">تعداد سفارش‌ها</p>
          <p className="text-h1 font-light text-ink">{orders.length.toLocaleString("fa-IR")}</p>
        </div>
        <div className="border border-line px-6 py-5">
          <p className="text-small text-ink-muted mb-2">مجموع خرید</p>
          <p className="text-h1 font-light text-ink">{formatPrice(totalSpent)}</p>
        </div>
      </div>

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

      {loading ? (
        <p className="text-body text-ink-muted">در حال بارگذاری سفارش‌ها...</p>
      ) : error ? (
        <p className="text-body text-rosewood-dark">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-line">
          <Package size={32} strokeWidth={1.2} className="text-ink-muted mb-4" />
          <p className="text-body text-ink-muted">سفارشی با این وضعیت پیدا نشد.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.orderNumber}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileHover={{ y: -3 }}
              >
                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="flex items-center justify-between gap-4 border border-line px-6 py-5 bg-surface shadow-sm hover:shadow-lg hover:border-ink/70 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="hidden sm:flex w-12 h-12 bg-line/50 items-center justify-center flex-shrink-0">
                      <Package size={20} strokeWidth={1.3} className="text-ink-muted" />
                    </div>
                    <div>
                      <p className="text-body text-ink">{order.orderNumber}</p>
                      <p className="text-small text-ink-muted mt-1">
                        {formatDate(order.createdAt)} · {order.itemsCount.toLocaleString("fa-IR")} کالا
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
