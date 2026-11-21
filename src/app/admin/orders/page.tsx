"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { OrderListItem, OrderStatus } from "@/features/order/api";
import { getAdminOrders, updateOrderStatus } from "@/features/admin/api";
import { getShopErrorMessage } from "@/lib/api/errors";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

const filterTabs: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "همه" },
  ...statusOptions.map((s) => ({ id: s.value, label: s.label })),
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async (status: OrderStatus | "all", term: string) => {
    try {
      const result = await getAdminOrders({ status, searchTerm: term });
      setOrders(result.items);
      setError(null);
    } catch (e) {
      setError(getShopErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void load(activeFilter, search), 250);
    return () => clearTimeout(timer);
  }, [activeFilter, search, load]);

  async function handleStatusChange(order: OrderListItem, status: OrderStatus) {
    try {
      await updateOrderStatus(order.orderNumber, status);
      await load(activeFilter, search);
    } catch (e) {
      // مثلاً: سفارش تحویل‌شده/لغوشده دیگر تغییر نمی‌کند
      setError(getShopErrorMessage(e));
      await load(activeFilter, search);
    }
  }

  return (
    <div>
      <h1 className="text-h1 font-light text-ink mb-2">سفارش‌ها</h1>
      <p className="text-body text-ink-muted mb-8">مدیریت و پیگیری سفارش‌های مشتریان</p>

      <div className="flex flex-wrap gap-2 mb-6">
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

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جست‌وجوی شماره سفارش، نام یا موبایل مشتری..."
        className="w-full max-w-sm mb-6 bg-surface border border-line px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors"
      />

      {error && <p className="text-body text-rosewood-dark mb-6">{error}</p>}

      <div className="border border-line bg-surface">
        <table className="w-full text-body">
          <thead>
            <tr className="border-b border-line text-small text-ink-muted">
              <th className="text-right py-4 px-6 font-normal">شماره سفارش</th>
              <th className="text-right py-4 px-6 font-normal">مشتری</th>
              <th className="text-right py-4 px-6 font-normal">تاریخ</th>
              <th className="text-right py-4 px-6 font-normal">مبلغ</th>
              <th className="text-right py-4 px-6 font-normal">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNumber} className="border-b border-line last:border-b-0 hover:bg-cream/50 transition-colors">
                <td className="py-4 px-6">
                  <Link
                    href={`/admin/orders/${order.orderNumber}`}
                    className="text-ink hover:text-rosewood-dark transition-colors"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="py-4 px-6 text-ink-muted">{order.customerName ?? "-"}</td>
                <td className="py-4 px-6 text-ink-muted">{formatDate(order.createdAt)}</td>
                <td className="py-4 px-6 text-ink">{formatPrice(order.total)}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Badge variant={order.status} />
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                      className="text-small border border-line px-2 py-1 bg-surface text-ink-muted focus:outline-none focus:border-ink"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <p className="text-body text-ink-muted text-center py-12">در حال بارگذاری...</p>}
        {!loading && orders.length === 0 && (
          <p className="text-body text-ink-muted text-center py-12">سفارشی پیدا نشد.</p>
        )}
      </div>
    </div>
  );
}
