"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Phone, Lock, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "../store";
import { login } from "../api/login";

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره موبایل را وارد کنید")
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const fieldVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    setLoading(true);
    try {
      const { user } = await login(values);
      setUser(user);
      router.push("/");
    } catch {
      setServerError("شماره موبایل یا رمز عبور اشتباه است");
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
        transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
      >
        <motion.div variants={fieldVariants} transition={{ duration: 0.4 }}>
          <Input
            id="phone"
            label="شماره موبایل"
            type="tel"
            inputMode="numeric"
            icon={<Phone size={18} strokeWidth={1.5} />}
            error={errors.phone?.message}
            {...register("phone")}
          />
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.4 }}>
          <Input
            id="password"
            label="رمز عبور"
            type="password"
            icon={<Lock size={18} strokeWidth={1.5} />}
            error={errors.password?.message}
            {...register("password")}
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

        <motion.div
          variants={fieldVariants}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between text-small"
        >
          <Link href="/forgot-password" className="text-ink-muted hover:text-ink transition-colors">
            فراموشی رمز عبور
          </Link>
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.4 }}>
          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? "در حال ورود..." : "ورود"}
          </Button>
        </motion.div>

        <motion.div
          variants={fieldVariants}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <span className="h-px flex-1 bg-line" />
          <span className="text-small text-ink-muted">یا</span>
          <span className="h-px flex-1 bg-line" />
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.4 }}>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full gap-2"
          >
            <MessageSquare size={18} strokeWidth={1.5} />
            ورود سریع با کد پیامکی
          </Button>
        </motion.div>

        <motion.p
          variants={fieldVariants}
          transition={{ duration: 0.4 }}
          className="text-body text-ink-muted text-center"
        >
          حساب کاربری ندارید؟{" "}
          <Link href="/register" className="text-ink hover:text-rosewood-dark transition-colors">
            ثبت‌نام کنید
          </Link>
        </motion.p>
      </motion.form>
    </motion.div>
  );
}
