import { fetcher } from '@wuh.site/hooks/useFetch/fetcher';
import type {
  PaginatedResult,
  ContentItem,
  RepoDto,
} from '@wuh.site/shared-contracts';

const API_BASE = process.env.NEST_API_URL || 'http://localhost:3200/v2';

type FetchOptions = {
  revalidate?: number;
};

async function apiGet<T>(path: string, options?: FetchOptions): Promise<T> {
  const res = await fetcher<T>(`${API_BASE}${path}`, {
    headers: { 'Accept': 'application/json' },
    next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
  });
  if (!res.ok || !res.data) {
    throw new Error(res.error?.message || `API request failed: ${path}`);
  }
  return res.data;
}

// Content API
export const content = {
  getPosts(params?: {
    page?: number;
    limit?: number;
    labels?: string[];
    state?: 'open' | 'closed';
  }, options?: FetchOptions): Promise<PaginatedResult<ContentItem>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.labels?.length) query.set('labels', params.labels.join(','));
    if (params?.state) query.set('state', params.state);
    const qs = query.toString();
    return apiGet<PaginatedResult<ContentItem>>(`/content/posts${qs ? `?${qs}` : ''}`, options);
  },

  getPost(slugOrNumber: string | number, options?: FetchOptions): Promise<ContentItem> {
    return apiGet<ContentItem>(`/content/posts/${slugOrNumber}`, options);
  },

  getProjects(params?: { page?: number; limit?: number }, options?: FetchOptions): Promise<PaginatedResult<ContentItem>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return apiGet<PaginatedResult<ContentItem>>(`/content/projects${qs ? `?${qs}` : ''}`, options);
  },
};

// Repos API
export const repos = {
  getAll(options?: FetchOptions): Promise<{ repos: RepoDto[] }> {
    return apiGet<{ repos: RepoDto[] }>('/repos', options);
  },
};

// Comments API
export const comments = {
  getByIssue(issueNumber: number, params?: { page?: number; limit?: number }, options?: FetchOptions) {
    const query = new URLSearchParams();
    query.set('issueNumber', String(issueNumber));
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return apiGet(`/comments?${query.toString()}`, options);
  },
};

const api = {
  content,
  repos,
  comments,
};

export default api;
