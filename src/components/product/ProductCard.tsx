import { Link } from 'react-router-dom';
import { Heart, ShoppingBasket } from 'lucide-react';
import clsx from 'clsx';
import type { ProductSummary } from '../../types';
import { formatPrice } from '../../lib/format';
import { StarRating } from '../ui/StarRating';
import { ProductImage } from './ProductImage';
import { useAddToCart } from '../../hooks/useCart';
import { useToggleWishlist } from '../../hooks/useWishlist';

/** The label on the photo's corner: only the most useful one is shown. */
function flag(product: ProductSummary) {
  if (!product.is_in_stock) return { label: 'Out of stock', className: 'bg-ink-900/85 text-cream-50' };
  if (product.compare_at_price && Number(product.compare_at_price) > Number(product.price)) {
    const saving = Math.round((1 - Number(product.price) / Number(product.compare_at_price)) * 100);
    if (saving > 0) return { label: `Save ${saving}%`, className: 'bg-rose-600 text-cream-50' };
  }
  if (product.is_bestseller) return { label: 'Bestseller', className: 'bg-gold-500 text-ink-900' };
  return null;
}

export function ProductCard({ product, headingLevel = 3 }: { product: ProductSummary; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const addToCart = useAddToCart();
  const { isWishlisted, toggle } = useToggleWishlist();
  const wishlisted = isWishlisted(product.id);
  const corner = flag(product);
  const href = `/shop/${product.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border sm:rounded-[1.75rem] border-cream-300 bg-cream-50 shadow-soft transition duration-300 ease-out hover:-translate-y-1.5 hover:border-sage-200 hover:shadow-lift">
      <button
        onClick={() => toggle(product.id)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        aria-pressed={Boolean(wishlisted)}
        className={clsx(
          'absolute right-2.5 top-2.5 z-10 flex h-10 w-10 items-center sm:right-3.5 sm:top-3.5 justify-center rounded-full shadow-soft backdrop-blur transition duration-200 hover:scale-110 active:scale-95',
          wishlisted ? 'bg-rose-500 text-cream-50' : 'bg-cream-50/90 text-ink-700 hover:text-rose-600',
        )}
      >
        <Heart size={17} className={wishlisted ? 'fill-current' : ''} />
      </button>

      {corner && (
        <span className={clsx('absolute left-2.5 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-soft sm:left-3.5 sm:top-3.5 sm:px-3 sm:text-[11px]', corner.className)}>
          {corner.label}
        </span>
      )}

      <ProductImage
        src={product.primary_image_url}
        seed={product.id}
        className="aspect-square"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        {product.category && <span className="eyebrow truncate text-[9px] sm:text-[10px]">{product.category.name}</span>}
        <Heading className="mt-1.5 font-display text-[1.05rem] leading-[1.15] text-sage-900 sm:mt-2 sm:text-[1.3rem]">
          {/* The link's hit area is stretched over the whole card; the heart and basket sit above it. */}
          <Link to={href} className="transition-colors after:absolute after:inset-0 hover:text-sage-600">
            {product.name}
          </Link>
        </Heading>
        {/* Phones show two cards a row, so the description and concern chips wait for wider screens. */}
        <p className="mt-2 hidden text-sm leading-relaxed text-ink-600 sm:line-clamp-2">{product.short_description}</p>

        {product.symptoms.length > 0 && (
          <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
            {product.symptoms.slice(0, 2).map((s) => (
              <span key={s.id} className="rounded-full bg-sage-50 px-2.5 py-1 text-[11px] font-semibold text-sage-800 ring-1 ring-sage-100">
                <span aria-hidden="true">{s.icon}</span> {s.name}
              </span>
            ))}
          </div>
        )}

        {product.review_count > 0 && (
          <div className="mt-2 sm:mt-3">
            <StarRating value={parseFloat(product.average_rating)} count={product.review_count} size={13} />
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-4 sm:gap-3 sm:pt-5">
          <div className="flex flex-col">
            {product.compare_at_price && (
              <span className="text-xs text-ink-600 line-through">{formatPrice(product.compare_at_price, product.currency)}</span>
            )}
            <span className="font-display text-lg leading-none text-sage-900 sm:text-2xl">{formatPrice(product.price, product.currency)}</span>
          </div>
          <button
            onClick={() => addToCart.mutate({ productId: product.id })}
            disabled={!product.is_in_stock || addToCart.isPending}
            aria-label={`Add ${product.name} to basket`}
            className="relative z-10 flex h-10 w-10 shrink-0 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-sage-800 text-cream-50 shadow-press transition duration-200 hover:scale-110 hover:bg-gold-500 hover:text-ink-900 active:scale-95 disabled:scale-100 disabled:bg-cream-300 disabled:text-ink-600 disabled:shadow-none"
          >
            <ShoppingBasket size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
