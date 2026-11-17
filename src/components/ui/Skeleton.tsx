import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={clsx('skeleton block', className)} />;
}

function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-3 p-3.5 sm:p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-11 w-11 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Stands in for a product grid while it loads, so the page doesn't jump when the products arrive. */
export function ProductGridSkeleton({ count = 4, className = 'lg:grid-cols-3 xl:grid-cols-4' }: { count?: number; className?: string }) {
  return (
    <div role="status" aria-label="Loading remedies" className={clsx('grid grid-cols-2 gap-3 sm:gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Stands in for the grid of concern tiles while it loads. */
export function ConcernGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div role="status" aria-label="Loading concerns" className={clsx('grid grid-cols-2 gap-4 lg:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-36 rounded-[1.75rem]" />
      ))}
    </div>
  );
}
