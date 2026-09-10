import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Skeleton className="h-9 w-40 mb-3" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12">
          <div className="hidden md:flex flex-col gap-10">
            <div>
              <Skeleton className="h-5 w-24 mb-4" />
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-32" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-16 mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-10 h-10" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[3/4] mb-3" />
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
