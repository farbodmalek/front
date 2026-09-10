"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1.1fr_1fr] bg-cream">
      {/* پنل تزئینی برند */}
      <div
        className="hidden md:flex relative overflow-hidden items-center justify-center px-16"
        style={{
          background:
            "linear-gradient(155deg, #241F1C 0%, #3A2A26 55%, #211C19 100%)",
        }}
      >
        {/* الگوی نقطه‌ای ظریف */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(250,248,246,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* اشکال محو تزئینی */}
        <motion.div
          className="absolute w-[480px] h-[480px] rounded-full bg-rosewood/40 blur-[100px]"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          style={{ top: "-10rem", right: "-8rem" }}
        />
        <motion.div
          className="absolute w-[360px] h-[360px] rounded-full bg-sage/30 blur-[90px]"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.25 }}
          style={{ bottom: "-8rem", left: "-6rem" }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full bg-rosewood-light/20 blur-[70px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
          style={{ top: "40%", left: "10%" }}
        />

        {/* نشان شناور */}
        <motion.div
          initial={{ opacity: 0, y: -10, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="absolute top-20 left-16 border border-cream/25 bg-cream/5 backdrop-blur-sm px-4 py-2 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.4)]"
        >
          <span className="text-small text-rosewood-light">کالکشن پاییز ۱۴۰۴</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-sm"
        >
          <span className="block w-10 h-px bg-rosewood-light mb-8" />
          <h2 className="text-display-sm font-light text-cream leading-tight mb-6">
            هر روزت
            <br />
            یک استایل تازه
          </h2>
          <p className="text-body text-cream/60 leading-8 mb-10">
            عضو خانواده «آوای پوشاک» شو و به کالکشن‌های اختصاصی، تخفیف‌های
            زودهنگام و پیشنهادهای شخصی‌سازی‌شده دسترسی داشته باش.
          </p>

          <div className="flex items-center gap-8 pt-6 border-t border-cream/15">
            <div>
              <p className="text-h2 font-light text-cream">+۱۲هزار</p>
              <p className="text-small text-cream/50 mt-1">مشتری راضی</p>
            </div>
            <div className="w-px h-10 bg-cream/15" />
            <div>
              <p className="text-h2 font-light text-cream">+۸۰۰</p>
              <p className="text-small text-cream/50 mt-1">محصول متنوع</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* پنل فرم */}
      <div className="flex flex-col relative">
        <header className="px-8 md:px-16 py-8 relative z-20">
          <Link href="/" className="text-2xl font-light tracking-tightish text-ink">
            آوای پوشاک
          </Link>
        </header>

        <main className="flex-1 flex items-center md:justify-start px-8 md:pr-16 pb-24">
          {/* کارت شناور که روی مرز دو پنل هم‌پوشانی دارد */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative z-20 w-full max-w-sm md:-mr-20 bg-surface border border-line/60 p-8 md:p-10
                       shadow-[0_40px_80px_-20px_rgba(43,38,34,0.18),0_15px_35px_-15px_rgba(156,107,99,0.15)]"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
