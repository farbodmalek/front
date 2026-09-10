"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function QuantitySelector({ value, onChange, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-line">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-10 h-10 flex items-center justify-center text-ink-muted hover:text-ink transition-colors disabled:opacity-30"
        disabled={value <= 1}
        aria-label="کاهش تعداد"
      >
        <Minus size={16} strokeWidth={1.5} />
      </button>
      <span className="w-10 text-center text-body text-ink">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-10 h-10 flex items-center justify-center text-ink-muted hover:text-ink transition-colors disabled:opacity-30"
        disabled={value >= max}
        aria-label="افزایش تعداد"
      >
        <Plus size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
