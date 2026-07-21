import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart, useRemoveCartItem, useUpdateCartItem } from '../hooks/useCart';
import { useAuthStore } from '../stores/authStore';
import { PageSpinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { formatPrice, resolveMediaUrl } from '../lib/format';

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
          title="Sign in to see your basket"
          description="Your basket is saved to your account so it's there whenever you come back."
          action={
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
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
          title="Your basket is empty"
          description="Explore remedies by what you're feeling, or browse the full shop."
          action={
            <Link to="/shop">
              <Button>Start shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-sage-900">Your basket</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-4"
            >
              <Link to={`/shop/${item.product.slug}`} className="shrink-0">
                <img
                  src={resolveMediaUrl(item.product.primary_image_url)}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link to={`/shop/${item.product.slug}`}>
                    <h3 className="font-display text-lg text-sage-900 hover:text-sage-700">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-ink-600">
                    {formatPrice(item.product.price, item.product.currency)} each
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-cream-300">
                    <button
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                      className="flex h-9 w-9 items-center justify-center text-ink-700 hover:text-sage-700"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                      className="flex h-9 w-9 items-center justify-center text-ink-700 hover:text-sage-700"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sage-900">
                      {formatPrice(item.line_total, item.product.currency)}
                    </span>
                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      aria-label="Remove item"
                      className="text-ink-600/60 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-cream-300 bg-cream-50 p-6">
          <h3 className="font-display text-lg text-sage-900">Order summary</h3>
          <div className="mt-4 flex justify-between text-sm text-ink-700">
            <span>Subtotal ({cart.total_items} items)</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-ink-600">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-cream-300 pt-4 font-display text-lg text-sage-900">
            <span>Total</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
