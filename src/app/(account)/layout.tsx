import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      {/* فقط کاربر لاگین‌شده وارد این بخش می‌شود */}
      <AuthGuard>
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12">
            <AccountSidebar />
            <div>{children}</div>
          </div>
        </main>
      </AuthGuard>

      <Footer />
    </>
  );
}
