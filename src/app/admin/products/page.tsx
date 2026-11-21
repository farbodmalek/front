"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatPrice } from "@/lib/utils/format";
import {
  AdminProductListItem,
  deleteProduct,
  getAdminProducts,
  ProductStatus,
  setProductStatus,
} from "@/features/admin/api";
import { getShopErrorMessage } from "@/lib/api/errors";

const statusLabels: Record<ProductStatus, string> = {
  Published: "منتشر شده",
  Draft: "پیش‌نویس",
  Archived: "بایگانی",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProductListItem | null>(null);

  const load = useCallback(async (term: string) => {
    try {
      const result = await getAdminProducts({ searchTerm: term });
      setProducts(result.items);
      setError(null);
    } catch (e) {
      setError(getShopErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // جست‌وجو با کمی تأخیر، تا با هر حرف یک درخواست نرود
  useEffect(() => {
    const timer = setTimeout(() => void load(search), 300);
    return () => clearTimeout(timer);
  }, [search, load]);

  async function handleStatusChange(product: AdminProductListItem, status: ProductStatus) {
    try {
      await setProductStatus(product.id, status);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, status } : p)));
    } catch (e) {
      setError(getShopErrorMessage(e));
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteProduct(target.id);
      setProducts((prev) => prev.filter((p) => p.id !== target.id));
    } catch (e) {
      setError(getShopErrorMessage(e));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-h1 font-light text-ink mb-2">محصولات</h1>
          <p className="text-body text-ink-muted">مدیریت محصولات فروشگاه</p>
        </div>
        <Link href="/admin/products/new">
          <Button size="md">
            <Plus size={16} strokeWidth={1.5} className="ml-2" />
            افزودن محصول
          </Button>
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جست‌وجوی نام محصول..."
        className="w-full max-w-sm mb-6 bg-surface border border-line px-4 py-3 text-body text-ink focus:outline-none focus:border-ink transition-colors"
      />

      {error && <p className="text-body text-rosewood-dark mb-6">{error}</p>}

      <div className="border border-line bg-surface">
        <table className="w-full text-body">
          <thead>
            <tr className="border-b border-line text-small text-ink-muted">
              <th className="text-right py-4 px-6 font-normal">محصول</th>
              <th className="text-right py-4 px-6 font-normal">دسته‌بندی</th>
              <th className="text-right py-4 px-6 font-normal">قیمت</th>
              <th className="text-right py-4 px-6 font-normal">موجودی</th>
              <th className="text-right py-4 px-6 font-normal">وضعیت</th>
              <th className="text-right py-4 px-6 font-normal">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line last:border-b-0 hover:bg-cream/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-line/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {product.primaryImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-ink-muted">تصویر</span>
                      )}
                    </div>
                    <span className="text-ink">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-ink-muted">{product.categoryName}</td>
                <td className="py-4 px-6 text-ink">{formatPrice(product.basePrice)}</td>
                <td className="py-4 px-6">
                  {product.totalStock === 0 ? (
                    <span className="text-rosewood-dark text-small">ناموجود</span>
                  ) : (
                    <span className="text-ink">{product.totalStock.toLocaleString("fa-IR")}</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <select
                    value={product.status}
                    onChange={(e) => handleStatusChange(product, e.target.value as ProductStatus)}
                    className="text-small border border-line px-2 py-1 bg-surface text-ink-muted focus:outline-none focus:border-ink"
                  >
                    {(Object.keys(statusLabels) as ProductStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      aria-label="ویرایش"
                      className="text-ink-muted hover:text-ink transition-colors"
                    >
                      <Pencil size={16} strokeWidth={1.5} />
                    </Link>
                    <button
                      aria-label="حذف"
                      onClick={() => setDeleteTarget(product)}
                      className="text-ink-muted hover:text-rosewood-dark transition-colors"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <p className="text-body text-ink-muted text-center py-12">در حال بارگذاری...</p>}
        {!loading && products.length === 0 && (
          <p className="text-body text-ink-muted text-center py-12">محصولی وجود ندارد.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف محصول"
        description={`آیا از حذف «${deleteTarget?.name}» مطمئن هستید؟ این عمل قابل بازگشت نیست.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
