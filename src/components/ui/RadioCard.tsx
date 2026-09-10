"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface RadioCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  trailing?: ReactNode;
}

export function RadioCard({
  selected,
  onSelect,
  title,
  description,
  trailing,
}: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full flex items-center justify-between gap-4 border px-5 py-4 text-right transition-colors duration-200",
        selected
          ? "border-ink bg-surface"
          : "border-line hover:border-ink-muted"
      )}
    >
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors",
            selected ? "border-ink" : "border-ink-muted"
          )}
        >
          {selected && <span className="w-2 h-2 rounded-full bg-ink" />}
        </span>
        <div>
          <p className="text-body text-ink">{title}</p>
          {description && (
            <p className="text-small text-ink-muted mt-1">{description}</p>
          )}
        </div>
      </div>
      {trailing && <div className="text-body text-ink flex-shrink-0">{trailing}</div>}
    </button>
  );
}
