import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Auth tokens live in httpOnly cookies set by the API; this code never sees them.
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

// The CSRF cookie belongs to the API's origin, which this page can't read, so the
// token is fetched once from the API and sent back on every unsafe request.
let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

function getCsrfToken(): Promise<string> {
  if (csrfToken) return Promise.resolve(csrfToken);
  csrfRequest ??= axios
    .get<{ csrfToken: string }>(`${API_BASE_URL}/auth/csrf/`, { withCredentials: true })
    .then(({ data }) => (csrfToken = data.csrfToken))
    .finally(() => {
      csrfRequest = null;
    });
  return csrfRequest;
}

const SAFE_METHODS = ['get', 'head', 'options'];
const isUnsafe = (config: InternalAxiosRequestConfig) => !SAFE_METHODS.includes((config.method ?? 'get').toLowerCase());

api.interceptors.request.use(async (config) => {
  if (isUnsafe(config)) {
    config.headers.set('X-CSRFToken', await getCsrfToken());
  }
  return config;
});

// 401s from these mean "wrong credentials/code", not "session expired".
const NO_REFRESH = ['/auth/login/', '/auth/register/', '/auth/verify-email/', '/auth/logout/', '/auth/csrf/'];

let refreshRequest: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshRequest ??= getCsrfToken()
    .then((token) =>
      axios.post(`${API_BASE_URL}/auth/login/refresh/`, null, {
        withCredentials: true,
        headers: { 'X-CSRFToken': token },
      }),
    )
    .then(() => true)
    .catch(() => {
      useAuthStore.getState().clearAuth();
      return false;
    })
    .finally(() => {
      refreshRequest = null;
    });
  return refreshRequest;
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retriedAuth?: boolean;
  _retriedCsrf?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ detail?: string }>) => {
    const config = error.config as RetriableConfig | undefined;
    if (!config) return Promise.reject(error);
    const status = error.response?.status;

    if (status === 403 && error.response?.data?.detail?.startsWith('CSRF Failed') && !config._retriedCsrf) {
      config._retriedCsrf = true;
      csrfToken = null;
      return api(config);
    }

    if (status === 401 && !config._retriedAuth && !NO_REFRESH.some((path) => config.url?.endsWith(path))) {
      config._retriedAuth = true;
      // Retry either way: with a fresh session, or as a signed-out visitor (fine for public pages).
      await refreshSession();
      return api(config);
    }

    return Promise.reject(error);
  },
);

export function apiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string') return data;
    if (data?.detail) return data.detail as string;
    if (data && typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      const firstValue = data[firstKey];
      if (Array.isArray(firstValue)) return String(firstValue[0]);
      if (typeof firstValue === 'string') return firstValue;
    }
  }
  return fallback;
}
