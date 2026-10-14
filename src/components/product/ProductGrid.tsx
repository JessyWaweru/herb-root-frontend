import type { ProductSummary } from '../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../ui/EmptyState';

/** headingLevel: 2 when the grid sits right under the page's h1, 3 under a section's h2. */
export function ProductGrid({ products, headingLevel = 3 }: { products: ProductSummary[]; headingLevel?: 2 | 3 }) {
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
