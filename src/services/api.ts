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
  timeoutMs?: number;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, headers = {}, timeoutMs = API_CONFIG.timeoutMs } = options;
  const url = `${API_CONFIG.baseUrl}${path}`;

  const token = await getAuthToken();

  const isFormData =
    body != null &&
    (body instanceof FormData ||
      (typeof body === 'object' &&
        typeof (body as Record<string, unknown>).append === 'function' &&
        '_parts' in (body as Record<string, unknown>)));

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };


  if (isFormData) {
    // Eliminar cualquier variante de Content-Type/content-type para que el fetch nativo de Android/iOS inserte el boundary multipart
    Object.keys(defaultHeaders).forEach((key) => {
      if (key.toLowerCase() === 'content-type') {
        delete defaultHeaders[key];
      }
    });
  } else if (!defaultHeaders['Content-Type'] && !defaultHeaders['content-type']) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    console.log(`[API Request] ${method} ${url}`);
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: defaultHeaders,
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const errorMsg =
        data && typeof data === 'object' && 'error' in data
          ? String((data as { error: unknown }).error)
          : data && typeof data === 'object' && 'message' in data
          ? String((data as { message: unknown }).message)
          : typeof data === 'string' && data.includes('<html')
          ? `HTTP ${response.status} (${response.statusText})`
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

export async function uploadFile<T>(
  path: string,
  formData: FormData,
  options: { timeoutMs?: number } = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${path}`;
  const token = await getAuthToken();
  const timeoutMs = options.timeoutMs ?? API_CONFIG.timeoutMs;

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.timeout = timeoutMs;

    xhr.setRequestHeader('Accept', 'application/json');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.onload = () => {
      const text = xhr.responseText;
      let data: unknown = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data as T);
      } else {
        const errorMsg =
          data && typeof data === 'object' && 'error' in data
            ? String((data as { error: unknown }).error)
            : `Request failed: ${xhr.status}`;
        reject(new ApiError(xhr.status, errorMsg, data));
      }
    };

    xhr.onerror = () => {
      logger.error('api', 'upload failed network error', { path });
      reject(new ApiError(0, 'Network error during file upload'));
    };

    xhr.ontimeout = () => {
      logger.error('api', 'upload timed out', { path });
      reject(new ApiError(0, 'Upload timed out'));
    };

    console.log(`[API Upload XHR] POST ${url}`);
    xhr.send(formData);
  });
}

