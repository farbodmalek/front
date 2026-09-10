"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface CheckoutStep {
  id: string;
  label: string;
}

interface CheckoutStepperProps {
  steps: CheckoutStep[];
  currentIndex: number;
}

export function CheckoutStepper({ steps, currentIndex }: CheckoutStepperProps) {
  const progressPercent =
    steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative mb-16">
      {/* خط پس‌زمینه */}
      <div className="absolute top-4 right-0 left-0 h-px bg-line" />
      {/* خط پیشرفت متحرک */}
      <motion.div
        className="absolute top-4 right-0 h-px bg-rosewood-dark"
        initial={false}
        animate={{ width: `${progressPercent}%` }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? "#2B2622" : "#FAF8F6",
                  borderColor: isCompleted || isActive ? "#2B2622" : "#E7E1DA",
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full border flex items-center justify-center z-10"
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={2} className="text-cream" />
                ) : (
                  <span
                    className={cn(
                      "text-small",
                      isActive ? "text-cream" : "text-ink-muted"
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={cn(
                  "text-small whitespace-nowrap",
                  isActive || isCompleted ? "text-ink" : "text-ink-muted"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
