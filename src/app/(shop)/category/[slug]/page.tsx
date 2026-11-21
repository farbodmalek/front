"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, ProductCardData } from "@/features/product/components/ProductCard";
import { getProductsByCategory } from "@/features/product/api";
import { getCategories } from "@/features/category/api";
import { getShopErrorMessage } from "@/lib/api/errors";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [name, setName] = useState<string>("");
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const slug = decodeURIComponent(params.slug);

    (async () => {
      try {
        const categories = await getCategories();
        const category = categories.find((c) => c.slug === slug);
        if (!category) {
          if (!cancelled) setError("این دسته‌بندی پیدا نشد.");
          return;
        }
        if (!cancelled) setName(category.name);
        const items = await getProductsByCategory(category.id);
        if (!cancelled) setProducts(items);
      } catch (e) {
        if (!cancelled) setError(getShopErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-h1 font-light text-ink mb-10">{name || "دسته‌بندی"}</h1>

        {loading ? (
          <p className="text-body text-ink-muted">در حال بارگذاری...</p>
        ) : error ? (
          <p className="text-body text-rosewood-dark">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-body text-ink-muted">محصولی در این دسته وجود ندارد.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
