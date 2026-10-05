import { Leaf } from 'lucide-react';
import clsx from 'clsx';

export function Logo({
  className,
  tagline = false,
  dark = false,
}: {
  className?: string;
  tagline?: boolean;
  dark?: boolean;
}) {
  const mint = dark ? 'text-sage-200' : 'text-sage-700';
  const ring = dark ? 'border-sage-200' : 'border-sage-700';
  const text = dark ? 'text-cream-50' : 'text-ink-800';

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="flex items-center">
        <span
          className={clsx(
            'flex h-7 w-7 shrink-0 items-center justify-center font-display text-2xl font-bold leading-none',
            mint,
          )}
        >
          G
        </span>
        <span
          className={clsx(
            'relative mx-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2',
            ring,
          )}
        >
          <Leaf size={13} className={mint} />
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-gold-500" />
        </span>
        <span className={clsx('font-display text-base font-semibold leading-none', text)}>herbal</span>
      </div>
      {tagline && (
        <span className={clsx('mt-1 text-[10px] font-semibold uppercase tracking-[0.2em]', mint)}>
          Herbal Wellness
        </span>
      )}
    </div>
  );
}
