"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Category } from "@/features/category/api";
import { deleteCategory, getAdminCategories, saveCategory } from "@/features/admin/api";
import { getShopErrorMessage } from "@/lib/api/errors";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  async function load() {
    try {
      setCategories(await getAdminCategories());
    } catch (e) {
      setError(getShopErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openNew() {
    setEditing(null);
    setName("");
    setSlug("");
    setFormOpen((open) => !open);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await saveCategory(editing ? editing.id : null, {
        name: name.trim(),
        slug: slug.trim() || undefined,
        parentId: editing?.parentId ?? null,
        isActive: editing?.isActive ?? true,
      });
      setFormOpen(false);
      setEditing(null);
      setName("");
      setSlug("");
      await load();
    } catch (err) {
      setError(getShopErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    setError(null);
    try {
      await deleteCategory(target.id);
      await load();
    } catch (err) {
      setError(getShopErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-h1 font-light text-ink mb-2">دسته‌بندی‌ها</h1>
          <p className="text-body text-ink-muted">مدیریت دسته‌بندی محصولات فروشگاه</p>
        </div>
        <Button size="md" onClick={openNew}>
          <Plus size={16} strokeWidth={1.5} className="ml-2" />
          دسته‌بندی جدید
        </Button>
      </div>

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <form onSubmit={handleSave} className="flex items-end gap-4 border border-line p-6">
              <div className="flex-1">
                <Input
                  id="category-name"
                  label="نام دسته‌بندی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً شال و روسری"
                />
              </div>
              <div className="flex-1">
                <Input
                  id="category-slug"
                  label="اسلاگ (اختیاری)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="shawl"
                  dir="ltr"
                />
              </div>
              <Button type="submit" size="md" disabled={saving}>
                {saving ? "..." : editing ? "ذخیره" : "افزودن"}
              </Button>
              <Button type="button" variant="secondary" size="md" onClick={() => setFormOpen(false)}>
                انصراف
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-body text-rosewood-dark mb-6">{error}</p>}

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
                <td className="py-4 px-6 text-ink-muted">{cat.productCount.toLocaleString("fa-IR")}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="ویرایش"
                      onClick={() => openEdit(cat)}
                      className="text-ink-muted hover:text-ink transition-colors"
                    >
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
        {loading && <p className="text-body text-ink-muted text-center py-12">در حال بارگذاری...</p>}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف دسته‌بندی"
        description={`آیا از حذف دسته «${deleteTarget?.name}» مطمئن هستید؟ اگر محصولی داشته باشد حذف نمی‌شود.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
