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
    // Immediately throw a MissingBackendApiError to let callers render the existing state
    throw new MissingBackendApiError('request', resourceKey);
  }

  // Attach auth token if present
  try {
    const token = window.localStorage.getItem('polyrib_admin_access_token');
    if (token) {
      config.headers = config.headers || {};
      // Attach as Bearer token when available
      (config.headers as any).Authorization = `Bearer ${token}`;
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {}

  return config;
});

// Single response interceptor: normalize errors, mark missing admin APIs on 404, and forward other errors.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Treat HTTP 304 Not Modified as a non-error so callers can handle cached responses.
    // Some admin endpoints may return 304 for cache revalidation; treating it as an error
    // causes the UI to show a failure even though the browser cache has a valid body.
    if (error.response?.status === 304) {
      return Promise.resolve(error.response as any);
    }

    const normalized = normalizeApiError(error);

    // If a 404 comes back for an admin resource, mark it missing so subsequent
    // requests in this browser session are short-circuited.
    const reqUrl = (error.config as any)?.url ?? (error.request as any)?.responseURL;
    const resourceKey = extractAdminResourceKey(reqUrl as string | undefined);
    if (normalized.code === 'NOT_FOUND' && resourceKey) {
      missingAdminApis.add(resourceKey);
      return Promise.reject(new MissingBackendApiError('request', resourceKey));
    }

    // Do not suppress 401/403/5xx/network failures — let callers receive normalized errors
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
