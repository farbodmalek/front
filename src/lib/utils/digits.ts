// اعداد فارسی (۰۱۲۳) و عربی (٠١٢٣) را به انگلیسی (0123) تبدیل می‌کند
// تا کاربر بتواند شماره موبایل را با هر کیبوردی بنویسد.
export function toEnglishDigits(value: string): string {
  return value
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}
