"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const sizeOptions = ["36", "38", "40", "42", "44"];

interface ProductFiltersProps {
  categories: { label: string; value: string }[];
  selectedCategories: string[];
  onCategoryChange: (value: string) => void;
  selectedSizes: string[];
  onSizeChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export function ProductFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  selectedSizes,
  onSizeChange,
  priceRange,
  onPriceRangeChange,
}: ProductFiltersProps) {
  return (
    <aside className="flex flex-col gap-10">
      {/* دسته‌بندی */}
      <div>
        <h3 className="text-body text-ink mb-4">دسته‌بندی</h3>
        <div className="flex flex-col gap-3">
          {categories.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(opt.value)}
                onChange={() => onCategoryChange(opt.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "w-4 h-4 border border-ink-muted flex items-center justify-center transition-colors",
                  selectedCategories.includes(opt.value) &&
                    "bg-ink border-ink"
                )}
              >
                {selectedCategories.includes(opt.value) && (
                  <span className="w-1.5 h-1.5 bg-cream" />
                )}
              </span>
              <span className="text-body text-ink-muted group-hover:text-ink transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* سایز */}
      <div>
        <h3 className="text-body text-ink mb-4">سایز</h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={cn(
                "w-10 h-10 border text-small transition-colors",
                selectedSizes.includes(size)
                  ? "bg-ink text-cream border-ink"
                  : "border-line text-ink-muted hover:border-ink hover:text-ink"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* بازه قیمت */}
      <div>
        <h3 className="text-body text-ink mb-4">محدوده قیمت</h3>
        <div className="flex flex-col gap-3">
          <input
            type="range"
            min={0}
            max={5000000}
            step={50000}
            value={priceRange[1]}
            onChange={(e) =>
              onPriceRangeChange([priceRange[0], Number(e.target.value)])
            }
            className="accent-ink"
          />
          <div className="flex justify-between text-small text-ink-muted">
            <span>{priceRange[0].toLocaleString("fa-IR")} تومان</span>
            <span>{priceRange[1].toLocaleString("fa-IR")} تومان</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function useProductFiltersState() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);

  function toggleCategory(value: string) {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  function toggleSize(value: string) {
    setSelectedSizes((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  return {
    selectedCategories,
    toggleCategory,
    selectedSizes,
    toggleSize,
    priceRange,
    setPriceRange,
  };
}
