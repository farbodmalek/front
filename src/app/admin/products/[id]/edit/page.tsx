"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader, UploadedImage } from "@/components/admin/ImageUploader";
import { VariantManager, VariantRow } from "@/components/admin/VariantManager";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const categoryOptions = [
  { label: "لباس مجلسی", value: "lebas-majlesi" },
  { label: "لباس زیر", value: "lebas-zir" },
  { label: "جوراب", value: "jorab" },
  { label: "پوشاک روزمره", value: "roozmareh" },
];

// نمونه داده — بعداً با fetch واقعی بر اساس params.id جایگزین می‌شود
function getMockProductForEdit() {
  return {
    title: "پیراهن مجلسی حریر",
    category: "lebas-majlesi",
    price: "1850000",
    discountPrice: "1490000",
    description: "پیراهن مجلسی از پارچه حریر درجه‌یک، مناسب مهمانی و مراسم شب.",
    variants: [
      { id: "v-1", size: "36", color: "مشکی", stock: "5" },
      { id: "v-2", size: "38", color: "مشکی", stock: "0" },
      { id: "v-3", size: "40", color: "بردو", stock: "3" },
    ] as VariantRow[],
  };
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const initial = getMockProductForEdit();

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>(initial.variants);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: اتصال به PUT /api/products/{id}
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    router.push("/admin/products");
  }

  function handleDelete() {
    // TODO: اتصال به DELETE /api/products/{id}
    setShowDeleteDialog(false);
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

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-h1 font-light text-ink">ویرایش محصول</h1>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-2 text-small text-rosewood-dark hover:underline"
        >
          <Trash2 size={15} strokeWidth={1.5} />
          حذف این محصول
        </button>
      </div>
      <p className="text-body text-ink-muted mb-10">شناسه محصول: {params.id}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10 max-w-2xl">
        <div>
          <h2 className="text-body text-ink mb-5">اطلاعات پایه</h2>
          <div className="flex flex-col gap-5">
            <Input id="product-title" label="نام محصول" defaultValue={initial.title} required />

            <div className="flex flex-col gap-2">
              <label htmlFor="product-category" className="text-small text-ink-muted">
                دسته‌بندی
              </label>
              <select
                id="product-category"
                defaultValue={initial.category}
                required
                className="bg-surface border border-line px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Input id="product-price" label="قیمت (تومان)" type="number" defaultValue={initial.price} required />
              <Input
                id="product-discount-price"
                label="قیمت با تخفیف (اختیاری)"
                type="number"
                defaultValue={initial.discountPrice}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="product-description" className="text-small text-ink-muted">
                توضیحات محصول
              </label>
              <textarea
                id="product-description"
                rows={4}
                defaultValue={initial.description}
                className="bg-surface border border-line px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-body text-ink mb-2">تصاویر محصول</h2>
          <p className="text-small text-ink-muted mb-5">
            تصاویر فعلی از سرور بارگذاری می‌شوند (پس از اتصال به بک‌اند). برای افزودن تصویر جدید از کادر زیر استفاده کنید.
          </p>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <div>
          <h2 className="text-body text-ink mb-2">سایز، رنگ و موجودی</h2>
          <VariantManager variants={variants} onChange={setVariants} />
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-line">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="secondary" size="lg">
              انصراف
            </Button>
          </Link>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="حذف محصول"
        description="آیا مطمئن هستید که می‌خواهید این محصول را برای همیشه حذف کنید؟"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
