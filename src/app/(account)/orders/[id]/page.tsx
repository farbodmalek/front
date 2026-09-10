"use client";

import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils/format";

const mockOrderDetail = {
  id: "AV-482913",
  date: "۱۴۰۴/۰۶/۱۰",
  status: "delivered" as const,
  address: "تهران، ونک، خیابان ولیعصر، پلاک ۱۲، واحد ۳",
  shippingMethod: "پست پیشتاز",
  paymentMethod: "پرداخت آنلاین",
  items: [
    { title: "پیراهن مجلسی حریر", variant: "سایز ۳۸ / مشکی", quantity: 1, price: 1490000 },
    { title: "جوراب ساق‌بلند نخی", variant: "یک‌سایز", quantity: 2, price: 120000 },
  ],
  shippingCost: 45000,
};

const trackingSteps = [
  { label: "ثبت سفارش", done: true },
  { label: "پردازش", done: true },
  { label: "ارسال", done: true },
  { label: "تحویل", done: true },
];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = { ...mockOrderDetail, id: params.id };
  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + order.shippingCost;

  return (
    <div>
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-small text-ink-muted hover:text-ink mb-8 transition-colors"
      >
        <ChevronRight size={16} strokeWidth={1.5} />
        بازگشت به سفارش‌ها
      </Link>

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-h1 font-light text-ink">{order.id}</h1>
          <p className="text-small text-ink-muted mt-1">تاریخ ثبت: {order.date}</p>
        </div>
        <Badge variant={order.status} />
      </div>

      {/* مسیر پیگیری */}
      <div className="relative mb-14">
        <div className="absolute top-4 right-0 left-0 h-px bg-line" />
        <div className="absolute top-4 right-0 h-px bg-sage w-full" />
        <div className="relative flex justify-between">
          {trackingSteps.map((step) => (
            <div key={step.label} className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center z-10">
                <Check size={14} strokeWidth={2} className="text-cream" />
              </div>
              <span className="text-small text-ink">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12">
        <div>
          <h2 className="text-body text-ink mb-4">اقلام سفارش</h2>
          <div className="flex flex-col gap-4 mb-10">
            {order.items.map((item, i) => (
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
                <span className="text-body text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <h2 className="text-body text-ink mb-4">اطلاعات ارسال</h2>
          <div className="flex flex-col gap-3 text-body">
            <div className="flex justify-between">
              <span className="text-ink-muted">آدرس تحویل</span>
              <span className="text-ink">{order.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">روش ارسال</span>
              <span className="text-ink">{order.shippingMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">روش پرداخت</span>
              <span className="text-ink">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="border border-line p-6 h-fit">
          <h2 className="text-body text-ink mb-6">خلاصه پرداخت</h2>
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex justify-between text-body">
              <span className="text-ink-muted">جمع کالاها</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-body">
              <span className="text-ink-muted">هزینه ارسال</span>
              <span className="text-ink">{formatPrice(order.shippingCost)}</span>
            </div>
          </div>
          <div className="flex justify-between text-body border-t border-line pt-4">
            <span className="text-ink">مجموع</span>
            <span className="text-ink">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
