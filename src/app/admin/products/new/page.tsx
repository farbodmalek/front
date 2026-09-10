"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader, UploadedImage } from "@/components/admin/ImageUploader";
import { VariantManager, VariantRow } from "@/components/admin/VariantManager";

const categoryOptions = [
  { label: "لباس مجلسی", value: "lebas-majlesi" },
  { label: "لباس زیر", value: "lebas-zir" },
  { label: "جوراب", value: "jorab" },
  { label: "پوشاک روزمره", value: "roozmareh" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([
    { id: "v-1", size: "", color: "", stock: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // TODO: وقتی بک‌اند آماده شد:
    // 1. یک FormData بساز و فایل‌های images[i].file رو بهش اضافه کن
    // 2. به یک endpoint مثل POST /api/products (multipart/form-data) ارسال کن
    // 3. بعد از موفقیت، به لیست محصولات برگرد

    await new Promise((resolve) => setTimeout(resolve, 800)); // شبیه‌سازی تاخیر شبکه
    setSubmitting(false);
    router.push("/admin/products");
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-small text-ink-muted hover:text-ink mb-8 transition-colors"
      >
        <ChevronRight size={16} strokeWidth={1.5} />
        بازگشت به محصولات
      </Link>

      <h1 className="text-h1 font-light text-ink mb-2">افزودن محصول جدید</h1>
      <p className="text-body text-ink-muted mb-10">
        اطلاعات محصول را کامل کنید و تصاویر آن را بارگذاری نمایید.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10 max-w-2xl">
        {/* اطلاعات پایه */}
        <div>
          <h2 className="text-body text-ink mb-5">اطلاعات پایه</h2>
          <div className="flex flex-col gap-5">
            <Input id="product-title" label="نام محصول" required />

            <div className="flex flex-col gap-2">
              <label htmlFor="product-category" className="text-small text-ink-muted">
                دسته‌بندی
              </label>
              <select
                id="product-category"
                required
                className="bg-surface border border-line px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors"
              >
                <option value="">انتخاب کنید</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Input id="product-price" label="قیمت (تومان)" type="number" required />
              <Input id="product-discount-price" label="قیمت با تخفیف (اختیاری)" type="number" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="product-description" className="text-small text-ink-muted">
                توضیحات محصول
              </label>
              <textarea
                id="product-description"
                rows={4}
                className="bg-surface border border-line px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* تصاویر */}
        <div>
          <h2 className="text-body text-ink mb-2">تصاویر محصول</h2>
          <p className="text-small text-ink-muted mb-5">
            اولین تصویری که اضافه می‌کنید به‌عنوان تصویر اصلی محصول نمایش داده می‌شود.
          </p>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* واریانت‌ها */}
        <div>
          <h2 className="text-body text-ink mb-2">سایز، رنگ و موجودی</h2>
          <p className="text-small text-ink-muted mb-5">
            برای هر ترکیب سایز/رنگ، یک ردیف جداگانه با موجودی مربوطه اضافه کنید.
          </p>
          <VariantManager variants={variants} onChange={setVariants} />
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-line">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "در حال ذخیره..." : "ذخیره محصول"}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="secondary" size="lg">
              انصراف
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
