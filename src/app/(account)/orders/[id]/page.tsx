"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { cancelMyOrder, getMyOrder, OrderDetail } from "@/features/order/api";
import { getShopErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils/cn";

const trackingLabels = ["ثبت سفارش", "پردازش", "ارسال", "تحویل"];

// چند مرحله از مسیر پیگیری انجام شده است
function doneSteps(status: OrderDetail["status"]): number {
  switch (status) {
    case "processing":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    default:
      return 1; // لغو شده: فقط «ثبت سفارش»
  }
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function load() {
    try {
      setOrder(await getMyOrder(decodeURIComponent(params.id)));
    } catch (e) {
      setError(getShopErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleCancel() {
    if (!order) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await cancelMyOrder(order.orderNumber);
      setShowCancel(false);
      await load();
    } catch (e) {
      setShowCancel(false);
      setCancelError(getShopErrorMessage(e));
    } finally {
      setCancelling(false);
    }
  }

  const back = (
    <Link
      href="/orders"
      className="inline-flex items-center gap-1 text-small text-ink-muted hover:text-ink mb-8 transition-colors"
    >
      <ChevronRight size={16} strokeWidth={1.5} />
      بازگشت به سفارش‌ها
    </Link>
  );

  if (loading || error || !order) {
    return (
      <div>
        {back}
        <p className={error ? "text-body text-rosewood-dark" : "text-body text-ink-muted"}>
          {loading ? "در حال بارگذاری..." : error ?? "سفارش پیدا نشد."}
        </p>
      </div>
    );
  }

  const done = doneSteps(order.status);

  return (
    <div>
      {back}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-h1 font-light text-ink">{order.orderNumber}</h1>
          <p className="text-small text-ink-muted mt-1">تاریخ ثبت: {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={order.status} />
      </div>

      {/* مسیر پیگیری */}
      <div className="relative mb-14">
        <div className="absolute top-4 right-0 left-0 h-px bg-line" />
        <div
          className="absolute top-4 right-0 h-px bg-sage"
          style={{ width: `${((done - 1) / (trackingLabels.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {trackingLabels.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center z-10",
                  i < done ? "bg-sage" : "bg-line"
                )}
              >
                {i < done && <Check size={14} strokeWidth={2} className="text-cream" />}
              </div>
              <span className="text-small text-ink">{label}</span>
            </div>
          ))}
        </div>
        {order.status === "cancelled" && (
          <p className="text-small text-rosewood-dark mt-6 text-center">این سفارش لغو شده است.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12">
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
              <span className="text-ink">{order.recipientName}</span>
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

        <div className="flex flex-col gap-6 h-fit">
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

          {order.status === "processing" && (
            <div>
              <Button variant="secondary" size="md" className="w-full" onClick={() => setShowCancel(true)}>
                لغو سفارش
              </Button>
              {cancelError && <p className="text-small text-rosewood-dark mt-3">{cancelError}</p>}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCancel}
        title="لغو سفارش"
        description={cancelling ? "در حال لغو سفارش..." : "آیا از لغو این سفارش مطمئن هستید؟"}
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
      />
    </div>
  );
}
