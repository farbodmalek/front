"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "حذف",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-ink/50" onClick={onCancel} />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm bg-surface p-8 shadow-2xl"
          >
            <div className="w-11 h-11 rounded-full bg-rosewood-light/15 flex items-center justify-center mb-5">
              <AlertTriangle size={20} strokeWidth={1.5} className="text-rosewood-dark" />
            </div>
            <h2 className="text-h2 font-light text-ink mb-2">{title}</h2>
            <p className="text-body text-ink-muted mb-8 leading-7">{description}</p>

            <div className="flex gap-3">
              <Button variant="secondary" size="md" onClick={onCancel} className="flex-1">
                انصراف
              </Button>
              <Button
                size="md"
                onClick={onConfirm}
                className="flex-1 !bg-rosewood-dark hover:!bg-rosewood-dark/90"
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
