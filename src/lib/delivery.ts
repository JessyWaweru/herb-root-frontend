import { api } from './api';
import type { DeliveryOption, DeliveryQuote } from '../types';

export async function fetchDeliveryOptions() {
  const { data } = await api.get<DeliveryOption[]>('/orders/delivery-options/');
  return data;
}

export async function fetchDeliveryQuote(latitude: number, longitude: number) {
  const { data } = await api.get<DeliveryQuote>('/orders/delivery-quote/', {
    params: { latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) },
  });
  return data;
}
