"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const sortOptions = [
  { label: "جدیدترین", value: "newest" },
  { label: "ارزان‌ترین", value: "price_asc" },
  { label: "گران‌ترین", value: "price_desc" },
  { label: "پرفروش‌ترین", value: "bestselling" },
];

export function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = sortOptions.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-body text-ink-muted hover:text-ink transition-colors"
      >
        <span>{current?.label ?? "مرتب‌سازی"}</span>
        <ChevronDown size={16} strokeWidth={1.5} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-44 bg-surface border border-line z-10">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "block w-full text-right px-4 py-3 text-body hover:bg-cream transition-colors",
                opt.value === value ? "text-ink" : "text-ink-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
