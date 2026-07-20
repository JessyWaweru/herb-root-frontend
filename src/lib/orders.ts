import { api } from './api';
import type { Cart, Order, Paginated } from '../types';

export async function fetchCart() {
  const { data } = await api.get<Cart>('/orders/cart/');
  return data;
}

export async function addCartItem(productId: string, quantity = 1) {
  const { data } = await api.post<Cart>('/orders/cart/items/', { product_id: productId, quantity });
  return data;
}

export async function updateCartItem(itemId: string, quantity: number) {
  const { data } = await api.patch<Cart>(`/orders/cart/items/${itemId}/`, { quantity });
  return data;
}

export async function removeCartItem(itemId: string) {
  const { data } = await api.delete<Cart>(`/orders/cart/items/${itemId}/`);
  return data;
}

export async function clearCart() {
  await api.delete('/orders/cart/');
}

export interface CheckoutPayload {
  address_id?: string;
  full_name?: string;
  phone_number?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  county_or_state?: string;
  postal_code?: string;
  country?: string;
  customer_notes?: string;
}

export async function checkout(payload: CheckoutPayload) {
  const { data } = await api.post<Order>('/orders/checkout/', payload);
  return data;
}

export async function fetchOrders() {
  const { data } = await api.get<Paginated<Order> | Order[]>('/orders/orders/');
  return Array.isArray(data) ? data : data.results;
}

export async function fetchOrder(orderNumber: string) {
  const { data } = await api.get<Order>(`/orders/orders/${orderNumber}/`);
  return data;
}
