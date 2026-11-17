import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useCart, useRemoveCartItem, useUpdateCartItem } from '../hooks/useCart';
import { useAuthStore } from '../stores/authStore';
import { PageSpinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button, ButtonLink } from '../components/ui/Button';
import { formatPrice } from '../lib/format';
import { ProductImage } from '../components/product/ProductImage';
import { Eyebrow } from '../components/ui/SectionHeading';
import { Sprig } from '../components/art/Botanical';

export function Cart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EmptyState
          icon="🧺"
          headingLevel={1}
          title="Sign in to see your basket"
          description="Your basket is saved to your account so it's there whenever you come back."
          action={
            <ButtonLink to="/login">Sign in</ButtonLink>
          }
        />
      </div>
    );
  }

  if (isLoading) return <PageSpinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EmptyState
          icon="🧺"
          headingLevel={1}
          title="Your basket is empty"
          description="Explore remedies by what you're feeling, or browse the full shop."
          action={
            <ButtonLink to="/shop">Start shopping</ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'}
          </Eyebrow>
          <h1 className="mt-4 font-display text-4xl leading-none tracking-[-0.02em] text-sage-900 sm:text-5xl">
            Your <em className="accent-italic">basket</em>
          </h1>
        </div>
        <Link to="/shop" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-sage-800">
          <ArrowLeft size={15} aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" />
          <span className="link-sweep">Continue shopping</span>
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        <ul className="flex flex-col gap-4">
          {cart.items.map((item) => (
            <li key={item.id} className="card flex gap-4 p-3.5 sm:gap-5 sm:p-4">
              <Link to={`/shop/${item.product.slug}`} className="shrink-0">
                <ProductImage
                  src={item.product.primary_image_url}
                  alt={item.product.name}
                  seed={item.product.id}
                  className="h-24 w-24 rounded-2xl sm:h-32 sm:w-32"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/shop/${item.product.slug}`}>
                      <h2 className="font-display text-xl leading-tight text-sage-900 transition-colors hover:text-sage-600">{item.product.name}</h2>
                    </Link>
                    <p className="mt-1 text-sm text-ink-600">{formatPrice(item.product.price, item.product.currency)} each</p>
                  </div>
                  <button
                    onClick={() => removeItem.mutate(item.id)}
                    aria-label={`Remove ${item.product.name}`}
                    className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-cream-300 bg-cream-100">
                    <button
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:text-sage-800"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold tabular-nums text-sage-900">{item.quantity}</span>
                    <button
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:text-sage-800"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-display text-xl text-sage-900">{formatPrice(item.line_total, item.product.currency)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="bg-forest relative h-fit overflow-hidden rounded-[2rem] p-7 text-cream-50 lg:sticky lg:top-28">
          <Sprig className="pointer-events-none absolute -right-8 -top-10 h-56 rotate-[28deg] text-sage-300/20" leaves={7} />
          <div className="relative">
            <h2 className="font-display text-2xl text-cream-50">Order summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-cream-100/80">Subtotal ({cart.total_items} items)</dt>
                <dd className="font-semibold">{formatPrice(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-cream-100/80">Shipping</dt>
                <dd className="text-cream-100/80">Calculated at checkout</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-cream-50/15 pt-4">
                <dt className="font-display text-lg text-cream-50">Total</dt>
                <dd className="font-display text-3xl text-cream-50">{formatPrice(cart.subtotal)}</dd>
              </div>
            </dl>
            <Button variant="secondary" className="mt-7 w-full" size="lg" onClick={() => navigate('/checkout')}>
              Proceed to checkout
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-cream-100/75">
              <ShieldCheck size={14} className="text-gold-400" aria-hidden="true" />
              Secure checkout via Paystack — cards &amp; M-Pesa
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
