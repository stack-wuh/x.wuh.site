import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import Empty from "@wuh.site/components/empty";
import Tag from "@wuh.site/components/tag";
import { IconBookOpen } from "@wuh.site/components/icons";
import { contentService } from "@wuh.site/core/endpoints";
import type { ContentItem, PostListItem } from "@wuh.site/core";
import BackHomeLink from "@/app/components/BackHomeLink";
import { buildPostUrl } from "@/app/lib/slug";
import { buildTopicUrl, decodeTopicParam } from "@/app/lib/topic-url";
import { formatShortDate } from "@/app/lib/date";
import { createCollectionPageStructuredData } from "@/app/lib/structured-data";
import * as S from "@/app/blog/styles";
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
      <S.Root>
        <S.Main>
          <BackHomeLink href='/' />
          <S.Header>
            <S.TitleGroup>
              <S.Title>#{label}</S.Title>
              <S.Subtitle>
                共 {total} 篇相关文章，按发布时间展示最新内容。
              </S.Subtitle>
            </S.TitleGroup>
          </S.Header>

          {posts.length === 0 ? (
            <Empty
              icon={<IconBookOpen />}
              title="暂无相关文章"
              description={`还没有与「${label}」相关的文章`}
              actions={[{ label: "返回博客", href: "/blog" }]}
            />
          ) : (
            <S.Timeline>
              <S.YearGroup>
                <S.YearLabel>Topic</S.YearLabel>
                {posts.map((post) => (
                  <S.PostRow key={post.id}>
                    <S.InkDot />
                    <S.PostTitleLink
                      href={buildPostUrl(post.number)}
                    >
                      <span>{post.title}</span>
                    </S.PostTitleLink>
                    {post.labels?.length > 0 && (
                      <S.PostTags>
                        {post.labels.slice(0, 3).map((item) => (
                          <S.PostTagLink
                            key={`${post.id}-${item.name}`}
                            href={buildTopicUrl(item.name)}
                            aria-label={`查看 ${item.name} 主题文章`}
                          >
                            <Tag label={item.name} color={item.color} />
                          </S.PostTagLink>
                        ))}
                      </S.PostTags>
                    )}
                    <S.PostMeta>
                      <span>{formatShortDate(post.created_at)}</span>
                      <S.MetaDot />
                      <span>{post.views} 浏览</span>
                    </S.PostMeta>
                  </S.PostRow>
                ))}
              </S.YearGroup>
            </S.Timeline>
          )}
        </S.Main>
      </S.Root>
    </>
  );
}
