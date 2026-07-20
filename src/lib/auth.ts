import { api } from './api';
import type { Address, User } from '../types';

export interface RegisterPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  newsletter_opt_in?: boolean;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>('/auth/register/', payload);
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data } = await api.post<AuthResponse & { access: string; refresh: string }>('/auth/login/', {
    email,
    password,
  });
  return data;
}

export async function logoutUser(refresh: string) {
  await api.post('/auth/logout/', { refresh });
}

export async function fetchMe() {
  const { data } = await api.get<User>('/auth/me/');
  return data;
}

export async function updateMe(payload: Partial<User>) {
  const { data } = await api.patch<User>('/auth/me/', payload);
  return data;
}

export async function verifyEmail(uid: string, token: string) {
  const { data } = await api.post<{ detail: string }>('/auth/verify-email/', { uid, token });
  return data;
}

export async function resendVerificationEmail(email: string) {
  const { data } = await api.post<{ detail: string }>('/auth/verify-email/resend/', { email });
  return data;
}

export async function requestPasswordReset(email: string) {
  const { data } = await api.post<{ detail: string }>('/auth/password-reset/', { email });
  return data;
}

export async function confirmPasswordReset(uid: string, token: string, new_password: string) {
  const { data } = await api.post<{ detail: string }>('/auth/password-reset/confirm/', {
    uid,
    token,
    new_password,
  });
  return data;
}

export async function changePassword(old_password: string, new_password: string) {
  const { data } = await api.post<{ detail: string }>('/auth/change-password/', {
    old_password,
    new_password,
  });
  return data;
}

export async function fetchAddresses() {
  const { data } = await api.get<Address[] | { results: Address[] }>('/auth/addresses/');
  return Array.isArray(data) ? data : data.results;
}

export async function createAddress(payload: Omit<Address, 'id' | 'created_at'>) {
  const { data } = await api.post<Address>('/auth/addresses/', payload);
  return data;
}

export async function updateAddress(id: string, payload: Partial<Address>) {
  const { data } = await api.patch<Address>(`/auth/addresses/${id}/`, payload);
  return data;
}

export async function deleteAddress(id: string) {
  await api.delete(`/auth/addresses/${id}/`);
}
