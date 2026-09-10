"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Address {
  id: string;
  title: string;
  detail: string;
}

const initialAddresses: Address[] = [
  { id: "addr1", title: "منزل — تهران، ونک", detail: "خیابان ولیعصر، پلاک ۱۲، واحد ۳" },
  { id: "addr2", title: "محل کار — تهران، سعادت‌آباد", detail: "بلوار سعادت‌آباد، برج نگین، طبقه ۵" },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [addingNew, setAddingNew] = useState(false);

  function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-h1 font-light text-ink">آدرس‌های من</h1>
        <Button variant="secondary" size="sm" onClick={() => setAddingNew((v) => !v)}>
          <Plus size={16} strokeWidth={1.5} className="ml-2" />
          آدرس جدید
        </Button>
      </div>

      <AnimatePresence>
        {addingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden mb-8"
          >
            <div className="border border-line p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Input id="addr-title" label="عنوان آدرس (مثلاً منزل)" />
                <Input id="addr-phone" label="شماره موبایل" type="tel" />
                <Input id="addr-city" label="شهر" />
                <Input id="addr-postal" label="کد پستی" />
                <div className="md:col-span-2">
                  <Input id="addr-full" label="آدرس کامل" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="md" onClick={() => setAddingNew(false)}>ذخیره آدرس</Button>
                <Button size="md" variant="secondary" onClick={() => setAddingNew(false)}>
                  انصراف
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <p className="text-body text-ink">{addr.title}</p>
                <p className="text-small text-ink-muted mt-1">{addr.detail}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  aria-label="ویرایش"
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

        {addresses.length === 0 && (
          <p className="text-body text-ink-muted">هنوز آدرسی ثبت نکرده‌اید.</p>
        )}
      </div>
    </div>
  );
}
