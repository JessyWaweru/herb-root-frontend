import type { ReactNode } from 'react';
import clsx from 'clsx';
import type { Crumb } from '../../seo/site';
import { Breadcrumbs } from '../seo/Breadcrumbs';
import { Eyebrow } from '../ui/SectionHeading';
import { Sprig } from '../art/Botanical';

/**
 * The band at the top of a listing or story page: breadcrumbs, eyebrow, the page's h1 and a
 * line of introduction. It slides up behind the see-through header. `title` can hold an <em>.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  description,
  children,
  align = 'left',
}: {
  crumbs?: Crumb[];
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Anything under the introduction: a search box, filter chips, a button. */
  children?: ReactNode;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <section className="bg-botanical relative -mt-[4.5rem] overflow-hidden border-b border-cream-300 pt-[4.5rem]">
      <Sprig className="pointer-events-none absolute -right-6 -top-4 hidden h-80 rotate-[24deg] text-sage-300/60 md:block" leaves={7} />
      {centered && <Sprig className="pointer-events-none absolute -left-8 bottom-[-4rem] hidden h-72 -rotate-[18deg] text-gold-400/50 md:block" />}
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16">
        {crumbs && <Breadcrumbs items={crumbs} className="mb-8" />}
        <div className={clsx('animate-rise', centered ? 'mx-auto flex max-w-3xl flex-col items-center text-center' : 'max-w-3xl')}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1
            className={clsx(
              'text-balance font-display text-4xl leading-[1.03] tracking-[-0.02em] text-sage-900 sm:text-5xl lg:text-6xl [&_em]:accent-italic',
              eyebrow && 'mt-4',
            )}
          >
            {title}
          </h1>
          {description && <div className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-700">{description}</div>}
          {children}
        </div>
      </div>
    </section>
  );
}
