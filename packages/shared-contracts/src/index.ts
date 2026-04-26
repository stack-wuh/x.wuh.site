// Shared DTOs and types used by frontend and backend (typescript-only, no runtime deps)

export type ID = string;

export interface PaginationParams {
  page?: number; // 1-based
  pageSize?: number;
  cursor?: string | null; // optional cursor-style pagination
}

export interface PaginatedResponse<T> {
  items: T[];
  total?: number; // optional when not available
  nextCursor?: string | null;
}

// User
export interface UserDto {
  id: ID;
  name: string;
  email?: string;
  createdAt?: string; // ISO date
}

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string; // only used on server-side create
}

// Post (legacy name) - keep for compatibility
export interface PostDto {
  id: ID;
  authorId: ID;
  title: string;
  content: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  published?: boolean;
}

// Content (from backend content module)
export interface CreateContentDto {
  externalId: number;
  repo: string;
  number: number;
  title: string;
  labels?: string[];
  body?: string;
  bodyHtml?: string;
  metadata?: {
    slug?: string;
    summary?: string;
    cover?: string;
    keywords?: string[];
    rssExcluded?: boolean;
    extra?: Record<string, unknown>;
  };
}

export interface UpdateContentMetadataDto {
  slug?: string;
  summary?: string;
  cover?: string;
  keywords?: string[];
  rssExcluded?: boolean;
  extra?: Record<string, unknown>;
}

export interface QueryContentDto {
  labels?: string[];
  page?: number;
  limit?: number;
  state?: 'open' | 'closed';
}

// Comment
export interface CreateAnonymousCommentDto {
  nickname: string;
  email?: string;
  content: string;
}

export interface QueryCommentDto {
  issueNumber?: number;
  page?: number;
  limit?: number;
}

// Example export for reuse
export type ExampleDto = { id: ID; name: string };
