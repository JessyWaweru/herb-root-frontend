import { Link } from 'react-router-dom';
import { ShoppingBasket, Trash2 } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { removeFromWishlist } from '../../lib/products';
import { useQueryClient } from '@tanstack/react-query';
import { useAddToCart } from '../../hooks/useCart';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/format';

export function AccountWishlist() {
  const { data: wishlist, isLoading } = useWishlist();
  const addToCart = useAddToCart();
  const queryClient = useQueryClient();

  const handleRemove = async (id: string) => {
    await removeFromWishlist(id);
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
  };

  if (isLoading) return <Spinner />;

  if (!wishlist || wishlist.length === 0) {
    return (
      <EmptyState
        icon="💚"
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here for later."
        action={
          <Link to="/shop">
            <Button>Browse remedies</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {wishlist.map((item) => (
        <div key={item.id} className="flex gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-4">
          <Link to={`/shop/${item.product.slug}`} className="shrink-0">
            <img src={item.product.primary_image_url} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" />
          </Link>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Link to={`/shop/${item.product.slug}`}>
                <h3 className="font-display text-base text-sage-900 hover:text-sage-700">{item.product.name}</h3>
              </Link>
              <p className="text-sm font-semibold text-sage-800">{formatPrice(item.product.price, item.product.currency)}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => addToCart.mutate({ productId: item.product.id })}
                className="flex items-center gap-1 text-xs font-semibold text-sage-700 hover:underline"
              >
                <ShoppingBasket size={12} /> Add to basket
              </button>
              <button
                onClick={() => handleRemove(item.id)}
                className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
