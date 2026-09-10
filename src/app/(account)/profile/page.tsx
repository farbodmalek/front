"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/features/auth/store";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [saved, setSaved] = useState(false);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    // TODO: اتصال به API ویرایش پروفایل
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-h1 font-light text-ink mb-8">پروفایل</h1>

      {/* دسترسی سریع به سفارش‌ها */}
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Link
          href="/orders"
          className="flex items-center justify-between gap-4 border border-line px-6 py-5 mb-12 shadow-sm hover:shadow-md hover:border-ink transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-rosewood-light/15 flex items-center justify-center flex-shrink-0">
              <Package size={20} strokeWidth={1.5} className="text-rosewood-dark" />
            </div>
            <div>
              <p className="text-body text-ink">سفارش‌های من</p>
              <p className="text-small text-ink-muted mt-1">
                مشاهده وضعیت و تاریخچه سفارش‌ها
              </p>
            </div>
          </div>
          <ChevronLeft
            size={18}
            strokeWidth={1.5}
            className="text-ink-muted group-hover:text-ink group-hover:-translate-x-1 transition-all flex-shrink-0"
          />
        </Link>
      </motion.div>

      <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 mb-14">
        <Input
          id="profile-fullname"
          label="نام و نام‌خانوادگی"
          defaultValue={user?.fullName}
        />
        <Input id="profile-phone" label="شماره موبایل" defaultValue={user?.phone} disabled />
        <Input id="profile-email" label="ایمیل (اختیاری)" type="email" defaultValue={user?.email} />

        <div className="flex items-center gap-4">
          <Button type="submit" size="lg">ذخیره تغییرات</Button>
          {saved && <span className="text-small text-sage">تغییرات ذخیره شد</span>}
        </div>
      </form>

      <div className="border-t border-line pt-10">
        <h2 className="text-h2 font-light text-ink mb-6">تغییر رمز عبور</h2>
        <form className="flex flex-col gap-6">
          <Input id="current-password" label="رمز عبور فعلی" type="password" />
          <Input id="new-password" label="رمز عبور جدید" type="password" />
          <Input id="confirm-new-password" label="تکرار رمز عبور جدید" type="password" />
          <div>
            <Button type="submit" variant="secondary" size="lg">
              تغییر رمز عبور
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
