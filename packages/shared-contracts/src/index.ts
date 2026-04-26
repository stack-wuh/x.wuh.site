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

// Example export for reuse
export type ExampleDto = { id: ID; name: string };
