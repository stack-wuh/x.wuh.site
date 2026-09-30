import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import { contentService } from "@wuh.site/core/endpoints";
import type { ContentItem, PostListItem } from "@wuh.site/core";
import { buildPostUrl } from "@/app/lib/slug";
import { buildTopicUrl, decodeTopicParam } from "@/app/lib/topic-url";
import { createCollectionPageStructuredData } from "@/app/lib/structured-data";
import TopicListView from "./TopicListView";
import { PER_PAGE, SITE_URL, SITE_NAME, type TopicPageParams } from "./specs";

const mapContentToPost = (item: ContentItem): PostListItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  views: item.viewCount ?? 0,
  created_at: item.createdAtGitHub || "",
  labels: item.labels.map((label) => ({ name: label })),
});

async function getTopicPosts(label: string) {
  const { data, error } = await contentService.getPosts.server({
    query: {
      page: "1",
      limit: String(PER_PAGE),
      state: "open",
      labels: [label],
    },
    revalidate: 600,
  });

  if (error || !data) {
    return { posts: [] as PostListItem[], total: 0 };
  }

  const result = data as any;
  return {
    posts: (result.data || []).map(mapContentToPost) as PostListItem[],
    total: result.pagination?.total ?? 0,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TopicPageParams>;
}): Promise<Metadata> {
  const { label: rawLabel } = await params;
  const label = decodeTopicParam(rawLabel);
  const title = `${label} 相关文章`;
  const description = `阅读吴尒红（Shadow）与「${label}」相关的文章。`;
  const url = `${SITE_URL}${buildTopicUrl(label)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<TopicPageParams>;
}) {
  const { label: rawLabel } = await params;
  const label = decodeTopicParam(rawLabel);
  const { posts, total } = await getTopicPosts(label);
  const url = `${SITE_URL}${buildTopicUrl(label)}`;
  const collectionJsonLd = createCollectionPageStructuredData({
    url,
    name: `${label} 相关文章`,
    description: `阅读吴尒红（Shadow）与「${label}」相关的文章。`,
    items: posts.map((post) => ({
      name: post.title,
      url: `${SITE_URL}${buildPostUrl(post.number)}`,
    })),
  });

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <TopicListView label={label} posts={posts} total={total} />
    </>
  );
}
