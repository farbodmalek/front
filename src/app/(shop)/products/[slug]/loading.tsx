import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <Skeleton className="h-4 w-48 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-16 h-20" />
              ))}
            </div>
            <Skeleton className="flex-1 aspect-[3/4]" />
          </div>

          <div>
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-9 w-64 mb-6" />
            <Skeleton className="h-7 w-40 mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-10" />

            <Skeleton className="h-4 w-16 mb-3" />
            <div className="flex gap-2 mb-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-10 h-10" />
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
