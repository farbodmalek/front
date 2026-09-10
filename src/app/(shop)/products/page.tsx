"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ProductFilters,
  useProductFiltersState,
} from "@/features/product/components/ProductFilters";
import { SortDropdown } from "@/features/product/components/SortDropdown";
import {
  ProductCard,
  ProductCardData,
} from "@/features/product/components/ProductCard";

// نمونه داده — بعداً از API واقعی جایگزین می‌شود
const allProducts: (ProductCardData & { category: string })[] = [
  { slug: "p1", title: "پیراهن مجلسی حریر", categoryName: "لباس مجلسی", category: "lebas-majlesi", basePrice: 1850000, discountPrice: 1490000 },
  { slug: "p2", title: "جوراب ساق‌بلند نخی", categoryName: "جوراب", category: "jorab", basePrice: 120000 },
  { slug: "p3", title: "ست لباس زیر دنتلا", categoryName: "لباس زیر", category: "lebas-zir", basePrice: 640000 },
  { slug: "p4", title: "تونیک روزمره کتان", categoryName: "پوشاک روزمره", category: "roozmareh", basePrice: 590000 },
  { slug: "p5", title: "پیراهن شب بلند", categoryName: "لباس مجلسی", category: "lebas-majlesi", basePrice: 2450000 },
  { slug: "p6", title: "جوراب ورزشی سه‌تایی", categoryName: "جوراب", category: "jorab", basePrice: 150000, discountPrice: 99000 },
  { slug: "p7", title: "سوتین بدون بند", categoryName: "لباس زیر", category: "lebas-zir", basePrice: 380000 },
  { slug: "p8", title: "شلوار جین راسته", categoryName: "پوشاک روزمره", category: "roozmareh", basePrice: 720000 },
];

export default function ProductsPage() {
  const {
    selectedCategories,
    toggleCategory,
    selectedSizes,
    toggleSize,
    priceRange,
    setPriceRange,
  } = useProductFiltersState();

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
  }, [selectedCategories, priceRange, sort]);

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
              selectedCategories={selectedCategories}
              onCategoryChange={toggleCategory}
              selectedSizes={selectedSizes}
              onSizeChange={toggleSize}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>

          {/* گرید محصولات */}
          {filteredProducts.length > 0 ? (
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
