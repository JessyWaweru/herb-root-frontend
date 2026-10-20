import type { ReactNode } from 'react';

export function EmptyState({
  icon = '🌿',
  title,
  description,
  action,
  headingLevel = 2,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  /** 1 when the empty state is the whole page, so the page still has a main heading. */
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-sage-300 bg-sage-50/50 px-6 py-16 text-center">
      <span className="text-4xl" aria-hidden="true">{icon}</span>
      <Heading className="font-display text-xl text-sage-900">{title}</Heading>
      {description && <p className="max-w-sm text-sm text-ink-600">{description}</p>}
      {action}
    </div>
  );
}
