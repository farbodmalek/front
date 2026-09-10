import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { PageTransition } from "@/components/layout/PageTransition";
import { QuickViewModal } from "@/features/product/components/QuickViewModal";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "فروشگاه لباس دخترانه",
  description: "فروشگاه آنلاین پوشاک دخترانه و زنانه",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-cream text-ink font-sans antialiased">
        <PageTransition>{children}</PageTransition>
        <QuickViewModal />
      </body>
    </html>
  );
}
