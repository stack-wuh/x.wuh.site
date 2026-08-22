import type { AdminUserDto, ContentItem, PaginatedResult } from '@wuh.site/core';

export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface AdminComment {
  _id: string;
  externalId: string;
  nickname: string;
  email?: string;
  body?: string;
  content?: string;
  page?: string;
  repo?: 'guestbook' | 'blog' | string;
  issueNumber?: number;
  status?: CommentStatus;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  createdAtGitHub?: string;
  updatedAtGitHub?: string;
}

export interface AdminOverview {
  posts: number;
  guestbookComments: number;
  pendingPostComments: number;
}

export type AdminPostsResponse = PaginatedResult<ContentItem>;
export type AdminCommentsResponse = PaginatedResult<AdminComment>;
export type AdminUsersResponse = AdminUserDto[];
