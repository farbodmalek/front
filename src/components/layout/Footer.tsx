import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      {/* خبرنامه */}
      <div className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-h2 font-light text-ink mb-2">عضو خبرنامه شوید</h3>
            <p className="text-body text-ink-muted">
              از کالکشن‌های جدید و تخفیف‌های ویژه باخبر شوید.
            </p>
          </div>
          <form className="flex w-full md:w-auto gap-3 max-w-sm">
            <Input
              id="newsletter-email"
              type="email"
              placeholder="ایمیل شما"
              className="flex-1"
            />
            <Button type="submit" variant="secondary" className="whitespace-nowrap">
              عضویت
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-h2 font-light text-ink mb-3">sarel</h3>
          <p className="text-body text-ink-muted leading-7">
            پوشاکی برای هر روز و هر مناسبت؛ از جوراب تا لباس مجلسی، با دقت
            انتخاب شده برای شما.
          </p>
        </div>

        <div>
          <h4 className="text-small text-ink-muted mb-4">دسترسی سریع</h4>
          <ul className="flex flex-col gap-3">
            <li><Link href="/products" className="text-body text-ink hover:text-rosewood-dark">همه محصولات</Link></li>
            <li><Link href="/orders" className="text-body text-ink hover:text-rosewood-dark">پیگیری سفارش</Link></li>
            <li><Link href="/about" className="text-body text-ink hover:text-rosewood-dark">درباره ما</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-small text-ink-muted mb-4">ارتباط با ما</h4>
          <p className="text-body text-ink">پشتیبانی: ۰۲۱-۰۰۰۰۰۰۰</p>
          <p className="text-body text-ink mt-2">info@example.com</p>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="text-small text-ink-muted text-center py-6">
          تمام حقوق محفوظ است © sarel
        </p>
      </div>
    </footer>
  );
}
