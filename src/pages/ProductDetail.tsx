import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Heart, Minus, Plus, ShieldCheck, ShoppingBasket, Truck } from 'lucide-react';
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
import { breadcrumbJsonLd, concernPath, graph, productJsonLd, summarize, type Crumb } from '../seo/site';
import { ProductGallery } from '../components/product/ProductGallery';
import { PlantGardenAlbum } from '../components/product/PlantGardenAlbum';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { ProductGrid } from '../components/product/ProductGrid';
import { ItemNotFound } from '../components/ui/ItemNotFound';
import { SectionHeading } from '../components/ui/SectionHeading';
import { BrandLeaf } from '../components/art/Botanical';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug);
  const addToCart = useAddToCart();
  const { isWishlisted, toggle } = useToggleWishlist();
  const [quantity, setQuantity] = useState(1);
  // Whether the main "Add to basket" row is on screen; the phone's sticky bar shows when it isn't.
  const buyRowRef = useRef<HTMLDivElement>(null);
  const [buyRowVisible, setBuyRowVisible] = useState(true);
  const loaded = Boolean(product);

  useEffect(() => {
    const row = buyRowRef.current;
    if (!row) return;
    const observer = new IntersectionObserver(([entry]) => setBuyRowVisible(entry.isIntersecting));
    observer.observe(row);
    return () => observer.disconnect();
  }, [loaded, slug]);

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

  const price = formatPrice(product.price, product.currency);
  const saving =
    product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
      ? Math.round((1 - Number(product.price) / Number(product.compare_at_price)) * 100)
      : 0;
  const details = [
    { title: 'About this remedy', text: product.description },
    { title: 'What it helps with', text: product.how_it_helps },
    { title: 'How to use', text: product.usage_instructions },
  ].filter((section) => section.text);
  const addToBasket = () => addToCart.mutate({ productId: product.id, quantity });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
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

      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <ProductGallery product={product} />

        <div className="animate-rise">
          {product.category && (
            <Link to={`/shop?category=${product.category.slug}`} className="eyebrow inline-flex items-center gap-3 transition-colors hover:text-sage-800">
              <span className="h-px w-7 bg-current opacity-50" aria-hidden="true" />
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-4 text-balance font-display text-4xl leading-[1.03] tracking-[-0.02em] text-sage-900 sm:text-5xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            {product.review_count > 0 ? (
              <a href="#reviews" className="rounded-full transition-opacity hover:opacity-75">
                <StarRating value={parseFloat(product.average_rating)} showValue count={product.review_count} />
              </a>
            ) : (
              <span className="text-sm text-ink-600">No reviews yet</span>
            )}
          </div>

          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-700">{product.short_description}</p>

          {product.symptoms.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {product.symptoms.map((s) => (
                <Link key={s.id} to={concernPath(s.slug)}>
                  <Badge tone="sage" className="ring-1 ring-sage-200 hover:bg-sage-800 hover:text-cream-50">
                    <span aria-hidden="true">{s.icon}</span> {s.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* The buy box */}
          <div className="card mt-8 p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl leading-none text-sage-900 sm:text-5xl">{price}</span>
                {product.compare_at_price && (
                  <span className="text-base text-ink-600 line-through">{formatPrice(product.compare_at_price, product.currency)}</span>
                )}
              </div>
              {saving > 0 && <Badge tone="rose">Save {saving}%</Badge>}
              {product.is_in_stock && product.stock_quantity <= 10 ? (
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                  Only {product.stock_quantity} left in stock
                </span>
              ) : (
                product.is_in_stock && (
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-sage-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sage-500" aria-hidden="true" />
                    In stock
                  </span>
                )
              )}
            </div>

            <div ref={buyRowRef} className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex h-13 items-center rounded-full border border-cream-300 bg-cream-100">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-13 w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:text-sage-800"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-7 text-center text-sm font-bold tabular-nums text-sage-900" aria-live="polite">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 1, q + 1))}
                  className="flex h-13 w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:text-sage-800"
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
                onClick={addToBasket}
                // On a phone the button takes its own full-width row under the quantity and heart.
                className="order-last w-full px-4 sm:order-none sm:w-auto sm:flex-1"
              >
                {product.is_in_stock ? 'Add to basket' : 'Out of stock'}
              </Button>

              <button
                onClick={() => toggle(product.id)}
                aria-label="Toggle wishlist"
                aria-pressed={Boolean(wishlisted)}
                className={`ml-auto flex h-13 w-13 shrink-0 items-center justify-center rounded-full border transition duration-200 hover:scale-105 active:scale-95 sm:ml-0 ${
                  wishlisted ? 'border-rose-500 bg-rose-500 text-cream-50' : 'border-cream-300 bg-cream-100 text-ink-700 hover:border-rose-400 hover:text-rose-600'
                }`}
              >
                <Heart size={18} className={wishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            <ul className="mt-5 grid gap-2.5 border-t border-cream-200 pt-5 text-sm text-ink-700 sm:grid-cols-2">
              <li className="flex items-center gap-2.5">
                <ShieldCheck size={17} className="shrink-0 text-sage-600" aria-hidden="true" />
                Secure checkout via Paystack — cards &amp; M-Pesa
              </li>
              <li className="flex items-center gap-2.5">
                <Truck size={17} className="shrink-0 text-sage-600" aria-hidden="true" />
                Packed to order across Kenya
              </li>
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <EmailUsButton subject={`Question about ${product.name}`} label="Ask about this product" />
            <Link to="/experts" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-sage-800">
              <span className="link-sweep">Or book an expert</span>
              <ArrowRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {product.ingredients.length > 0 && (
            <div className="mt-10">
              <h2 className="eyebrow text-sage-700">What's inside</h2>
              <ul className="mt-3 divide-y divide-cream-300 border-y border-cream-300">
                {product.ingredients.map((ing) => (
                  <li key={ing.id} className="flex gap-3.5 py-3.5">
                    <BrandLeaf className="mt-1 h-4 shrink-0 text-sage-500" veins={false} />
                    <div>
                      <p className="font-display text-lg leading-tight text-sage-900">{ing.name}</p>
                      {ing.description && <p className="mt-1 text-sm leading-relaxed text-ink-600">{ing.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {(details.length > 0 || product.plant_origin || product.plant_gallery_images.length > 0) && (
        <div className="mt-20 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="flex flex-col divide-y divide-cream-300">
            {details.map((section, i) => (
              <section key={section.title} className="grid gap-3 py-8 first:pt-0 last:pb-0 sm:grid-cols-[4rem_1fr]">
                <span className="font-display text-3xl italic leading-none text-sage-400" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h2 className="font-display text-2xl text-sage-900">{section.title}</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-700">{section.text}</p>
                </div>
              </section>
            ))}
          </div>

          <PlantGardenAlbum product={product} />
        </div>
      )}

      <div className="mt-20 border-t border-cream-300 pt-16">
        <ReviewsSection key={product.slug} productSlug={product.slug} reviews={product.reviews} />
      </div>

      {product.related_products.length > 0 && (
        <div className="mt-24">
          <SectionHeading
            eyebrow="Keep exploring"
            title={
              <>
                You might <em>also like</em>
              </>
            }
          />
          <ProductGrid products={product.related_products} animated />
        </div>
      )}

      {/* On phones, once the main button has scrolled away, a slim bar keeps buying one tap away. */}
      {product.is_in_stock && (
        <div
          aria-hidden={buyRowVisible}
          className={`fixed inset-x-0 bottom-0 z-30 border-t border-cream-300 bg-cream-50/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_-18px_rgba(10,56,41,0.45)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
            buyRowVisible ? 'translate-y-full' : 'translate-y-0'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink-600">{product.name}</p>
              <p className="font-display text-xl leading-tight text-sage-900">{price}</p>
            </div>
            <Button
              icon={<ShoppingBasket size={16} />}
              disabled={addToCart.isPending}
              isLoading={addToCart.isPending}
              onClick={addToBasket}
              tabIndex={buyRowVisible ? -1 : 0}
            >
              Add to basket
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
