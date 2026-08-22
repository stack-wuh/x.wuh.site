import type { Metadata } from "next";
import { contentService } from "@wuh.site/shared-contracts/endpoints";
import type { ContentItem, PostListItem } from "@wuh.site/shared-contracts";
import BlogListView from "./BlogListView";
import { toLabelParams } from "./blog-filter-utils";
import { PER_PAGE, SITE_URL, SITE_NAME, type BlogSearchParams } from "./specs";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: BlogSearchParams | Promise<BlogSearchParams>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const activeLabels = toLabelParams(resolvedSearchParams?.labels);
  const hasActiveLabels = activeLabels.length > 0;
  const currentPage = toPageNumber(resolvedSearchParams?.page);
  const canonicalPath =
    currentPage > 1 && !hasActiveLabels ? `/blog?page=${currentPage}` : "/blog";
  const description = hasActiveLabels
    ? `阅读吴尒红（Shadow）与「${activeLabels.join("、")}」相关的博客文章。`
    : "阅读吴尒红（Shadow）关于前端工程、开源项目与设计系统的技术文章";
  const robots = hasActiveLabels
    ? { index: false, follow: true }
    : { index: true, follow: true };

  return {
    title: hasActiveLabels ? "博客筛选" : "博客",
    description,
    robots,
    alternates: {
      canonical: hasActiveLabels
        ? `${SITE_URL}/blog`
        : `${SITE_URL}${canonicalPath}`,
    },
    openGraph: {
      title: hasActiveLabels ? "wuh.site 博客筛选" : "wuh.site 博客",
      description,
      url: hasActiveLabels ? `${SITE_URL}/blog` : `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: hasActiveLabels ? "wuh.site 博客筛选" : "wuh.site 博客",
      description,
    },
  };
}

const mapContentToPost = (item: ContentItem): PostListItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  views: item.viewCount ?? 0,
  created_at: item.createdAtGitHub || "",
  labels: item.labels.map((l) => ({ name: l })),
});

const toPageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw || "1", 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
};

async function getIssues(page: number, labels: string[]) {
  const { data, error } = await contentService.getPosts.server({
    query: {
      page: String(page),
      limit: String(PER_PAGE),
      state: "open",
      labels,
    },
    revalidate: 600,
  });

  if (error || !data) {
    return {
      posts: [] as PostListItem[],
      pagination: {
        currentPage: page,
        lastPage: page,
        hasPrev: page > 1,
        hasNext: false,
        total: 0,
      },
    };
  }

  const result = data as any;
  const { pagination } = result;
  return {
    posts: result.data.map(mapContentToPost) as PostListItem[],
    pagination: {
      currentPage: pagination.page,
      lastPage: pagination.totalPages,
      hasPrev: pagination.hasPreviousPage,
      hasNext: pagination.hasNextPage,
      total: pagination.total,
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams?: BlogSearchParams | Promise<BlogSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = toPageNumber(resolvedSearchParams?.page);
  const activeLabels = toLabelParams(resolvedSearchParams?.labels);
  const { posts, pagination } = await getIssues(currentPage, activeLabels);

  return (
    <BlogListView
      posts={posts}
      pagination={pagination}
      activeLabels={activeLabels}
      availableLabels={[]}
    />
  );
}
