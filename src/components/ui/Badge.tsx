import { cn } from "@/lib/utils/cn";

type BadgeVariant = "processing" | "shipped" | "delivered" | "cancelled";

const variantStyles: Record<BadgeVariant, string> = {
  processing: "bg-rosewood-light/20 text-rosewood-dark",
  shipped: "bg-line/60 text-ink",
  delivered: "bg-sage/15 text-sage",
  cancelled: "bg-rosewood-dark/10 text-rosewood-dark",
};

const variantLabels: Record<BadgeVariant, string> = {
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

export function Badge({ variant }: { variant: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-block text-small px-3 py-1",
        variantStyles[variant]
      )}
    >
      {variantLabels[variant]}
    </span>
  );
}
