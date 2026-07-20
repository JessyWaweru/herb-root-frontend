import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkout, fetchOrder, fetchOrders, type CheckoutPayload } from '../lib/orders';
import { useAuthStore } from '../stores/authStore';

export function useOrders() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({ queryKey: ['orders'], queryFn: fetchOrders, enabled: isAuthenticated });
}

export function useOrder(orderNumber: string | undefined) {
  return useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => fetchOrder(orderNumber as string),
    enabled: Boolean(orderNumber),
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => checkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
