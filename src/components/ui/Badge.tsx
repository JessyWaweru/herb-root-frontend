import type { ReactNode } from 'react';
import clsx from 'clsx';

const toneClasses = {
  sage: 'bg-sage-100 text-sage-800',
  gold: 'bg-gold-300/60 text-gold-600',
  rose: 'bg-rose-300/50 text-rose-600',
  cream: 'bg-cream-200 text-ink-700',
} as const;

export function Badge({
  children,
  tone = 'sage',
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
