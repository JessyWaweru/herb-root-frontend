import type { ProductSummary } from '../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../ui/EmptyState';

export function ProductGrid({ products }: { products: ProductSummary[] }) {
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
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
