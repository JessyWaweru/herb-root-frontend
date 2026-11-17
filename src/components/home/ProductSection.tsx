import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ProductSummary } from '../../types';
import { ProductGrid } from '../product/ProductGrid';
import { ProductGridSkeleton } from '../ui/Skeleton';
import { SectionHeading } from '../ui/SectionHeading';

export function ProductSection({
  eyebrow,
  title,
  subtitle,
  products,
  isLoading,
  viewAllHref,
}: {
  eyebrow: string;
  /** May hold an <em> for the italic accent word. */
  title: ReactNode;
  subtitle?: string;
  products?: ProductSummary[];
  isLoading: boolean;
  viewAllHref: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={subtitle}
        action={
          <Link to={viewAllHref} className="group inline-flex items-center gap-3 text-sm font-semibold text-sage-900">
            <span className="link-sweep">View all</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-800/25 transition-colors duration-200 group-hover:border-sage-800 group-hover:bg-sage-800 group-hover:text-cream-50">
              <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        }
      />

      {isLoading ? <ProductGridSkeleton /> : <ProductGrid products={products ?? []} animated />}
    </section>
  );
}
