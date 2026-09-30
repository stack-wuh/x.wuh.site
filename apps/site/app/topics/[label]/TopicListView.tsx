"use client";

import Empty from "@wuh.site/components/empty";
import Tag from "@wuh.site/components/tag";
import { IconBookOpen } from "@wuh.site/components/icons";
import { useLocale } from "@wuh.site/components/locales";
import BackHomeLink from "@/app/components/BackHomeLink";
import { buildPostUrl } from "@/app/lib/slug";
import { buildTopicUrl } from "@/app/lib/topic-url";
import { formatShortDate } from "@/app/lib/date";
import * as S from "@/app/blog/styles";
import type { PostListItem } from "@wuh.site/core";

export type TopicListViewProps = {
  label: string;
  posts: PostListItem[];
  total: number;
};

/** 主题文章列表的可见渲染（客户端，文案随 locale）；数据获取留在 page.tsx */
export default function TopicListView({ label, posts, total }: TopicListViewProps) {
  const { t } = useLocale();

  return (
    <S.Root>
      <S.Main>
        <BackHomeLink href='/' />
        <S.Header>
          <S.TitleGroup>
            <S.Title>#{label}</S.Title>
            <S.Subtitle>{t("blog.topic.subtitle", { total })}</S.Subtitle>
          </S.TitleGroup>
        </S.Header>

        {posts.length === 0 ? (
          <Empty
            icon={<IconBookOpen />}
            title={t("blog.topic.emptyTitle")}
            description={t("blog.topic.emptyDescription", { label })}
            actions={[{ label: t("blog.topic.backToBlog"), href: "/blog" }]}
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
                          aria-label={t("blog.topicViewAria", { label: item.name })}
                        >
                          <Tag label={item.name} color={item.color} />
                        </S.PostTagLink>
                      ))}
                    </S.PostTags>
                  )}
                  <S.PostMeta>
                    <span>{formatShortDate(post.created_at)}</span>
                    <S.MetaDot />
                    <span>{t("blog.views", { count: post.views })}</span>
                  </S.PostMeta>
                </S.PostRow>
              ))}
            </S.YearGroup>
          </S.Timeline>
        )}
      </S.Main>
    </S.Root>
  );
}
