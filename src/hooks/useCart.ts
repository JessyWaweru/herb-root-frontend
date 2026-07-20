import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addCartItem, clearCart, fetchCart, removeCartItem, updateCartItem } from '../lib/orders';
import { useAuthStore } from '../stores/authStore';
import { apiErrorMessage } from '../lib/api';
import type { Cart } from '../types';

const CART_KEY = ['cart'];

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: CART_KEY,
    queryFn: fetchCart,
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) => {
      if (!isAuthenticated) {
        throw new Error('AUTH_REQUIRED');
      }
      return addCartItem(productId, quantity);
    },
    onSuccess: (cart: Cart) => {
      queryClient.setQueryData(CART_KEY, cart);
      toast.success('Added to your basket.');
    },
    onError: (error: Error) => {
      if (error.message === 'AUTH_REQUIRED') {
        toast.error('Please sign in to add items to your basket.');
        return;
      }
      toast.error(apiErrorMessage(error, 'Could not add this item.'));
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update quantity.')),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not remove item.')),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}
