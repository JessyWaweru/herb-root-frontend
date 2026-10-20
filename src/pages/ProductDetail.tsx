import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Minus, Plus, ShieldCheck, ShoppingBasket } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { useToggleWishlist } from '../hooks/useWishlist';
import { PageSpinner } from '../components/ui/Spinner';
import { StarRating } from '../components/ui/StarRating';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmailUsButton } from '../components/experts/EmailUsButton';
import { formatPrice, resolveMediaUrl } from '../lib/format';
import { Seo } from '../components/seo/Seo';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { breadcrumbJsonLd, graph, productJsonLd, summarize, type Crumb } from '../seo/site';
import { ProductGallery } from '../components/product/ProductGallery';
import { PlantGardenAlbum } from '../components/product/PlantGardenAlbum';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { ProductGrid } from '../components/product/ProductGrid';
import { ItemNotFound } from '../components/ui/ItemNotFound';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug);
  const addToCart = useAddToCart();
  const { isWishlisted, toggle } = useToggleWishlist();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <PageSpinner />;
  if (!product) {
    return <ItemNotFound title="We couldn't find that remedy" linkTo="/shop" linkLabel="Back to shop" />;
  }

  const wishlisted = isWishlisted(product.id);
  const crumbs: Crumb[] = [
    { label: 'Shop', to: '/shop' },
    ...(product.category ? [{ label: product.category.name, to: `/shop?category=${product.category.slug}` }] : []),
    { label: product.name, to: `/shop/${product.slug}` },
  ];
  const images = [product.primary_image_url, ...product.gallery_images.map((img) => img.image_url)]
    .filter(Boolean)
    .map(resolveMediaUrl);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo
        title={product.category ? `${product.name} — ${product.category.name}` : product.name}
        description={summarize(`${product.short_description} ${product.description}`)}
        path={`/shop/${product.slug}`}
        type="product"
        image={images[0]}
        imageAlt={product.name}
        jsonLd={graph(productJsonLd({ ...product, images }), breadcrumbJsonLd(crumbs))}
      />
      <Breadcrumbs items={crumbs} />

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery product={product} />

        <div>
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">
              {product.category.name}
            </span>
          )}
          <h1 className="mt-2 font-display text-3xl text-sage-900 sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            {product.review_count > 0 ? (
              <StarRating value={parseFloat(product.average_rating)} showValue count={product.review_count} />
            ) : (
              <span className="text-sm text-ink-600">No reviews yet</span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl text-sage-900">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compare_at_price && (
              <span className="text-base text-ink-600 line-through">
                {formatPrice(product.compare_at_price, product.currency)}
              </span>
            )}
          </div>

          <p className="mt-4 text-ink-700">{product.short_description}</p>

          {product.symptoms.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.symptoms.map((s) => (
                <Link key={s.id} to={`/shop?symptom=${s.slug}`}>
                  <Badge tone="sage">{s.icon} {s.name}</Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-cream-300 bg-cream-50">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-ink-700 hover:text-sage-700"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 1, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-ink-700 hover:text-sage-700"
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>

            <Button
              size="lg"
              icon={<ShoppingBasket size={17} />}
              disabled={!product.is_in_stock || addToCart.isPending}
              isLoading={addToCart.isPending}
              onClick={() => addToCart.mutate({ productId: product.id, quantity })}
              className="flex-1"
            >
              {product.is_in_stock ? 'Add to basket' : 'Out of stock'}
            </Button>

            <button
              onClick={() => toggle(product.id)}
              aria-label="Toggle wishlist"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition ${
                wishlisted ? 'border-rose-500 bg-rose-500 text-white' : 'border-cream-300 text-ink-700 hover:bg-sage-50'
              }`}
            >
              <Heart size={18} className={wishlisted ? 'fill-current' : ''} />
            </button>
          </div>

          {product.is_in_stock && product.stock_quantity <= 10 && (
            <p className="mt-2 text-xs font-medium text-rose-600">Only {product.stock_quantity} left in stock</p>
          )}

          <div className="mt-6 flex items-center gap-2 text-xs text-ink-600">
            <ShieldCheck size={15} className="text-sage-600" />
            Secure checkout via Paystack — cards &amp; M-Pesa
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <EmailUsButton subject={`Question about ${product.name}`} label="Ask about this product" />
            <Link to="/experts" className="text-sm font-semibold text-sage-700 hover:underline">
              Or book an expert →
            </Link>
          </div>

          {product.ingredients.length > 0 && (
            <div className="mt-8 rounded-2xl border border-cream-300 bg-cream-50 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-sage-700">Ingredients</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <li key={ing.id} title={ing.description} className="rounded-full bg-sage-50 px-3 py-1 text-sm text-sage-800">
                    {ing.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          {product.description && (
            <div>
              <h2 className="font-display text-xl text-sage-900">About this remedy</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-700">{product.description}</p>
            </div>
          )}
          {product.how_it_helps && (
            <div>
              <h2 className="font-display text-xl text-sage-900">What it helps with</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-700">{product.how_it_helps}</p>
            </div>
          )}
          {product.usage_instructions && (
            <div>
              <h2 className="font-display text-xl text-sage-900">How to use</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-700">{product.usage_instructions}</p>
            </div>
          )}
        </div>

        <PlantGardenAlbum product={product} />
      </div>

      <div className="mt-16">
        <ReviewsSection key={product.slug} productSlug={product.slug} reviews={product.reviews} />
      </div>

      {product.related_products.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-xl text-sage-900">You might also like</h2>
          <ProductGrid products={product.related_products} />
        </div>
      )}
    </div>
  );
}
