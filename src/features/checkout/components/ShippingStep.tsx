"use client";

import { RadioCard } from "@/components/ui/RadioCard";
import { formatPrice } from "@/lib/utils/format";

export const shippingMethods = [
  { id: "standard", title: "پست پیشتاز", description: "تحویل ۲ تا ۳ روز کاری", price: 45000 },
  { id: "express", title: "ارسال اکسپرس", description: "تحویل تا ۲۴ ساعت", price: 120000 },
  { id: "pickup", title: "تحویل حضوری از فروشگاه", description: "رایگان", price: 0 },
];

interface ShippingStepProps {
  selectedMethodId: string | null;
  onSelectMethod: (id: string) => void;
}

export function ShippingStep({ selectedMethodId, onSelectMethod }: ShippingStepProps) {
  return (
    <div className="flex flex-col gap-4">
      {shippingMethods.map((method) => (
        <RadioCard
          key={method.id}
          selected={selectedMethodId === method.id}
          onSelect={() => onSelectMethod(method.id)}
          title={method.title}
          description={method.description}
          trailing={method.price === 0 ? "رایگان" : formatPrice(method.price)}
        />
      ))}
    </div>
  );
}
