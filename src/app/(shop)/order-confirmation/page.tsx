"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

function useOrderNumber() {
  return useMemo(() => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `AV-${random}`;
  }, []);
}

export default function OrderConfirmationPage() {
  const orderNumber = useOrderNumber();

  return (
    <>
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-28 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-20 h-20 rounded-full bg-sage/10 border border-sage flex items-center justify-center mb-8"
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <motion.path
              d="M8 17.5L14 23.5L26 10.5"
              stroke="#4A5043"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="text-h1 font-light text-ink mb-3">
            سفارش شما ثبت شد
          </h1>
          <p className="text-body text-ink-muted mb-8 max-w-sm mx-auto leading-8">
            از خرید شما سپاسگزاریم. جزئیات سفارش برای شماره موبایل‌تان پیامک
            خواهد شد.
          </p>

          <div className="inline-block border border-line px-8 py-4 mb-10">
            <p className="text-small text-ink-muted mb-1">شماره سفارش</p>
            <p className="text-h2 font-light text-ink tracking-wide">{orderNumber}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                مشاهده سفارش
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                ادامه خرید
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
}
