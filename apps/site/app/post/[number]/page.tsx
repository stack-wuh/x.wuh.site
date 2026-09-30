import { cache } from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { contentService } from "@wuh.site/core/endpoints";
import { renderMarkdown } from "../../lib/markdown";
import {
  buildArticleDescription,
  buildArticleMetadata,
  getArticleCategory,
  getArticleImage,
  getArticleKeywords,
  getArticleWordCount,
} from "../../lib/seo";
import { buildPostUrl, extractPostNumber, isCanonicalPostPath } from "../../lib/slug";
import type { ContentItem } from "@wuh.site/core";
import type { Issue } from "../PostView.types";
import PostView from "../PostView";
import JsonLd from "../../components/JsonLd";
import {
  createArticleStructuredData,
  createBreadcrumbStructuredData,
} from "../../lib/structured-data";
import {
  SITE_URL,
  type IssueData,
  type PostPageParams,
} from "./specs";

const mapContentToIssue = (item: ContentItem): Issue => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/stack-wuh/blog/issues/${item.number}`,
  repository_url: "https://api.github.com/repos/stack-wuh/blog",
  comments: item.comments,
  viewCount: item.viewCount ?? 0,
  likeCount: item.likeCount ?? 0,
  liked: item.liked ?? false,
  created_at: item.createdAtGitHub || "",
  updated_at: item.updatedAtGitHub || item.createdAtGitHub || "",
  user: item.author
    ? {
        login: item.author.login,
        userName: item.author.login,
        avatarUrl: item.author.avatarUrl || null,
      }
    : null,
  labels: item.labels.map((l) => ({ name: l })),
  body: item.body || "",
  body_html: item.bodyHtml || "",
  metadata: item.metadata
    ? {
        cover: item.metadata.cover || null,
        coverAlt: item.metadata.coverAlt || null,
        summary: item.metadata.summary || null,
        slug: item.metadata.slug || null,
        keywords: item.metadata.keywords || null,
        extra: item.metadata.extra || undefined,
      }
    : null,
});

const ensureRenderedBody = async (issue: Issue): Promise<string> => {
  if (issue.body?.trim()) return renderMarkdown(issue.body);
  if (issue.body_html?.trim()) return issue.body_html;
  throw new Error(`Post ${issue.number} has no renderable body`);
};

const getIssue = cache(async (num: string): Promise<IssueData> => {
  const { data, error } = await contentService.getPost.server({
    params: { slug: num },
    revalidate: 3600,
  });

  if (error || !data) {
    // 上游明确返回 404：文章不存在，走 notFound()；其余（网络异常/5xx/空响应）属
    // 上游故障，抛错交由 error.tsx 返回 500，避免把真实故障伪装成 404 误伤收录
    if (error?.status === 404) {
      return { issue: null, prev: null, next: null, total: 0, position: 0 };
    }
    throw new Error(
      `Post upstream fetch failed for ${num}: ${error?.message ?? "empty response"}`,
    );
  }

  const content = data as any;
  const issue = mapContentToIssue(content);

  // 已删除/已关闭 Issue 的陈旧同步记录 body 与 body_html 双空，无正文可渲染——
  // 与上游 404 同路径收敛为 notFound()，避免渲染期抛错演变成 500
  if (!issue.body?.trim() && !issue.body_html?.trim()) {
    return { issue: null, prev: null, next: null, total: 0, position: 0 };
  }

  issue.body_html = await ensureRenderedBody(issue);
  return {
    issue,
    prev: content.prev
      ? { number: content.prev.number, title: content.prev.title }
      : null,
    next: content.next
      ? { number: content.next.number, title: content.next.title }
      : null,
    total: content.total,
    position: content.position,
  };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<PostPageParams>;
}): Promise<Metadata> {
  const { number: raw } = await params;
  const number = extractPostNumber(raw) ?? raw;
  const { issue } = await getIssue(number);

  if (!issue) {
    notFound();
  }

  return buildArticleMetadata(issue) as Metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<PostPageParams>;
}) {
  const { number: raw } = await params;
  const number = extractPostNumber(raw) ?? raw;
  const {
    issue,
    prev: prevIssue,
    next: nextIssue,
    total,
    position,
  } = await getIssue(number);
  if (!issue) notFound();

  if (!isCanonicalPostPath(raw, issue.number)) {
    permanentRedirect(buildPostUrl(issue.number));
  }

  const url = `${SITE_URL}${buildPostUrl(issue.number)}`;
  const image = getArticleImage(issue);
  const category = getArticleCategory(issue);
  const articleJsonLd = createArticleStructuredData({
    url,
    title: issue.title,
    description: buildArticleDescription(issue),
    publishedAt: issue.created_at,
    modifiedAt: issue.updated_at,
    image: image.url,
    imageAlt: image.alt,
    keywords: getArticleKeywords(issue),
    labels: category ? [category] : issue.labels.map((label) => label.name),
    wordCount: getArticleWordCount(issue),
  });
  const breadcrumbJsonLd = createBreadcrumbStructuredData([
    { name: "首页", url: SITE_URL },
    { name: "博客", url: `${SITE_URL}/blog` },
    { name: issue.title, url },
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PostView
        issue={issue}
        prevIssue={prevIssue}
        nextIssue={nextIssue}
        total={total}
        position={position}
      />
    </>
  );
}
