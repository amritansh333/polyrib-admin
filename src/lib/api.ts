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

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = window.localStorage.getItem('polyrib_admin_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
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
