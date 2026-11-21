"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import { AddressStep } from "@/features/checkout/components/AddressStep";
import { ShippingStep, shippingMethods } from "@/features/checkout/components/ShippingStep";
import { PaymentStep, paymentMethods } from "@/features/checkout/components/PaymentStep";
import { ReviewStep } from "@/features/checkout/components/ReviewStep";
import { OrderSummarySidebar } from "@/features/checkout/components/OrderSummarySidebar";
import { useCartStore } from "@/features/cart/store";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { Address, AddressInput, addressSummary, createAddress, getAddresses } from "@/features/address/api";
import { placeOrder } from "@/features/order/api";
import { getShopErrorMessage } from "@/lib/api/errors";

const steps = [
  { id: "address", label: "آدرس" },
  { id: "shipping", label: "روش ارسال" },
  { id: "payment", label: "پرداخت" },
  { id: "review", label: "تایید نهایی" },
];

// تسویه حساب فقط برای کاربر لاگین‌شده است (اگر نبود، به /login می‌رود و بعد از ورود برمی‌گردد)
export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const clearLocalCart = useCartStore((s) => s.clearLocal);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [shippingId, setShippingId] = useState<string | null>("standard");
  const [paymentId, setPaymentId] = useState<string | null>("online");
  const [direction, setDirection] = useState(1);

  const selectedShipping = shippingMethods.find((m) => m.id === shippingId);
  const selectedAddress = addresses.find((a) => a.id === addressId);

  // سبد را از سرور تازه کن (قیمت و موجودی واقعی) و آدرس‌ها را بگیر
  useEffect(() => {
    void useCartStore.getState().refresh();

    getAddresses()
      .then((list) => {
        setAddresses(list);
        const preferred = list.find((a) => a.isDefault) ?? list[0];
        setAddressId(preferred ? preferred.id : null);
      })
      .catch((e) => setAddressesError(getShopErrorMessage(e)))
      .finally(() => setAddressesLoading(false));
  }, []);

  async function handleCreateAddress(input: AddressInput): Promise<string | null> {
    try {
      const before = new Set(addresses.map((a) => a.id));
      const list = await createAddress(input);
      setAddresses(list);
      const created = list.find((a) => !before.has(a.id));
      if (created) setAddressId(created.id);
      return null;
    } catch (e) {
      return getShopErrorMessage(e);
    }
  }

  function goNext() {
    setDirection(1);
    setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));
  }

  function goBack() {
    setDirection(-1);
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  async function handleFinalSubmit() {
    if (!addressId || !shippingId || !paymentId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const orderNumber = await placeOrder({
        addressId,
        shippingMethod: shippingId,
        paymentMethod: paymentId,
      });
      clearLocalCart(); // سرور سبد را خالی کرده؛ سبد مرورگر هم خالی شود
      router.push(`/order-confirmation?order=${encodeURIComponent(orderNumber)}`);
    } catch (e) {
      setSubmitError(getShopErrorMessage(e));
      setSubmitting(false);
      void useCartStore.getState().refresh();
    }
  }

  const canProceed =
    (currentIndex === 0 && !!addressId) ||
    (currentIndex === 1 && !!shippingId) ||
    (currentIndex === 2 && !!paymentId) ||
    currentIndex === 3;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-h1 font-light text-ink mb-12">تکمیل خرید</h1>

        <CheckoutStepper steps={steps} currentIndex={currentIndex} />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-16">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={steps[currentIndex].id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentIndex === 0 && (
                  <AddressStep
                    addresses={addresses}
                    loading={addressesLoading}
                    loadError={addressesError}
                    selectedAddressId={addressId}
                    onSelectAddress={setAddressId}
                    onCreate={handleCreateAddress}
                  />
                )}
                {currentIndex === 1 && (
                  <ShippingStep selectedMethodId={shippingId} onSelectMethod={setShippingId} />
                )}
                {currentIndex === 2 && (
                  <PaymentStep selectedMethodId={paymentId} onSelectMethod={setPaymentId} />
                )}
                {currentIndex === 3 && (
                  <ReviewStep
                    addressLabel={
                      selectedAddress ? `${selectedAddress.title} — ${addressSummary(selectedAddress)}` : "-"
                    }
                    shippingLabel={selectedShipping?.title ?? "-"}
                    paymentLabel={paymentId === "online" ? "پرداخت آنلاین" : "پرداخت در محل"}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {submitError && <p className="text-body text-rosewood-dark mt-8">{submitError}</p>}

            <div className="flex items-center gap-4 mt-12">
              {currentIndex > 0 && (
                <Button variant="secondary" size="lg" onClick={goBack}>
                  بازگشت
                </Button>
              )}
              {currentIndex < steps.length - 1 ? (
                <Button size="lg" disabled={!canProceed} onClick={goNext} className="flex-1">
                  ادامه
                </Button>
              ) : (
                <Button size="lg" onClick={handleFinalSubmit} disabled={submitting} className="flex-1">
                  {submitting ? "در حال ثبت سفارش..." : "پرداخت و ثبت نهایی سفارش"}
                </Button>
              )}
            </div>
          </div>

          <OrderSummarySidebar shippingCost={selectedShipping?.price ?? 0} />
        </div>
      </main>

      <Footer />
    </>
  );
}
