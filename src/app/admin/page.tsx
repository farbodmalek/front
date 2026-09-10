import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";

const stats = [
  { label: "کل محصولات", value: "۸۲", icon: Package },
  { label: "سفارش‌های امروز", value: "۱۲", icon: ShoppingBag },
  { label: "کاربران", value: "۱٬۲۴۰", icon: Users },
  { label: "فروش این ماه", value: "۴۵٫۲ میلیون", icon: TrendingUp },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-h1 font-light text-ink mb-2">داشبورد</h1>
      <p className="text-body text-ink-muted mb-10">خلاصه وضعیت فروشگاه</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="mt-10 border border-dashed border-line p-8 text-center">
        <p className="text-body text-ink-muted">
          این آمار فعلاً نمایشیه. بعد از اتصال به بک‌اند، اعداد واقعی جایگزین می‌شن.
        </p>
      </div>
    </div>
  );
}
