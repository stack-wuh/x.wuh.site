import type { Metadata } from "next";
import type { WereadBook } from "@wuh.site/core";
import { wereadService } from "@wuh.site/core/endpoints";
import WereadView from "./WereadView";
import { PER_PAGE, SITE_URL, SITE_NAME, type WereadSearchParams } from "./specs";

export const metadata: Metadata = {
  title: "微信读书",
  description: "吴尒红（Shadow）的微信读书书架与阅读记录",
  alternates: { canonical: `${SITE_URL}/weread` },
  openGraph: {
    title: "微信读书",
    description: "吴尒红（Shadow）的微信读书书架与阅读记录",
    url: `${SITE_URL}/weread`,
    siteName: SITE_NAME,
    type: "website",
  },
};

const toPageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw || "1", 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
};

async function getBooks(
  page: number,
): Promise<{
  books: WereadBook[];
  total: number;
  currentPage: number;
  totalPages: number;
}> {
  const { data, error } = await wereadService.getBooks.server({
    query: { page: String(page), limit: String(PER_PAGE) },
    revalidate: 3600,
  });

  if (error || !data) {
    return { books: [], total: 0, currentPage: page, totalPages: 1 };
  }

  const result = data as any;
  return {
    books: (result.data || []) as WereadBook[],
    total: result.pagination?.total || 0,
    currentPage: result.pagination?.page || page,
    totalPages: result.pagination?.totalPages || 1,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams?: WereadSearchParams | Promise<WereadSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = toPageNumber(resolvedSearchParams?.page);
  const { books, total, totalPages } = await getBooks(currentPage);

  return (
    <WereadView
      books={books}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
