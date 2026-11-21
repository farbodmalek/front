"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { RadioCard } from "@/components/ui/RadioCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Address, AddressInput, addressSummary } from "@/features/address/api";

interface AddressStepProps {
  addresses: Address[];
  loading: boolean;
  loadError: string | null;
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;
  // آدرس جدید را ذخیره می‌کند؛ پیام خطا یا null برمی‌گرداند
  onCreate: (input: AddressInput) => Promise<string | null>;
}

const emptyForm = { title: "", recipientName: "", phoneNumber: "", city: "", postalCode: "", detail: "" };

export function AddressStep({
  addresses,
  loading,
  loadError,
  selectedAddressId,
  onSelectAddress,
  onCreate,
}: AddressStepProps) {
  const [addingNew, setAddingNew] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const message = await onCreate({
      title: form.title.trim() || (form.city.trim() ? `آدرس — ${form.city.trim()}` : "آدرس جدید"),
      recipientName: form.recipientName.trim() || undefined,
      phoneNumber: form.phoneNumber.trim() || undefined,
      city: form.city.trim() || undefined,
      postalCode: form.postalCode.trim() || undefined,
      detail: form.detail.trim(),
    });
    setSaving(false);
    if (message) {
      setError(message);
      return;
    }
    setForm(emptyForm);
    setAddingNew(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {loading && <p className="text-body text-ink-muted">در حال بارگذاری آدرس‌ها...</p>}
      {loadError && <p className="text-body text-rosewood-dark">{loadError}</p>}

      {addresses.map((addr) => (
        <RadioCard
          key={addr.id}
          selected={selectedAddressId === addr.id}
          onSelect={() => onSelectAddress(addr.id)}
          title={addr.title}
          description={addressSummary(addr)}
        />
      ))}

      <button
        type="button"
        onClick={() => setAddingNew((v) => !v)}
        className="w-full flex items-center gap-3 border border-dashed border-line px-5 py-4 text-body text-ink-muted hover:border-ink hover:text-ink transition-colors"
      >
        <Plus size={18} strokeWidth={1.5} />
        افزودن آدرس جدید
      </button>

      <AnimatePresence>
        {addingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <Input id="new-title" label="عنوان آدرس (مثلاً منزل)" value={form.title} onChange={(e) => setField("title", e.target.value)} />
              <Input id="new-fullname" label="نام گیرنده" value={form.recipientName} onChange={(e) => setField("recipientName", e.target.value)} />
              <Input id="new-phone" label="شماره موبایل" type="tel" value={form.phoneNumber} onChange={(e) => setField("phoneNumber", e.target.value)} />
              <Input id="new-city" label="شهر" value={form.city} onChange={(e) => setField("city", e.target.value)} />
              <Input id="new-postal" label="کد پستی" value={form.postalCode} onChange={(e) => setField("postalCode", e.target.value)} />
              <div className="md:col-span-2">
                <Input id="new-address" label="آدرس کامل" value={form.detail} onChange={(e) => setField("detail", e.target.value)} />
              </div>
            </div>
            {error && <p className="text-small text-rosewood-dark mt-3">{error}</p>}
            <div className="mt-5">
              <Button type="button" size="md" disabled={saving || !form.detail.trim()} onClick={handleSave}>
                {saving ? "در حال ذخیره..." : "ذخیره آدرس"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
