"use client";

import { cn } from "@/lib/utils/cn";
import { ProductVariant } from "../types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedAttributes: Record<string, string>;
  onSelect: (attributeName: string, value: string) => void;
}

// از روی لیست واریانت‌ها، اسم‌های ویژگی (مثل سایز، رنگ) و مقادیرشان را استخراج می‌کند
function extractAttributeGroups(variants: ProductVariant[]) {
  const groups = new Map<string, Set<string>>();

  variants.forEach((variant) => {
    variant.attributes.forEach((attr) => {
      if (!groups.has(attr.name)) {
        groups.set(attr.name, new Set());
      }
      groups.get(attr.name)!.add(attr.value);
    });
  });

  return Array.from(groups.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values),
  }));
}

export function VariantSelector({
  variants,
  selectedAttributes,
  onSelect,
}: VariantSelectorProps) {
  const attributeGroups = extractAttributeGroups(variants);

  return (
    <div className="flex flex-col gap-6">
      {attributeGroups.map((group) => (
        <div key={group.name}>
          <h3 className="text-body text-ink mb-3">{group.name}</h3>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const isSelected = selectedAttributes[group.name] === value;

              // بررسی موجودی: آیا واریانتی با این مقدار و بقیه انتخاب‌های فعلی موجوده
              const isAvailable = variants.some((v) => {
                const matchesValue = v.attributes.some(
                  (a) => a.name === group.name && a.value === value
                );
                const matchesOthers = Object.entries(selectedAttributes).every(
                  ([key, val]) =>
                    key === group.name ||
                    v.attributes.some((a) => a.name === key && a.value === val)
                );
                return matchesValue && matchesOthers && v.stock > 0;
              });

              return (
                <button
                  key={value}
                  disabled={!isAvailable}
                  onClick={() => onSelect(group.name, value)}
                  className={cn(
                    "min-w-[2.5rem] h-10 px-3 border text-small transition-colors",
                    isSelected
                      ? "bg-ink text-cream border-ink"
                      : "border-line text-ink-muted hover:border-ink hover:text-ink",
                    !isAvailable &&
                      "opacity-30 cursor-not-allowed hover:border-line hover:text-ink-muted line-through"
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function findMatchingVariant(
  variants: ProductVariant[],
  selectedAttributes: Record<string, string>
): ProductVariant | undefined {
  return variants.find((v) =>
    Object.entries(selectedAttributes).every(([key, val]) =>
      v.attributes.some((a) => a.name === key && a.value === val)
    )
  );
}
