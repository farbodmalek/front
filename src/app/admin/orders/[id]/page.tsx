"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { OrderDetail, OrderStatus } from "@/features/order/api";
import { getAdminOrder, updateOrderStatus } from "@/features/admin/api";
import { getShopErrorMessage } from "@/lib/api/errors";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const orderNumber = decodeURIComponent(params.id);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState<OrderStatus>("processing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    try {
      const result = await getAdminOrder(orderNumber);
      setOrder(result);
      setStatus(result.status);
    } catch (e) {
      setError(getShopErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  async function handleSaveStatus() {
    setSaving(true);
    setError(null);
    try {
      await updateOrderStatus(orderNumber, status);
      await load();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(getShopErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  const back = (
    <Link
      href="/admin/orders"
      className="inline-flex items-center gap-1 text-small text-ink-muted hover:text-ink mb-8 transition-colors"
    >
      <ChevronRight size={16} strokeWidth={1.5} />
      بازگشت به سفارش‌ها
    </Link>
  );

  if (loading || !order) {
    return (
      <div>
        {back}
        <p className={error ? "text-body text-rosewood-dark" : "text-body text-ink-muted"}>
          {loading ? "در حال بارگذاری..." : error ?? "سفارش پیدا نشد."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {back}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-h1 font-light text-ink">{order.orderNumber}</h1>
          <p className="text-small text-ink-muted mt-1">
            مشتری: {order.customerName ?? "-"} · {order.customerPhone ?? "-"} · {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
        <div>
          <h2 className="text-body text-ink mb-4">اقلام سفارش</h2>
          <div className="flex flex-col gap-4 mb-10">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 border-b border-line pb-4">
                <div className="w-16 h-20 bg-line/40 flex items-center justify-center flex-shrink-0 text-small text-ink-muted overflow-hidden">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    "تصویر"
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-body text-ink">{item.productName}</p>
                  <p className="text-small text-ink-muted mt-1">
                    {item.variantDescription ? `${item.variantDescription} × ` : "× "}
                    {item.quantity.toLocaleString("fa-IR")}
                    {item.sku ? ` · ${item.sku}` : ""}
                  </p>
                </div>
                <span className="text-body text-ink">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          <h2 className="text-body text-ink mb-4">اطلاعات ارسال</h2>
          <div className="flex flex-col gap-3 text-body">
            <div className="flex justify-between gap-6">
              <span className="text-ink-muted">گیرنده</span>
              <span className="text-ink">{order.recipientName} · {order.recipientPhone}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-ink-muted">آدرس تحویل</span>
              <span className="text-ink text-left">{order.shippingAddress}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-ink-muted">روش ارسال</span>
              <span className="text-ink">{order.shippingMethodTitle}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-ink-muted">روش پرداخت</span>
              <span className="text-ink">{order.paymentMethodTitle}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-line p-6">
            <h2 className="text-body text-ink mb-6">خلاصه پرداخت</h2>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between text-body">
                <span className="text-ink-muted">جمع کالاها</span>
                <span className="text-ink">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-ink-muted">هزینه ارسال</span>
                <span className="text-ink">{formatPrice(order.shippingCost)}</span>
              </div>
            </div>
            <div className="flex justify-between text-body border-t border-line pt-4">
              <span className="text-ink">مجموع</span>
              <span className="text-ink">{formatPrice(order.total)}</span>
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
            <Button size="md" onClick={handleSaveStatus} disabled={saving || status === order.status} className="w-full">
              {saving ? "در حال ذخیره..." : "ذخیره وضعیت"}
            </Button>
            {saved && <p className="text-small text-sage mt-3">وضعیت ذخیره شد</p>}
            {error && <p className="text-small text-rosewood-dark mt-3">{error}</p>}
            {(order.status === "delivered" || order.status === "cancelled") && (
              <p className="text-small text-ink-muted mt-3">این سفارش به پایان رسیده و دیگر تغییر نمی‌کند.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
