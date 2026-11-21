"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Address,
  addressSummary,
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "@/features/address/api";
import { getShopErrorMessage } from "@/lib/api/errors";

const emptyForm = { title: "", recipientName: "", phoneNumber: "", city: "", postalCode: "", detail: "" };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAddresses()
      .then(setAddresses)
      .catch((e) => setError(getShopErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  function setField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen((open) => !open);
  }

  function openEdit(addr: Address) {
    setEditingId(addr.id);
    setForm({
      title: addr.title,
      recipientName: addr.recipientName ?? "",
      phoneNumber: addr.phoneNumber ?? "",
      city: addr.city ?? "",
      postalCode: addr.postalCode ?? "",
      detail: addr.detail,
    });
    setFormOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const input = {
      title: form.title.trim() || (form.city.trim() ? `آدرس — ${form.city.trim()}` : "آدرس جدید"),
      recipientName: form.recipientName.trim() || undefined,
      phoneNumber: form.phoneNumber.trim() || undefined,
      city: form.city.trim() || undefined,
      postalCode: form.postalCode.trim() || undefined,
      detail: form.detail.trim(),
    };
    try {
      setAddresses(editingId ? await updateAddress(editingId, input) : await createAddress(input));
      setFormOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (e) {
      setError(getShopErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    try {
      setAddresses(await deleteAddress(id));
    } catch (e) {
      setError(getShopErrorMessage(e));
    }
  }

  async function handleMakeDefault(addr: Address) {
    setError(null);
    try {
      setAddresses(
        await updateAddress(addr.id, {
          title: addr.title,
          recipientName: addr.recipientName ?? undefined,
          phoneNumber: addr.phoneNumber ?? undefined,
          city: addr.city ?? undefined,
          postalCode: addr.postalCode ?? undefined,
          detail: addr.detail,
          isDefault: true,
        })
      );
    } catch (e) {
      setError(getShopErrorMessage(e));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-h1 font-light text-ink">آدرس‌های من</h1>
        <Button variant="secondary" size="sm" onClick={openNew}>
          <Plus size={16} strokeWidth={1.5} className="ml-2" />
          آدرس جدید
        </Button>
      </div>

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden mb-8"
          >
            <div className="border border-line p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Input id="addr-title" label="عنوان آدرس (مثلاً منزل)" value={form.title} onChange={(e) => setField("title", e.target.value)} />
                <Input id="addr-name" label="نام گیرنده" value={form.recipientName} onChange={(e) => setField("recipientName", e.target.value)} />
                <Input id="addr-phone" label="شماره موبایل" type="tel" value={form.phoneNumber} onChange={(e) => setField("phoneNumber", e.target.value)} />
                <Input id="addr-city" label="شهر" value={form.city} onChange={(e) => setField("city", e.target.value)} />
                <Input id="addr-postal" label="کد پستی" value={form.postalCode} onChange={(e) => setField("postalCode", e.target.value)} />
                <div className="md:col-span-2">
                  <Input id="addr-full" label="آدرس کامل" value={form.detail} onChange={(e) => setField("detail", e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="md" disabled={saving || !form.detail.trim()} onClick={handleSave}>
                  {saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "ذخیره آدرس"}
                </Button>
                <Button size="md" variant="secondary" onClick={() => setFormOpen(false)}>
                  انصراف
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-body text-rosewood-dark mb-6">{error}</p>}

      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between gap-4 border border-line px-6 py-5"
            >
              <div>
                <p className="text-body text-ink">
                  {addr.title}
                  {addr.isDefault && (
                    <span className="mr-3 text-small bg-sage/15 text-sage px-2 py-0.5">پیش‌فرض</span>
                  )}
                </p>
                <p className="text-small text-ink-muted mt-1">{addressSummary(addr)}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleMakeDefault(addr)}
                    className="text-small text-ink-muted hover:text-ink transition-colors"
                  >
                    پیش‌فرض کن
                  </button>
                )}
                <button
                  aria-label="ویرایش"
                  onClick={() => openEdit(addr)}
                  className="text-ink-muted hover:text-ink transition-colors"
                >
                  <Pencil size={17} strokeWidth={1.5} />
                </button>
                <button
                  aria-label="حذف"
                  onClick={() => handleDelete(addr.id)}
                  className="text-ink-muted hover:text-rosewood-dark transition-colors"
                >
                  <Trash2 size={17} strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && <p className="text-body text-ink-muted">در حال بارگذاری...</p>}
        {!loading && addresses.length === 0 && !error && (
          <p className="text-body text-ink-muted">هنوز آدرسی ثبت نکرده‌اید.</p>
        )}
      </div>
    </div>
  );
}
