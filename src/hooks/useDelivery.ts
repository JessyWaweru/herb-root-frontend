import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchDeliveryOptions, fetchDeliveryQuote } from '../lib/delivery';

export function useDeliveryOptions() {
  return useQuery({ queryKey: ['delivery-options'], queryFn: fetchDeliveryOptions, staleTime: 5 * 60_000 });
}

export function useDeliveryQuote(pin: { latitude: number; longitude: number } | null) {
  return useQuery({
    queryKey: ['delivery-quote', pin?.latitude.toFixed(5), pin?.longitude.toFixed(5)],
    queryFn: () => fetchDeliveryQuote(pin!.latitude, pin!.longitude),
    enabled: pin !== null,
    placeholderData: keepPreviousData,
  });
}
