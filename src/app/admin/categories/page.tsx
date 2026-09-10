"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

const initialCategories: Category[] = [
  { id: "c1", name: "لباس مجلسی", slug: "lebas-majlesi", productCount: 24 },
  { id: "c2", name: "لباس زیر", slug: "lebas-zir", productCount: 38 },
  { id: "c3", name: "جوراب", slug: "jorab", productCount: 52 },
  { id: "c4", name: "پوشاک روزمره", slug: "roozmareh", productCount: 31 },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const slug = newName.trim().toLowerCase().replace(/\s+/g, "-");
    setCategories((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, name: newName.trim(), slug, productCount: 0 },
    ]);
    setNewName("");
    setIsAdding(false);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-h1 font-light text-ink mb-2">دسته‌بندی‌ها</h1>
          <p className="text-body text-ink-muted">مدیریت دسته‌بندی محصولات فروشگاه</p>
        </div>
        <Button size="md" onClick={() => setIsAdding((v) => !v)}>
          <Plus size={16} strokeWidth={1.5} className="ml-2" />
          دسته‌بندی جدید
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <form
              onSubmit={handleAddCategory}
              className="flex items-end gap-4 border border-line p-6"
            >
              <div className="flex-1">
                <Input
                  id="new-category-name"
                  label="نام دسته‌بندی"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثلاً شال و روسری"
                />
              </div>
              <Button type="submit" size="md">افزودن</Button>
              <Button type="button" variant="secondary" size="md" onClick={() => setIsAdding(false)}>
                انصراف
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border border-line bg-surface">
        <table className="w-full text-body">
          <thead>
            <tr className="border-b border-line text-small text-ink-muted">
              <th className="text-right py-4 px-6 font-normal">نام دسته‌بندی</th>
              <th className="text-right py-4 px-6 font-normal">اسلاگ (URL)</th>
              <th className="text-right py-4 px-6 font-normal">تعداد محصول</th>
              <th className="text-right py-4 px-6 font-normal">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-line last:border-b-0 hover:bg-cream/50 transition-colors">
                <td className="py-4 px-6 text-ink">{cat.name}</td>
                <td className="py-4 px-6 text-ink-muted" dir="ltr">/{cat.slug}</td>
                <td className="py-4 px-6 text-ink-muted">{cat.productCount}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <button aria-label="ویرایش" className="text-ink-muted hover:text-ink transition-colors">
                      <Pencil size={16} strokeWidth={1.5} />
                    </button>
                    <button
                      aria-label="حذف"
                      onClick={() => setDeleteTarget(cat)}
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
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف دسته‌بندی"
        description={`آیا از حذف دسته «${deleteTarget?.name}» مطمئن هستید؟ محصولات این دسته باید به دسته دیگری منتقل شوند.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
