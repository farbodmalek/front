"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 6 }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      const remainingSlots = maxImages - images.length;
      const newImages: UploadedImage[] = files.slice(0, remainingSlots).map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      onChange([...images, ...newImages]);
    },
    [images, onChange, maxImages]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function handleRemove(id: string) {
    onChange(images.filter((img) => img.id !== id));
  }

  return (
    <div>
      {/* منطقه Drag & Drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-12 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-rosewood-dark bg-rosewood-light/10"
            : "border-line hover:border-ink-muted"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <UploadCloud size={32} strokeWidth={1.3} className="text-ink-muted" />
        <div>
          <p className="text-body text-ink">
            تصاویر را اینجا بکشید و رها کنید
          </p>
          <p className="text-small text-ink-muted mt-1">
            یا کلیک کنید تا از کامپیوترتان انتخاب کنید (حداکثر {maxImages} تصویر)
          </p>
        </div>
      </div>

      {/* پیش‌نمایش تصاویر */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-5">
          <AnimatePresence>
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="relative aspect-square group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.previewUrl}
                  alt={`تصویر ${index + 1}`}
                  className="w-full h-full object-cover border border-line"
                />
                {index === 0 && (
                  <span className="absolute bottom-1 right-1 bg-ink text-cream text-[10px] px-2 py-0.5">
                    تصویر اصلی
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(img.id)}
                  aria-label="حذف تصویر"
                  className="absolute -top-2 -left-2 w-6 h-6 bg-ink text-cream rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={13} strokeWidth={2} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square border border-dashed border-line flex items-center justify-center text-ink-muted hover:border-ink hover:text-ink transition-colors"
            >
              <ImagePlus size={22} strokeWidth={1.3} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
