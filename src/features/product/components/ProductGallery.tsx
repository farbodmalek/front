"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

// عکس‌های واقعی محصول؛ اگر محصول عکس نداشت، جای‌نما نشان داده می‌شود
export function ProductGallery({ images = [] }: { images?: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveIndex(i)}
              aria-label={`تصویر ${i + 1}`}
              className={cn(
                "w-16 h-20 bg-line/40 overflow-hidden border transition-colors",
                activeIndex === i ? "border-ink" : "border-transparent"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 aspect-[3/4] bg-line/40 flex items-center justify-center overflow-hidden">
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active} alt="تصویر محصول" className="w-full h-full object-cover" />
        ) : (
          <span className="text-ink-muted text-small">تصویر محصول</span>
        )}
      </div>
    </div>
  );
}
