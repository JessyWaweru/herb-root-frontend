import clsx from 'clsx';

/** The mark's gold dot circling a green ring. */
export function Spinner({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={clsx('flex items-center justify-center py-12', className)}>
      <span className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full border-2 border-sage-200" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-sage-700 [animation-duration:0.9s]" />
        <span className="absolute inset-0 animate-spin [animation-duration:0.9s]">
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500" />
        </span>
      </span>
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
