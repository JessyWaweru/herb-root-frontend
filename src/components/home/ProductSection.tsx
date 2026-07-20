import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ProductSummary } from '../../types';
import { ProductGrid } from '../product/ProductGrid';
import { Spinner } from '../ui/Spinner';

export function ProductSection({
  eyebrow,
  title,
  subtitle,
  products,
  isLoading,
  viewAllHref,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  products?: ProductSummary[];
  isLoading: boolean;
  viewAllHref: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">{eyebrow}</span>
          <h2 className="mt-2 font-display text-3xl text-sage-900">{title}</h2>
          {subtitle && <p className="mt-2 max-w-md text-sm text-ink-600">{subtitle}</p>}
        </div>
        <Link
          to={viewAllHref}
          className="flex items-center gap-1.5 text-sm font-semibold text-sage-700 hover:text-sage-900"
        >
          View all <ArrowRight size={15} />
        </Link>
      </div>

      {isLoading ? <Spinner /> : <ProductGrid products={products ?? []} />}
    </section>
  );
}
