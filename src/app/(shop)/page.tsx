"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ProductCard, ProductCardData } from "@/features/product/components/ProductCard";

const categories = [
  { name: "لباس مجلسی", slug: "lebas-majlesi" },
  { name: "لباس زیر", slug: "lebas-zir" },
  { name: "جوراب", slug: "jorab" },
  { name: "پوشاک روزمره", slug: "roozmareh" },
];

const featuredProducts: ProductCardData[] = [
  { slug: "p1", title: "پیراهن مجلسی حریر", categoryName: "لباس مجلسی", basePrice: 1850000, discountPrice: 1490000 },
  { slug: "p2", title: "جوراب ساق‌بلند نخی", categoryName: "جوراب", basePrice: 120000 },
  { slug: "p3", title: "ست لباس زیر دنتلا", categoryName: "لباس زیر", basePrice: 640000 },
  { slug: "p4", title: "تونیک روزمره کتان", categoryName: "پوشاک روزمره", basePrice: 590000 },
];

const containerStagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-small text-rosewood-dark mb-4">کالکشن جدید فصل</p>
            <h1 className="text-display-sm md:text-display font-light text-ink leading-tight">
              پوشاکی که با
              <br />
              روزمرگی‌ات همراه می‌شود
            </h1>
            <p className="text-body text-ink-muted mt-6 max-w-md leading-8">
              از جوراب‌های ساده صبح تا پیراهن‌های مجلسی شب؛ هر قطعه با دقت
              انتخاب شده تا کنار شما باشد.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/products">
                <Button size="lg">مشاهده محصولات</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="aspect-[4/5] bg-rosewood-light/30 flex items-center justify-center"
          >
            <span className="text-ink-muted text-small">تصویر هیرو</span>
          </motion.div>
        </section>

        <SectionDivider />

        {/* Categories */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="text-h1 font-light text-ink mb-10">دسته‌بندی‌ها</h2>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerStagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
          >
            {categories.map((cat) => (
              <motion.div key={cat.slug} variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }}>
                <Link href={`/category/${cat.slug}`} className="group block">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="aspect-square bg-line/40 flex items-center justify-center"
                  >
                    <span className="text-ink-muted text-small">تصویر</span>
                  </motion.div>
                  <p className="mt-3 text-body text-ink text-center">{cat.name}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <SectionDivider />

        {/* Featured Products */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-h1 font-light text-ink">جدیدترین‌ها</h2>
            <Link href="/products" className="text-body text-ink-muted hover:text-ink">
              مشاهده همه
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
