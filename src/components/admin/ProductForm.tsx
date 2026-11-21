"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader, UploadedImage } from "@/components/admin/ImageUploader";
import { VariantManager, VariantRow } from "@/components/admin/VariantManager";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  deleteProduct,
  getAdminCategories,
  getAdminProduct,
  saveProduct,
  uploadImage,
} from "@/features/admin/api";
import { Category } from "@/features/category/api";
import { getShopErrorMessage } from "@/lib/api/errors";

const SIZE = "سایز";
const COLOR = "رنگ";

function randomPart() {
  return Math.random().toString(36).slice(2, 7);
}

// فرم مشترک «افزودن محصول» و «ویرایش محصول». اگر productId بدهید، حالت ویرایش است.
export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const isEdit = !!productId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([
    { id: "v-1", size: "", color: "", stock: "" },
  ]);

  // مقادیری که فرم نمایش نمی‌دهد ولی هنگام ویرایش باید سر جایشان بمانند
  const [slug, setSlug] = useState<string | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    getAdminCategories()
      .then(setCategories)
      .catch((e) => setError(getShopErrorMessage(e)));
  }, []);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    getAdminProduct(productId)
      .then((p) => {
        if (cancelled) return;
        // «قیمت قبل از تخفیف» روی هر واریانت: اگر هست، قیمت اصلی همان است
        const discounted = p.variants.find(
          (v) => v.compareAtPrice != null && v.compareAtPrice > v.price
        );
        setTitle(p.name);
        setCategoryId(String(p.categoryId));
        setPrice(String(discounted?.compareAtPrice ?? p.basePrice));
        setDiscountPrice(discounted ? String(discounted.price) : "");
        setDescription(p.description ?? "");
        setSlug(p.slug);
        setBrandId(p.brandId ?? null);
        setImages(p.imageUrls.map((url) => ({ id: url, previewUrl: url, url })));
        setVariants(
          p.variants.length > 0
            ? p.variants.map((v) => {
                const { [SIZE]: size = "", [COLOR]: color = "", ...extra } = v.attributes ?? {};
                return {
                  id: v.id,
                  sku: v.sku,
                  size,
                  color,
                  stock: String(v.stockQuantity),
                  extra,
                };
              })
            : [{ id: "v-1", size: "", color: "", stock: "" }]
        );
      })
      .catch((e) => {
        if (!cancelled) setError(getShopErrorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const basePrice = Number(price);
    const discount = discountPrice.trim() ? Number(discountPrice) : null;

    if (!categoryId) return setError("دسته‌بندی را انتخاب کن.");
    if (!(basePrice > 0)) return setError("قیمت باید بیشتر از صفر باشد.");
    if (discount !== null && !(discount > 0 && discount < basePrice)) {
      return setError("قیمت با تخفیف باید کمتر از قیمت اصلی باشد.");
    }
    if (variants.length === 0) return setError("حداقل یک ردیف سایز/رنگ لازم است.");
    for (const v of variants) {
      const stock = Number(v.stock);
      if (v.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) {
        return setError("موجودی هر ردیف باید یک عدد صحیح (۰ یا بیشتر) باشد.");
      }
    }

    setSubmitting(true);
    try {
      // ۱) عکس‌های تازه را آپلود کن؛ عکس‌های قدیمی همان آدرس خودشان را دارند (ترتیب حفظ می‌شود)
      const imageUrls: string[] = [];
      for (const img of images) {
        imageUrls.push(img.url ?? (img.file ? await uploadImage(img.file) : img.previewUrl));
      }

      // ۲) خود محصول
      await saveProduct({
        id: productId,
        categoryId: Number(categoryId),
        brandId,
        name: title.trim(),
        slug: slug ?? `p-${Date.now().toString(36)}${randomPart()}`,
        description: description.trim() || undefined,
        basePrice,
        isFeatured,
        imageUrls,
        variants: variants.map((v, i) => {
          const attributes: Record<string, string> = { ...(v.extra ?? {}) };
          if (v.size.trim()) attributes[SIZE] = v.size.trim();
          if (v.color.trim()) attributes[COLOR] = v.color.trim();
          return {
            sku: v.sku ?? `SKU-${Date.now().toString(36).toUpperCase()}-${i + 1}${randomPart().toUpperCase()}`,
            price: discount ?? basePrice,
            compareAtPrice: discount !== null ? basePrice : null,
            stockQuantity: Number(v.stock),
            attributes,
          };
        }),
      });

      router.push("/admin/products");
    } catch (err) {
      setError(getShopErrorMessage(err));
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!productId) return;
    setShowDeleteDialog(false);
    try {
      await deleteProduct(productId);
      router.push("/admin/products");
    } catch (err) {
      setError(getShopErrorMessage(err));
    }
  }

  if (loading) {
    return <p className="text-body text-ink-muted">در حال بارگذاری محصول...</p>;
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
        <h1 className="text-h1 font-light text-ink">{isEdit ? "ویرایش محصول" : "افزودن محصول جدید"}</h1>
        {isEdit && (
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2 text-small text-rosewood-dark hover:underline"
          >
            <Trash2 size={15} strokeWidth={1.5} />
            حذف این محصول
          </button>
        )}
      </div>
      <p className="text-body text-ink-muted mb-10">
        {isEdit
          ? "تغییرات را اعمال کنید و ذخیره بزنید."
          : "اطلاعات محصول را کامل کنید و تصاویر آن را بارگذاری نمایید."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10 max-w-2xl">
        <div>
          <h2 className="text-body text-ink mb-5">اطلاعات پایه</h2>
          <div className="flex flex-col gap-5">
            <Input id="product-title" label="نام محصول" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <div className="flex flex-col gap-2">
              <label htmlFor="product-category" className="text-small text-ink-muted">
                دسته‌بندی
              </label>
              <select
                id="product-category"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="bg-surface border border-line px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors"
              >
                <option value="">انتخاب کنید</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Input id="product-price" label="قیمت (تومان)" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} required />
              <Input
                id="product-discount-price"
                label="قیمت با تخفیف (اختیاری)"
                type="number"
                min={0}
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="product-description" className="text-small text-ink-muted">
                توضیحات محصول
              </label>
              <textarea
                id="product-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-surface border border-line px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors resize-none"
              />
            </div>

            <label className="flex items-center gap-3 text-body text-ink cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              نمایش در «محصولات ویژه» صفحه‌ی اصلی
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-body text-ink mb-2">تصاویر محصول</h2>
          <p className="text-small text-ink-muted mb-5">
            اولین تصویر به‌عنوان تصویر اصلی محصول نمایش داده می‌شود (JPG، PNG یا WEBP، حداکثر ۵ مگابایت).
          </p>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <div>
          <h2 className="text-body text-ink mb-2">سایز، رنگ و موجودی</h2>
          <p className="text-small text-ink-muted mb-5">
            برای هر ترکیب سایز/رنگ، یک ردیف جداگانه با موجودی مربوطه اضافه کنید.
          </p>
          <VariantManager variants={variants} onChange={setVariants} />
        </div>

        {error && <p className="text-body text-rosewood-dark">{error}</p>}

        <div className="flex items-center gap-4 pt-4 border-t border-line">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "ذخیره محصول"}
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
        description="آیا مطمئن هستید که می‌خواهید این محصول را برای همیشه حذف کنید؟ سفارش‌های قبلی تغییری نمی‌کنند."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
