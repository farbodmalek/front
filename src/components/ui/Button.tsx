"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-ink text-cream hover:bg-rosewood-dark",
  secondary:
    "bg-transparent text-ink border border-ink/70 hover:border-ink hover:bg-ink hover:text-cream",
  ghost:
    "bg-transparent text-ink hover:text-rosewood-dark underline-offset-4 hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-small",
  md: "px-6 py-3 text-body",
  lg: "px-8 py-4 text-body",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        whileHover={disabled ? undefined : { y: -2 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosewood",
          variant === "primary" && "shadow-[0_8px_20px_-8px_rgba(43,38,34,0.35)]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...(props as HTMLMotionProps<"button">)}
      />
    );
  }
);
Button.displayName = "Button";
