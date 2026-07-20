import clsx from 'clsx';

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center justify-center py-12', className)}>
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-sage-300 border-t-sage-700" />
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
