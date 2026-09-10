"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/format";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

const mockOrder = {
  customer: { name: "سارا احمدی", phone: "۰۹۱۲۳۴۵۶۷۸۹" },
  address: "تهران، ونک، خیابان ولیعصر، پلاک ۱۲، واحد ۳",
  shippingMethod: "پست پیشتاز",
  paymentMethod: "پرداخت آنلاین",
  items: [
    { title: "پیراهن مجلسی حریر", variant: "سایز ۳۸ / مشکی", quantity: 1, price: 1490000 },
    { title: "جوراب ساق‌بلند نخی", variant: "یک‌سایز", quantity: 2, price: 120000 },
  ],
  shippingCost: 45000,
};

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<OrderStatus>("processing");
  const [saved, setSaved] = useState(false);

  const subtotal = mockOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + mockOrder.shippingCost;

  function handleSaveStatus() {
    // TODO: اتصال به PATCH /api/orders/{id}/status
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-small text-ink-muted hover:text-ink mb-8 transition-colors"
      >
        <ChevronRight size={16} strokeWidth={1.5} />
        بازگشت به سفارش‌ها
      </Link>

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-h1 font-light text-ink">{params.id}</h1>
          <p className="text-small text-ink-muted mt-1">
            مشتری: {mockOrder.customer.name} · {mockOrder.customer.phone}
          </p>
        </div>
        <Badge variant={status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
        <div>
          <h2 className="text-body text-ink mb-4">اقلام سفارش</h2>
          <div className="flex flex-col gap-4 mb-10">
            {mockOrder.items.map((item, i) => (
              <div key={i} className="flex gap-4 border-b border-line pb-4">
                <div className="w-16 h-20 bg-line/40 flex items-center justify-center flex-shrink-0 text-small text-ink-muted">
                  تصویر
                </div>
                <div className="flex-1">
                  <p className="text-body text-ink">{item.title}</p>
                  <p className="text-small text-ink-muted mt-1">
                    {item.variant} × {item.quantity}
                  </p>
                </div>
                <span className="text-body text-ink">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <h2 className="text-body text-ink mb-4">اطلاعات ارسال</h2>
          <div className="flex flex-col gap-3 text-body">
            <div className="flex justify-between">
              <span className="text-ink-muted">آدرس تحویل</span>
              <span className="text-ink">{mockOrder.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">روش ارسال</span>
              <span className="text-ink">{mockOrder.shippingMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">روش پرداخت</span>
              <span className="text-ink">{mockOrder.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-line p-6">
            <h2 className="text-body text-ink mb-6">خلاصه پرداخت</h2>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between text-body">
                <span className="text-ink-muted">جمع کالاها</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-ink-muted">هزینه ارسال</span>
                <span className="text-ink">{formatPrice(mockOrder.shippingCost)}</span>
              </div>
            </div>
            <div className="flex justify-between text-body border-t border-line pt-4">
              <span className="text-ink">مجموع</span>
              <span className="text-ink">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="border border-line p-6">
            <h2 className="text-body text-ink mb-4">تغییر وضعیت سفارش</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full border border-line px-4 py-3 text-body bg-surface text-ink focus:outline-none focus:border-ink mb-4"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3">
              <Button size="md" onClick={handleSaveStatus} className="w-full">
                ذخیره وضعیت
              </Button>
            </div>
            {saved && <p className="text-small text-sage mt-3">وضعیت ذخیره شد</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
