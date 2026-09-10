"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, placeholder, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="relative">
          {icon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted peer-focus:text-ink pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            placeholder={placeholder ?? " "}
            className={cn(
              "peer w-full bg-surface border text-body text-ink placeholder-transparent pt-6 pb-2 transition-all duration-200 focus:outline-none shadow-sm focus:shadow-md",
              icon ? "pr-11 pl-4" : "px-4",
              error
                ? "border-rosewood-dark shadow-rosewood-dark/10"
                : "border-line focus:border-ink shadow-ink/[0.03] focus:shadow-ink/[0.06]",
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "absolute top-4 text-body text-ink-muted origin-right transition-all duration-200 pointer-events-none",
                icon ? "right-11" : "right-4",
                "peer-focus:top-2 peer-focus:text-small peer-focus:text-ink",
                "peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-small"
              )}
            >
              {label}
            </label>
          )}
          <span className="absolute bottom-0 right-0 h-px bg-rosewood-dark scale-x-0 peer-focus:scale-x-100 origin-right transition-transform duration-300 ease-out w-full" />
        </div>
        {error && <span className="text-small text-rosewood-dark">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
