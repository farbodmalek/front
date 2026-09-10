"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

// فعلاً به‌جای تصاویر واقعی، شماره تصویر را در باکس‌ها نمایش می‌دهیم
export function ProductGallery({ imageCount = 4 }: { imageCount?: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = Array.from({ length: imageCount }, (_, i) => i);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex md:flex-col gap-3">
        {images.map((i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "w-16 h-20 bg-line/40 flex items-center justify-center border transition-colors",
              activeIndex === i ? "border-ink" : "border-transparent"
            )}
          >
            <span className="text-small text-ink-muted">{i + 1}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 aspect-[3/4] bg-line/40 flex items-center justify-center">
        <span className="text-ink-muted text-small">
          تصویر محصول {activeIndex + 1}
        </span>
      </div>
    </div>
  );
}
