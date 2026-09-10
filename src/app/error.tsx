"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // می‌توانید خطا را به سرویس مانیتورینگ (مثل Sentry) ارسال کنید
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-16 border border-rosewood-dark/40 bg-rosewood-light/10 flex items-center justify-center mb-8"
        >
          <AlertCircle size={28} strokeWidth={1.3} className="text-rosewood-dark" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h1 className="text-h1 font-light text-ink mb-3">
            مشکلی پیش آمد
          </h1>
          <p className="text-body text-ink-muted mb-10 max-w-sm mx-auto leading-8">
            متاسفانه در پردازش این صفحه خطایی رخ داد. لطفاً دوباره تلاش کنید
            یا به صفحه اصلی بازگردید.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                بازگشت به خانه
              </Button>
            </Link>
            <Button size="lg" onClick={reset} className="w-full sm:w-auto">
              تلاش دوباره
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
}
