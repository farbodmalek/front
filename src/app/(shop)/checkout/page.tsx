"use client";

import { useState } from "react";
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
  const clearCart = useCartStore((s) => s.clear);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addressId, setAddressId] = useState<string | null>("addr1");
  const [shippingId, setShippingId] = useState<string | null>("standard");
  const [paymentId, setPaymentId] = useState<string | null>("online");
  const [direction, setDirection] = useState(1);

  const selectedShipping = shippingMethods.find((m) => m.id === shippingId);

  function goNext() {
    setDirection(1);
    setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));
  }

  function goBack() {
    setDirection(-1);
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function handleFinalSubmit() {
    // TODO: اتصال به API نهایی ثبت سفارش
    clearCart();
    router.push("/order-confirmation");
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
                  <AddressStep selectedAddressId={addressId} onSelectAddress={setAddressId} />
                )}
                {currentIndex === 1 && (
                  <ShippingStep selectedMethodId={shippingId} onSelectMethod={setShippingId} />
                )}
                {currentIndex === 2 && (
                  <PaymentStep selectedMethodId={paymentId} onSelectMethod={setPaymentId} />
                )}
                {currentIndex === 3 && (
                  <ReviewStep
                    addressLabel={addressId === "addr1" ? "منزل — تهران، ونک" : "محل کار — تهران، سعادت‌آباد"}
                    shippingLabel={selectedShipping?.title ?? "-"}
                    paymentLabel={paymentId === "online" ? "پرداخت آنلاین" : "پرداخت در محل"}
                  />
                )}
              </motion.div>
            </AnimatePresence>

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
                <Button size="lg" onClick={handleFinalSubmit} className="flex-1">
                  پرداخت و ثبت نهایی سفارش
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
