// فقط مسیرهای داخل خود سایت (مثل /checkout) مجاز است؛
// جلوی redirect به سایت دیگر (مثل //evil.com) را می‌گیرد.
export function getSafeRedirect(value: string | null): string | null {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return null;
}
