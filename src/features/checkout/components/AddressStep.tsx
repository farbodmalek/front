"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { RadioCard } from "@/components/ui/RadioCard";
import { Input } from "@/components/ui/Input";

const savedAddresses = [
  {
    id: "addr1",
    title: "منزل — تهران، ونک",
    description: "خیابان ولیعصر، پلاک ۱۲، واحد ۳",
  },
  {
    id: "addr2",
    title: "محل کار — تهران، سعادت‌آباد",
    description: "بلوار سعادت‌آباد، برج نگین، طبقه ۵",
  },
];

interface AddressStepProps {
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
}

export function AddressStep({ selectedAddressId, onSelectAddress }: AddressStepProps) {
  const [addingNew, setAddingNew] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {savedAddresses.map((addr) => (
        <RadioCard
          key={addr.id}
          selected={selectedAddressId === addr.id}
          onSelect={() => {
            onSelectAddress(addr.id);
            setAddingNew(false);
          }}
          title={addr.title}
          description={addr.description}
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
              <Input id="new-fullname" label="نام گیرنده" />
              <Input id="new-phone" label="شماره موبایل" type="tel" />
              <Input id="new-city" label="شهر" />
              <Input id="new-postal" label="کد پستی" />
              <div className="md:col-span-2">
                <Input id="new-address" label="آدرس کامل" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
