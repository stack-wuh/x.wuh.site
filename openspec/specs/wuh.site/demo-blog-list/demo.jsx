// ============================================
// 博客列表中的文章卡片
// import 路径：
//   Card → @wuh.site/components/card
// ============================================

import Card from '@wuh.site/components/card'
import Image from 'next/image'
import Tag from '@wuh.site/components/tag'
import { Row } from '@wuh.site/components/flex'

export function BlogPostCard({ post }) {
  return (
    <Card variant="elevated" elevation={1} interactive>
      <Card.Content>
        {post.cover && (
          <Image
            src={post.cover}
            alt={post.title}
            width={400}
            height={225}
            style={{ borderRadius: 8, objectFit: 'cover', width: '100%' }}
          />
        )}
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        {post.tags?.length > 0 && (
          <Row gap={6} wrap>
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </Row>
        )}
      </Card.Content>
    </Card>
  )
}
