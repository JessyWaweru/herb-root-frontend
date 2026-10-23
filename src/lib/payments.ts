import { api } from './api';
import type { MpesaCharge, Payment, PaymentInit } from '../types';

/** What a payment is for: an order or a consultation booking. */
export type PaymentTarget = { order_number: string } | { consultation_reference: string };

/** Starts a payment on Paystack's own page; the customer is sent there and back. */
export async function initializePayment(target: PaymentTarget) {
  const { data } = await api.post<PaymentInit>('/payments/initialize/', target);
  return data;
}

/** Sends an M-Pesa prompt to the customer's phone; the payment then confirms within ~3 minutes. */
export async function chargeMpesa(target: PaymentTarget, phoneNumber: string) {
  const { data } = await api.post<MpesaCharge>('/payments/mpesa/', { ...target, phone_number: phoneNumber });
  return data;
}

export async function verifyPayment(reference: string) {
  const { data } = await api.get<Payment>(`/payments/verify/${reference}/`);
  return data;
}

/** Same rule as the server: a Kenyan mobile number, written any of the usual ways. */
export function isMpesaNumber(phone: string) {
  const digits = phone.replace(/[\s\-()]/g, '').replace(/^\+/, '').replace(/^254|^0/, '');
  return /^[71]\d{8}$/.test(digits);
}

// Safaricom keeps the PIN prompt open for 180 seconds; give the confirmation a little longer to arrive.
export const MPESA_PROMPT_MS = 200_000;
