"use client";

import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ProductFilters,
  useProductFiltersState,
} from "@/features/product/components/ProductFilters";
import { getCategories } from "@/features/category/api";
import { getProducts } from "@/features/product/api";
import { getShopErrorMessage } from "@/lib/api/errors";
import { SortDropdown } from "@/features/product/components/SortDropdown";
import {
  ProductCard,
  ProductCardData,
} from "@/features/product/components/ProductCard";

type ListProduct = ProductCardData & { category: string };

export default function ProductsPage() {
  const {
    selectedCategories,
    toggleCategory,
    selectedSizes,
    toggleSize,
    priceRange,
    setPriceRange,
  } = useProductFiltersState();

  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
  const [allProducts, setAllProducts] = useState<ListProduct[]>([]);

  useEffect(() => {
    getCategories()
      .then((cats) => setCategoryOptions(cats.map((c) => ({ label: c.name, value: c.name }))))
      .catch(() => setCategoryOptions([]));
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((items) => {
        if (!cancelled) {
          setAllProducts(items.map((p) => ({ ...p, category: p.categoryName })));
        }
      })
      .catch((e) => {
        if (!cancelled) setError(getShopErrorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [sort, setSort] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let items = allProducts.filter((p) => {
      const inCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category);
      const price = p.discountPrice ?? p.basePrice;
      const inPrice = price <= priceRange[1];
      return inCategory && inPrice;
    });

    if (sort === "price_asc") {
      items = [...items].sort(
        (a, b) => (a.discountPrice ?? a.basePrice) - (b.discountPrice ?? b.basePrice)
      );
    } else if (sort === "price_desc") {
      items = [...items].sort(
        (a, b) => (b.discountPrice ?? b.basePrice) - (a.discountPrice ?? a.basePrice)
      );
    }

    return items;
  }, [allProducts, selectedCategories, priceRange, sort]);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-h1 font-light text-ink">همه محصولات</h1>
            <p className="text-small text-ink-muted mt-2">
              {filteredProducts.length} محصول
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 text-body text-ink-muted"
            >
              <SlidersHorizontal size={18} strokeWidth={1.5} />
              فیلترها
            </button>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12">
          {/* فیلتر دسکتاپ */}
          <div className="hidden md:block">
            <ProductFilters
              categories={categoryOptions}
              selectedCategories={selectedCategories}
              onCategoryChange={toggleCategory}
              selectedSizes={selectedSizes}
              onSizeChange={toggleSize}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>

          {/* گرید محصولات */}
          {loading ? (
            <div className="text-center py-24">
              <p className="text-body text-ink-muted">در حال بارگذاری محصولات...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-body text-rosewood-dark">{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-body text-ink-muted">
                محصولی با این فیلترها پیدا نشد.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* فیلتر موبایل (drawer) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-80 bg-cream p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-h2 font-light text-ink">فیلترها</h2>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="بستن">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <ProductFilters
              categories={categoryOptions}
              selectedCategories={selectedCategories}
              onCategoryChange={toggleCategory}
              selectedSizes={selectedSizes}
              onSizeChange={toggleSize}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
