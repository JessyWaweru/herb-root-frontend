import { api } from './api';
import type { Payment, PaymentInit } from '../types';

export async function initializePayment(orderNumber: string) {
  const { data } = await api.post<PaymentInit>('/payments/initialize/', { order_number: orderNumber });
  return data;
}

export async function verifyPayment(reference: string) {
  const { data } = await api.get<Payment>(`/payments/verify/${reference}/`);
  return data;
}
