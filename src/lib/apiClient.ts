import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from './config';

export type ApiErrorCode = 'UNAUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR';

export type ApiErrorPayload = {
  code: ApiErrorCode;
  message: string;
  status?: number;
  details?: unknown;
};

const REQUEST_TIMEOUT_MS = 15000;

// In-memory cache of admin resource paths that returned 404 in this browser session.
// Cleared on full page refresh (in-memory only) which satisfies requirement #6.
export const missingAdminApis = new Set<string>();

export class MissingBackendApiError extends Error {
  constructor(operation: string, resourceKey: string) {
    super(`Backend API missing for ${resourceKey}.${operation}`);
    this.name = 'MissingBackendApiError';
  }
}

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Helper to extract the admin resource key (first path segment after /admin/)
function extractAdminResourceKey(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const m = url.match(/\/admin\/([^\/\?\#]+)/);
    if (!m) return undefined;
    return m[1].replaceAll('|', '').replaceAll(' ', '-');
  } catch {
    return undefined;
  }
}

// Request interceptor: short-circuit requests for admin resources previously marked missing
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url as string | undefined;
  const resourceKey = extractAdminResourceKey(url);
  if (resourceKey && missingAdminApis.has(resourceKey)) {
    throw new MissingBackendApiError('request', resourceKey);
  }
  return config;
});

// Response interceptor (added after the original) — runs first due to axios LIFO for responses.
api.interceptors.response.use(undefined, (error: AxiosError) => {
  const normalized = normalizeApiError(error);
  const reqUrl = error.config?.url ?? (error.request as any)?.responseURL;
  const resourceKey = extractAdminResourceKey(reqUrl as string | undefined);
  if (normalized.code === 'NOT_FOUND' && resourceKey) {
    missingAdminApis.add(resourceKey);
    return Promise.reject(new MissingBackendApiError('request', resourceKey));
  }

  return Promise.reject(error);
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Cookie-based authentication is handled by the browser using withCredentials.
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalized = normalizeApiError(error);
    if (normalized.code === 'UNAUTHORIZED') {
      window.dispatchEvent(new CustomEvent('polyrib:unauthorized'));
    }
    return Promise.reject(normalized);
  }
);

export function normalizeApiError(error: AxiosError): ApiErrorPayload {
  const status = error.response?.status;
  const details = error.response?.data;

  if (status === 401) {
    return {
      code: 'UNAUTHORIZED',
      status,
      message: 'Authentication is required.',
      details,
    };
  }

  if (status === 404) {
    return {
      code: 'NOT_FOUND',
      status,
      message: 'The requested resource was not found.',
      details,
    };
  }

  if (status && status >= 500) {
    return {
      code: 'SERVER_ERROR',
      status,
      message: 'The server could not complete the request.',
      details,
    };
  }

  return {
    code: 'NETWORK_ERROR',
    status,
    message: error.message || 'The request could not be completed.',
    details,
  };
}

export default api;
