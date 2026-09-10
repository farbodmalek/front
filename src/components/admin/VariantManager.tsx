"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface VariantRow {
  id: string;
  size: string;
  color: string;
  stock: string;
}

interface VariantManagerProps {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
}

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  function updateRow(id: string, field: keyof VariantRow, value: string) {
    onChange(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  }

  function addRow() {
    onChange([
      ...variants,
      { id: `v-${Date.now()}`, size: "", color: "", stock: "" },
    ]);
  }

  function removeRow(id: string) {
    onChange(variants.filter((v) => v.id !== id));
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {variants.map((row) => (
          <div key={row.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
            <Input
              id={`size-${row.id}`}
              label="سایز"
              value={row.size}
              onChange={(e) => updateRow(row.id, "size", e.target.value)}
              placeholder="مثلاً 38"
            />
            <Input
              id={`color-${row.id}`}
              label="رنگ"
              value={row.color}
              onChange={(e) => updateRow(row.id, "color", e.target.value)}
              placeholder="مثلاً مشکی"
            />
            <Input
              id={`stock-${row.id}`}
              label="موجودی"
              type="number"
              value={row.stock}
              onChange={(e) => updateRow(row.id, "stock", e.target.value)}
              placeholder="0"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              aria-label="حذف واریانت"
              className="h-14 w-11 flex items-center justify-center text-ink-muted hover:text-rosewood-dark transition-colors flex-shrink-0"
            >
              <Trash2 size={18} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={addRow}
        className="mt-4"
      >
        <Plus size={16} strokeWidth={1.5} className="ml-2" />
        افزودن واریانت (سایز/رنگ)
      </Button>
    </div>
  );
}
