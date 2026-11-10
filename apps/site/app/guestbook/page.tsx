import { redirect } from "next/navigation";
import { Metadata } from "next";
import GuestbookPageView from "./GuestbookPageView";
import {
  GUESTBOOK_ISSUE_NUMBER,
  GUESTBOOK_LIMIT,
  nestApiUrl,
  type GuestbookResponse,
  type GuestbookSearchParams,
} from "./specs";

export const metadata: Metadata = {
  // 根 layout 的 title.template 会补站点后缀（`%s · SITE_NAME`）——这里只给短标题，
  // 手写全称会被二次拼接成「留言板 - wuh.site · wuh.site」（P1-17）
  title: "留言板",
  description: "在吴尒红（Shadow）的个人站留下足迹，分享想法与问候。",
  robots: { index: false, follow: true },
};

function clampPage(raw: unknown): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export default async function GuestbookPage({
  searchParams,
}: {
  searchParams: Promise<GuestbookSearchParams>;
}) {
  const params = await searchParams;
  const page = clampPage(params?.page);

  const url = `${nestApiUrl}/comments?issueNumber=${GUESTBOOK_ISSUE_NUMBER}&page=${page}&limit=${GUESTBOOK_LIMIT}`;

  // 后端抖动降级为空态（与 blog/weread/music 的降级约定一致），不再整页 500（P1-18）；
  // SSR fetch 显式超时护栏，nest 挂起时不无限等待
  let data: GuestbookResponse | null = null;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    data = await res.json();
  } catch {
    data = null;
  }

  const totalPages = data?.pagination.totalPages || 1;

  // 越界页码归一到第 1 页（降级空态无分页语义，跳过归一）
  if (data && page > totalPages && totalPages > 0) {
    redirect("/guestbook?page=1");
  }

  const comments = (data?.data ?? []).map((item) => ({
    id: String(item.externalId || item._id),
    nickname: item.nickname,
    content: item.body,
    createdAt: item.createdAt,
  }));

  return (
    <GuestbookPageView
      comments={comments}
      pagination={
        data?.pagination ?? {
          total: 0,
          totalPages: 1,
          page,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      }
      currentPage={page}
    />
  );
}
