import { API_CONFIG } from './config';
import { getAuthToken } from './storage';
import { logger } from '@/utils/logger';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly body?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, headers = {} } = options;
  const url = `${API_CONFIG.baseUrl}${path}`;

  const token = await getAuthToken();

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };


  if (!isFormData && !defaultHeaders['Content-Type']) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // If header Content-Type is multipart/form-data, delete it so fetch can set boundary automatically
  if (isFormData && defaultHeaders['Content-Type'] === 'multipart/form-data') {
    delete defaultHeaders['Content-Type'];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: defaultHeaders,
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const data = text ? (JSON.parse(text) as unknown) : null;

    if (!response.ok) {
      const errorMsg =
        data && typeof data === 'object' && 'message' in data
          ? String((data as { message: unknown }).message)
          : `Request failed: ${response.status}`;
      throw new ApiError(response.status, errorMsg, data);
    }

    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    logger.error('api', 'request failed', { path, error: String(err) });
    throw new ApiError(0, err instanceof Error ? err.message : 'Network error');
  } finally {
    clearTimeout(timeout);
  }
}

