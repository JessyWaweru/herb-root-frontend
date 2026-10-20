import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { concernPath } from '../../seo/site';
import type { Symptom } from '../../types';

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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(index, 12) * 0.04 }}
    >
      <Link
        to={concernPath(concern.slug)}
        className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-cream-300 bg-cream-50 px-3 py-6 text-center shadow-soft transition hover:-translate-y-1 hover:border-sage-300 hover:shadow-lift"
      >
        <span className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" aria-hidden="true">
          {concern.icon || '🌿'}
        </span>
        <span className="text-sm font-semibold text-sage-900">{concern.name}</span>
        {showDescription && concern.description && <span className="text-xs text-ink-600">{concern.description}</span>}
        <span className="mt-auto text-xs font-medium text-sage-600">
          {concern.product_count} {concern.product_count === 1 ? 'remedy' : 'remedies'}
        </span>
      </Link>
    </m.div>
  );
}
