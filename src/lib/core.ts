import { api } from './api';

export async function subscribeNewsletter(email: string) {
  const { data } = await api.post<{ detail: string }>('/newsletter/subscribe/', { email });
  return data;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactMessage(payload: ContactPayload) {
  const { data } = await api.post<{ detail: string }>('/contact/', payload);
  return data;
}
