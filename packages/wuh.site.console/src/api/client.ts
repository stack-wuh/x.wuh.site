const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3200/v2';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = Array.isArray(payload?.message)
      ? payload.message.join(', ')
      : payload?.message || response.statusText;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export function githubLoginUrl() {
  const state = encodeURIComponent(window.location.pathname + window.location.search);
  return `${API_BASE_URL}/auth/github?state=${state}`;
}
