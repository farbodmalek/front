"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, Users, TrendingUp, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { Dashboard, getDashboard } from "@/features/admin/api";
import { getShopErrorMessage } from "@/lib/api/errors";

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => setError(getShopErrorMessage(e)));
  }, []);

  const fa = (n: number) => n.toLocaleString("fa-IR");

  const stats = [
    { label: "کل محصولات", value: data ? fa(data.totalProducts) : "…", icon: Package },
    { label: "سفارش‌های امروز", value: data ? fa(data.todayOrders) : "…", icon: ShoppingBag },
    { label: "در انتظار پردازش", value: data ? fa(data.pendingOrders) : "…", icon: Clock },
    { label: "کاربران", value: data ? fa(data.usersCount) : "…", icon: Users },
    { label: "فروش این ماه", value: data ? formatPrice(data.monthSales) : "…", icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-h1 font-light text-ink mb-2">داشبورد</h1>
      <p className="text-body text-ink-muted mb-10">خلاصه وضعیت فروشگاه</p>

      {error && <p className="text-body text-rosewood-dark mb-6">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="border border-line bg-surface p-6 shadow-sm">
              <Icon size={20} strokeWidth={1.5} className="text-rosewood-dark mb-4" />
              <p className="text-h2 font-light text-ink">{stat.value}</p>
              <p className="text-small text-ink-muted mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
