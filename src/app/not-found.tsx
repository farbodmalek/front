"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-4"
        >
          <span className="text-[7rem] md:text-[9rem] font-light text-line leading-none select-none">
            ۴۰۴
          </span>
          <motion.div
            initial={{ opacity: 0, y: -8, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -8 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-ink bg-cream flex items-center justify-center"
          >
            <ShoppingBag size={26} strokeWidth={1.2} className="text-rosewood-dark" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-h1 font-light text-ink mb-3 mt-6">
            این صفحه پیدا نشد
          </h1>
          <p className="text-body text-ink-muted mb-10 max-w-sm mx-auto leading-8">
            محصول یا صفحه‌ای که دنبالش بودید جابه‌جا شده یا وجود نداره.
            می‌تونید از کالکشن‌مون دیدن کنید یا به خانه برگردید.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                بازگشت به خانه
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                مشاهده محصولات
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
}
