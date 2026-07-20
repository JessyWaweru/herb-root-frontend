import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBasket } from 'lucide-react';
import clsx from 'clsx';
import type { ProductSummary } from '../../types';
import { formatPrice } from '../../lib/format';
import { StarRating } from '../ui/StarRating';
import { useAddToCart } from '../../hooks/useCart';
import { useToggleWishlist } from '../../hooks/useWishlist';

export function ProductCard({ product }: { product: ProductSummary }) {
  const addToCart = useAddToCart();
  const { isWishlisted, toggle } = useToggleWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-cream-50 shadow-soft"
    >
      <button
        onClick={() => toggle(product.id)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        className={clsx(
          'absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition',
          wishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-ink-700 hover:bg-white',
        )}
      >
        <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
      </button>

      <Link to={`/shop/${product.slug}`} className="block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-sage-50">
          <img
            src={product.primary_image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">
            {product.category.name}
          </span>
        )}
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-display text-lg leading-snug text-sage-900 hover:text-sage-700">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-ink-600">{product.short_description}</p>

        {product.symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.symptoms.slice(0, 2).map((s) => (
              <span key={s.id} className="rounded-full bg-sage-50 px-2 py-0.5 text-xs text-sage-700">
                {s.icon} {s.name}
              </span>
            ))}
          </div>
        )}

        {product.review_count > 0 && (
          <StarRating value={parseFloat(product.average_rating)} count={product.review_count} size={13} />
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-sage-900">{formatPrice(product.price, product.currency)}</span>
            {product.compare_at_price && (
              <span className="text-xs text-ink-600/60 line-through">
                {formatPrice(product.compare_at_price, product.currency)}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart.mutate({ productId: product.id })}
            disabled={!product.is_in_stock || addToCart.isPending}
            aria-label="Add to basket"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600 text-cream-50 transition hover:bg-sage-700 disabled:opacity-40"
          >
            <ShoppingBasket size={16} />
          </button>
        </div>
        {!product.is_in_stock && <span className="text-xs font-medium text-rose-600">Out of stock</span>}
      </div>
    </motion.div>
  );
}
