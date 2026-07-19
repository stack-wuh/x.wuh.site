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
    coverAlt?: string;
    keywords?: string[];
    rssExcluded?: boolean;
    extra?: Record<string, unknown>;
  };
}

export interface UpdateContentMetadataDto {
  slug?: string;
  summary?: string;
  cover?: string;
  coverAlt?: string;
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

export interface ContentLabelSummary {
  name: string;
  count: number;
}

// Comment
export interface CreateAnonymousCommentDto {
  nickname: string;
  email?: string;
  content: string;
  footprint?: string;
  page?: string;
  issueNumber?: number;
}

export interface QueryCommentDto {
  issueNumber?: number;
  page?: number;
  limit?: number;
}

// Paginated result
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Content item (frontend-facing, returned by API)
export interface ContentItem {
  externalId: number;
  repo: string;
  number: number;
  title: string;
  labels: string[];
  state: 'open' | 'closed';
  body: string;
  bodyHtml?: string;
  metadata?: {
    slug?: string;
    summary?: string;
    cover?: string;
    coverAlt?: string;
    keywords?: string[];
    rssExcluded?: boolean;
    extra?: Record<string, unknown>;
  };
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  };
  comments: number;
  viewCount?: number;
  likeCount?: number;
  liked?: boolean;
  createdAtGitHub: string;
  updatedAtGitHub: string;
  publishedAt?: string;
}

// Repo
export interface RepoDto {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  homepage: string | null;
  fork: boolean;
}

// GitHub Profile
export interface GitHubProfileDto {
  login: string
  name: string
  avatar_url: string
  bio: string | null
  blog: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

// API v2
export interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  parameters?: ApiParameter[];
  responses?: ApiResponse[];
  tags?: string[];
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  location: 'query' | 'path' | 'body' | 'header';
  schema?: any;
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: any;
}

export interface ApiVersion {
  version: string;
  baseUrl: string;
  endpoints: ApiEndpoint[];
  metadata: {
    title: string;
    description: string;
    contact: {
      name: string;
      email: string;
    };
    license: {
      name: string;
      url: string;
    };
  };
}

// User
export enum UserRole {
  ROOT = 'root',
  WRITER = 'writer',
  READER = 'reader',
}

// Weread
export interface WereadBook {
  bookId: string
  title: string
  author: string
  cover: string
  readUpdateTime: number
  finishReading: number
  shelfIndex: number
}

// Post list item (frontend view model derived from ContentItem)
export interface PostListItem {
  id: number
  number: number
  title: string
  html_url: string
  views: number
  created_at: string
  labels: { name: string; color?: string | null }[]
}

// Post detail with adjacent navigation
export type AdjacentPost = { number: number; title: string } | null

export type PostDetail = ContentItem & {
  prev: AdjacentPost
  next: AdjacentPost
  total: number
  position: number
}

// Example export for reuse
export type ExampleDto = { id: ID; name: string };

// Footprint
export type { FootprintDto } from './footprint.dto';
// Visit Stats
export type { VisitStatsResponse } from './visit-stats.dto';
