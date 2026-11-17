import type { ReactNode } from 'react';
import clsx from 'clsx';

const toneClasses = {
  sage: 'bg-sage-100 text-sage-800',
  gold: 'bg-gold-200 text-gold-700',
  rose: 'bg-rose-100 text-rose-700',
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
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
