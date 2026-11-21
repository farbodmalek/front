import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // فقط کاربری که isAdmin باشد وارد پنل مدیریت می‌شود
    <AuthGuard requireAdmin>
      <div className="flex min-h-screen bg-cream">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10 max-w-5xl">{children}</main>
      </div>
    </AuthGuard>
  );
}
