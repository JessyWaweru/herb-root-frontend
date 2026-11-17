import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { concernPath } from '../../seo/site';
import type { Symptom } from '../../types';

// The wash behind each tile's icon cycles through the palette so a grid doesn't read as one flat block.
const WASHES = ['bg-sage-100', 'bg-gold-200', 'bg-rose-100'];

/** A concern tile linking to its page; fades up into view, staggered by `index`. */
export function ConcernCard({
  concern,
  index = 0,
  showDescription = false,
}: {
  concern: Symptom;
  index?: number;
  showDescription?: boolean;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(index, 12) * 0.04 }}
    >
      <Link
        to={concernPath(concern.slug)}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-cream-300 bg-cream-50 p-5 shadow-soft transition duration-300 ease-out hover:-translate-y-1 hover:border-sage-300 hover:shadow-lift"
      >
        <span
          className={clsx(
            'pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full transition-transform duration-500 ease-out group-hover:scale-[1.9]',
            WASHES[index % WASHES.length],
          )}
          aria-hidden="true"
        />
        <span className="relative flex items-start justify-between">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-50 text-3xl shadow-soft ring-1 ring-cream-300 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
            aria-hidden="true"
          >
            {concern.icon || '🌿'}
          </span>
          <ArrowUpRight
            size={18}
            aria-hidden="true"
            className="mt-1 -translate-x-1 translate-y-1 text-sage-800 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
          />
        </span>
        <span className="relative mt-5 font-display text-xl leading-tight text-sage-900">{concern.name}</span>
        {showDescription && concern.description && (
          <span className="relative mt-1.5 text-sm leading-relaxed text-ink-600">{concern.description}</span>
        )}
        <span className="relative mt-auto pt-4 text-xs font-semibold text-ink-600">
          {concern.product_count} {concern.product_count === 1 ? 'remedy' : 'remedies'}
        </span>
      </Link>
    </m.div>
  );
}
