import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <span className="inline-block w-10 h-px bg-rosewood mb-6" />
        <h1 className="text-h1 font-light text-ink mb-2">خوش آمدید</h1>
        <p className="text-body text-ink-muted">
          برای ادامه خرید وارد حساب کاربری‌تان شوید
        </p>
      </div>
      {/* useSearchParams داخل فرم استفاده شده و در Next.js باید داخل Suspense باشد */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
