import type { ReactNode } from 'react';
import { Sprig } from '../art/Botanical';

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
    <div className="relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[2rem] border border-cream-300 bg-cream-50/70 px-6 py-16 text-center shadow-soft">
      <Sprig className="pointer-events-none absolute -left-6 bottom-0 h-44 -rotate-12 text-sage-300/60" />
      <Sprig className="pointer-events-none absolute -right-4 top-2 h-36 rotate-[160deg] text-gold-400/50" leaves={5} />
      <span
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-sage-100 text-4xl ring-8 ring-sage-50"
        aria-hidden="true"
      >
        {icon}
      </span>
      <Heading className="relative mt-2 font-display text-2xl text-sage-900">{title}</Heading>
      {description && <p className="relative max-w-sm text-sm leading-relaxed text-ink-600">{description}</p>}
      {action && <div className="relative mt-3">{action}</div>}
    </div>
  );
}
