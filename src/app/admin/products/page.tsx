"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatPrice } from "@/lib/utils/format";

interface AdminProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
}

const initialProducts: AdminProduct[] = [
  { id: "p1", title: "پیراهن مجلسی حریر", category: "لباس مجلسی", price: 1490000, stock: 12 },
  { id: "p2", title: "جوراب ساق‌بلند نخی", category: "جوراب", price: 120000, stock: 84 },
  { id: "p3", title: "ست لباس زیر دنتلا", category: "لباس زیر", price: 640000, stock: 0 },
  { id: "p4", title: "تونیک روزمره کتان", category: "پوشاک روزمره", price: 590000, stock: 23 },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
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

      <div className="border border-line bg-surface">
        <table className="w-full text-body">
          <thead>
            <tr className="border-b border-line text-small text-ink-muted">
              <th className="text-right py-4 px-6 font-normal">محصول</th>
              <th className="text-right py-4 px-6 font-normal">دسته‌بندی</th>
              <th className="text-right py-4 px-6 font-normal">قیمت</th>
              <th className="text-right py-4 px-6 font-normal">موجودی</th>
              <th className="text-right py-4 px-6 font-normal">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line last:border-b-0 hover:bg-cream/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-line/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-ink-muted">تصویر</span>
                    </div>
                    <span className="text-ink">{product.title}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-ink-muted">{product.category}</td>
                <td className="py-4 px-6 text-ink">{formatPrice(product.price)}</td>
                <td className="py-4 px-6">
                  {product.stock === 0 ? (
                    <span className="text-rosewood-dark text-small">ناموجود</span>
                  ) : (
                    <span className="text-ink">{product.stock}</span>
                  )}
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

        {products.length === 0 && (
          <p className="text-body text-ink-muted text-center py-12">محصولی وجود ندارد.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف محصول"
        description={`آیا از حذف «${deleteTarget?.title}» مطمئن هستید؟ این عمل قابل بازگشت نیست.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
