export const GUESTBOOK_ISSUE_NUMBER = 999999;
export const GUESTBOOK_LIMIT = 20;
export const nestApiUrl =
  process.env.NEST_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "http://nest:3200/v2"
    : "http://localhost:3200/v2");

export type GuestbookSearchParams = {
  page?: string;
};

export type GuestbookResponse = {
  data: Array<{
    _id: string;
    externalId?: string;
    nickname: string;
    content: string;
    createdAt: string;
  }>;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
