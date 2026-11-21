import axios from "axios";

// هر خطای axios را به یک پیام فارسی قابل‌نمایش تبدیل می‌کند
export function getApiErrorMessage(
  error: unknown,
  fallback = "مشکلی پیش آمد. لطفاً دوباره تلاش کنید."
): string {
  if (!axios.isAxiosError(error)) return fallback;

  // سرور اصلاً جواب نداده (خاموش است، یا آدرس/CORS اشتباه است)
  if (!error.response) {
    return "ارتباط با سرور برقرار نشد. مطمئن شو سرویس Auth روشن است.";
  }

  const { status, data } = error.response;

  if (status === 429) {
    return "تعداد تلاش‌ها زیاد است. یک دقیقه صبر کنید و دوباره امتحان کنید.";
  }

  // خطاهای ما: { "message": "..." }
  if (data && typeof data.message === "string") {
    return data.message;
  }

  // خطای اعتبارسنجی ASP.NET: { errors: { Field: ["پیام"] } }
  if (data && data.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors as Record<string, string[]>)[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
  }

  return fallback;
}

// پیام خطا برای فراخوانی‌های سرویس اصلی فروشگاه (محصولات و ...)
export function getShopErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && !error.response) {
    return "ارتباط با سرور فروشگاه برقرار نشد. مطمئن شو سرویس محصولات (پورت 5107) روشن است.";
  }
  return getApiErrorMessage(error, "دریافت اطلاعات محصولات با خطا مواجه شد.");
}
