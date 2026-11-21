export function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR") + " تومان";
}

// تاریخ شمسی از رشته‌ی ISO (مثلاً ۱۴۰۵/۰۸/۳۰). سرور تاریخ‌ها را UTC می‌فرستد.
export function formatDate(iso: string): string {
  const value = iso.endsWith("Z") || /[+-]\d\d:\d\d$/.test(iso) ? iso : iso + "Z";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
