"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Phone, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "../store";
import { register as registerUser } from "../api/register";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getSafeRedirect } from "../utils";
import { toEnglishDigits } from "@/lib/utils/digits";

const registerSchema = z
  .object({
    fullName: z.string().min(3, "نام و نام‌خانوادگی را کامل وارد کنید"),
    phone: z
      .string()
      .min(1, "شماره موبایل را وارد کنید")
      .transform(toEnglishDigits)
      .refine((value) => /^09\d{9}$/.test(value), "شماره موبایل معتبر نیست"),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const fieldVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    setLoading(true);
    try {
      const session = await registerUser({
        fullName: values.fullName,
        phone: values.phone,
        password: values.password,
      });
      setSession(session);

      const redirect = getSafeRedirect(searchParams.get("redirect"));
      router.replace(redirect ?? "/");
    } catch (error) {
      setServerError(getApiErrorMessage(error, "مشکلی در ثبت‌نام پیش آمد. دوباره تلاش کنید."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-surface border border-line/70 shadow-[0_25px_70px_-20px_rgba(43,38,34,0.18)] p-8 md:p-10"
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.07, delayChildren: 0.1 }}
      >
        <motion.div variants={fieldVariants} transition={{ duration: 0.4 }}>
          <Input
            id="fullName"
            label="نام و نام‌خانوادگی"
            type="text"
            icon={<User size={18} strokeWidth={1.5} />}
            error={errors.fullName?.message}
            {...registerField("fullName")}
          />
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.4 }}>
          <Input
            id="phone"
            label="شماره موبایل"
            type="tel"
            inputMode="numeric"
            icon={<Phone size={18} strokeWidth={1.5} />}
            error={errors.phone?.message}
            {...registerField("phone")}
          />
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.4 }}>
          <Input
            id="password"
            label="رمز عبور"
            type="password"
            icon={<Lock size={18} strokeWidth={1.5} />}
            error={errors.password?.message}
            {...registerField("password")}
          />
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.4 }}>
          <Input
            id="confirmPassword"
            label="تکرار رمز عبور"
            type="password"
            icon={<Lock size={18} strokeWidth={1.5} />}
            error={errors.confirmPassword?.message}
            {...registerField("confirmPassword")}
          />
        </motion.div>

        {serverError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-small text-rosewood-dark"
          >
            {serverError}
          </motion.p>
        )}

        <motion.p
          variants={fieldVariants}
          transition={{ duration: 0.4 }}
          className="text-small text-ink-muted leading-6"
        >
          با ثبت‌نام، شرایط استفاده و حریم خصوصی فروشگاه را می‌پذیرید.
        </motion.p>

        <motion.div variants={fieldVariants} transition={{ duration: 0.4 }}>
          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? "در حال ثبت‌نام..." : "ایجاد حساب کاربری"}
          </Button>
        </motion.div>

        <motion.p
          variants={fieldVariants}
          transition={{ duration: 0.4 }}
          className="text-body text-ink-muted text-center"
        >
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="text-ink hover:text-rosewood-dark transition-colors">
            وارد شوید
          </Link>
        </motion.p>
      </motion.form>
    </motion.div>
  );
}
