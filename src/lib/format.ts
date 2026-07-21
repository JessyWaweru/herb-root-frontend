import { API_BASE_URL } from './api';

const MEDIA_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export function resolveMediaUrl(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${MEDIA_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function formatPrice(amount: string | number, currency = 'KES') {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium' }).format(new Date(iso));
}
