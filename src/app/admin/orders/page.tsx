"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

interface AdminOrder {
  id: string;
  customer: string;
  date: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
}

const initialOrders: AdminOrder[] = [
  { id: "AV-482913", customer: "سارا احمدی", date: "۱۴۰۴/۰۶/۱۰", itemsCount: 3, total: 2450000, status: "delivered" },
  { id: "AV-482744", customer: "نگار محمدی", date: "۱۴۰۴/۰۶/۰۲", itemsCount: 1, total: 640000, status: "shipped" },
  { id: "AV-481920", customer: "مریم رضایی", date: "۱۴۰۴/۰۵/۲۲", itemsCount: 2, total: 1120000, status: "processing" },
  { id: "AV-479311", customer: "الهام کریمی", date: "۱۴۰۴/۰۴/۳۰", itemsCount: 1, total: 150000, status: "cancelled" },
];

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
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");

  function handleStatusChange(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  const filteredOrders =
    activeFilter === "all" ? orders : orders.filter((o) => o.status === activeFilter);

  return (
    <div>
      <h1 className="text-h1 font-light text-ink mb-2">سفارش‌ها</h1>
      <p className="text-body text-ink-muted mb-8">مدیریت و پیگیری سفارش‌های مشتریان</p>

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
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-line last:border-b-0 hover:bg-cream/50 transition-colors">
                <td className="py-4 px-6">
                  <Link href={`/admin/orders/${order.id}`} className="text-ink hover:text-rosewood-dark transition-colors">
                    {order.id}
                  </Link>
                </td>
                <td className="py-4 px-6 text-ink-muted">{order.customer}</td>
                <td className="py-4 px-6 text-ink-muted">{order.date}</td>
                <td className="py-4 px-6 text-ink">{formatPrice(order.total)}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Badge variant={order.status} />
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
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

        {filteredOrders.length === 0 && (
          <p className="text-body text-ink-muted text-center py-12">سفارشی با این وضعیت پیدا نشد.</p>
        )}
      </div>
    </div>
  );
}
