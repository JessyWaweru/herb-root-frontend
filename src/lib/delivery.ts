import { api } from './api';
import type { DeliveryOption, DeliveryQuote, OrderStatus } from '../types';

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

export interface RiderDelivery {
  order_number: string;
  status: OrderStatus;
  rider_name: string;
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  landmark: string;
  latitude: string | null;
  longitude: string | null;
  directions_url: string;
  items: { name: string; quantity: number }[];
  is_paid: boolean;
}

export async function fetchRiderDelivery(token: string) {
  const { data } = await api.get<RiderDelivery>(`/orders/rider/${token}/`);
  return data;
}

export async function updateRiderDelivery(token: string, action: 'picked-up' | 'delivered') {
  const { data } = await api.post<RiderDelivery>(`/orders/rider/${token}/${action}/`);
  return data;
}
