import { useRouter } from 'next/router'
import { NextSeo, BreadcrumbJsonLd, ArticleJsonLd } from 'next-seo'
import Space from '@/components/space/space'
import Tag from '@/components/tag'
import * as utils from '@/__utils/formatter'
import { usePostContext } from '.'

export type tagType = {
  [key: string]: {
    color: string
    icon: string
  }
}
export const tagTypeMap: tagType = {
  语雀: {
    color: 'yuque',
    icon: 'icon-yuque-fill1',
  },
  github: {
    color: 'github',
    icon: 'icon-github',
  },
}

const Header = () => {
  const data = usePostContext()
  const router = useRouter()
  const { title, origin, update_at, cover_img, sub_title, keywords } = data

  const artUrl = 'https://wuh/site' + router.asPath
  const localeDateString = utils.localDateTimeString(update_at)
  const tagItem = tagTypeMap[origin]

  return (
    <div className="ww_post ww_post__header">
      <NextSeo
        title={`wuh.site -- ${title} · 三思齐身 · wuh.site`}
        description={sub_title}
        openGraph={{
          type: 'article',
          title,
          description: sub_title,
          url: artUrl,
          article: { tags: keywords, publishedTime: localeDateString },
          images: [{ url: cover_img, alt: title, width: 850, height: 650 }],
        }}
      />
      {/* google 结构化优化 */}
      <ArticleJsonLd
        url={artUrl}
        title={title}
        authorName="吴尒红@shadow"
        publisherName="吴尒红"
        publisherLogo="https://src.wuh.site/common/avatar.jpg"
        description={sub_title}
        datePublished={localeDateString}
        images={[cover_img]}
      />
      {/* google 结构化 面包屑 */}
      <BreadcrumbJsonLd
        itemListElements={[
          { position: 1, name: '首页 | Home', item: 'https://wuh.site' },
          { position: 2, name: '文章 | Article', item: artUrl },
        ]}
      />

      <h2 className="ww_post__header--title">{title}</h2>
      <p className="ww_post__header--head">
        <Space style={{ paddingLeft: 0 }} ghost>
          <time>{utils.localDateString(update_at)}</time>
          <span>发布于</span>
          <Tag icon={tagItem.icon} color={tagItem.color}>
            {origin}
          </Tag>
        </Space>
      </p>
    </div>
  )
}

export default Header
