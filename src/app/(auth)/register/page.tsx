import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <span className="block w-10 h-px bg-rosewood mb-6" />
      <h1 className="text-h1 font-light text-ink mb-2">ساخت حساب کاربری</h1>
      <p className="text-body text-ink-muted mb-10">
        در چند مرحله ساده عضو خانواده ما شوید
      </p>
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
