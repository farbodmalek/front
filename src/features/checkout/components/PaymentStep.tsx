"use client";

import { RadioCard } from "@/components/ui/RadioCard";

export const paymentMethods = [
  { id: "online", title: "پرداخت آنلاین", description: "از طریق درگاه بانکی امن" },
  { id: "cod", title: "پرداخت در محل", description: "پرداخت نقدی یا کارت‌خوان هنگام تحویل" },
];

interface PaymentStepProps {
  selectedMethodId: string | null;
  onSelectMethod: (id: string) => void;
}

export function PaymentStep({ selectedMethodId, onSelectMethod }: PaymentStepProps) {
  return (
    <div className="flex flex-col gap-4">
      {paymentMethods.map((method) => (
        <RadioCard
          key={method.id}
          selected={selectedMethodId === method.id}
          onSelect={() => onSelectMethod(method.id)}
          title={method.title}
          description={method.description}
        />
      ))}
    </div>
  );
}
