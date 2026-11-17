import { m } from 'framer-motion';
import clsx from 'clsx';
import type { ProductSummary } from '../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../ui/EmptyState';

/** headingLevel: 2 when the grid sits right under the page's h1, 3 under a section's h2.
 * animated: cards rise into view one after another as the grid scrolls in. */
export function ProductGrid({
  products,
  headingLevel = 3,
  animated = false,
  className = 'lg:grid-cols-3 xl:grid-cols-4',
}: {
  products: ProductSummary[];
  headingLevel?: 2 | 3;
  animated?: boolean;
  /** Column counts from the lg breakpoint up; narrower beside a sidebar. */
  className?: string;
}) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No remedies found"
        description="Try a different symptom, ingredient, or search term."
      />
    );
  }

  return (
    <div className={clsx('grid grid-cols-2 gap-3 sm:gap-6', className)}>
      {products.map((product, i) =>
        animated ? (
          <m.div
            key={product.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="grid"
          >
            <ProductCard product={product} headingLevel={headingLevel} />
          </m.div>
        ) : (
          <ProductCard key={product.id} product={product} headingLevel={headingLevel} />
        ),
      )}
    </div>
  );
}
