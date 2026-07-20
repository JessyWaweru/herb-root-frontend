import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../lib/products';
import { useAuthStore } from '../stores/authStore';
import { apiErrorMessage } from '../lib/api';

const WISHLIST_KEY = ['wishlist'];

export function useWishlist() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: fetchWishlist,
    enabled: isAuthenticated,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: wishlist } = useWishlist();

  const add = useMutation({
    mutationFn: (productId: string) => {
      if (!isAuthenticated) throw new Error('AUTH_REQUIRED');
      return addToWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
      toast.success('Saved to your wishlist.');
    },
    onError: (error: Error) => {
      if (error.message === 'AUTH_REQUIRED') {
        toast.error('Please sign in to save favorites.');
        return;
      }
      toast.error(apiErrorMessage(error));
    },
  });

  const remove = useMutation({
    mutationFn: (wishlistItemId: string) => removeFromWishlist(wishlistItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
      toast.success('Removed from your wishlist.');
    },
  });

  const isWishlisted = (productId: string) => wishlist?.some((item) => item.product.id === productId);
  const findWishlistItemId = (productId: string) =>
    wishlist?.find((item) => item.product.id === productId)?.id;

  const toggle = (productId: string) => {
    const existingId = findWishlistItemId(productId);
    if (existingId) {
      remove.mutate(existingId);
    } else {
      add.mutate(productId);
    }
  };

  return { wishlist, isWishlisted, toggle, isPending: add.isPending || remove.isPending };
}
