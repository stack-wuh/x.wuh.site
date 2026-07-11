// ============================================
// 只读展示标签 — 文章分类/主题标识
// import 路径：
//   Tag    → @wuh.site/components/tag
//   Row    → @wuh.site/components/flex
// ============================================

import Tag from '@wuh.site/components/tag'
import { Row } from '@wuh.site/components/flex'

export function PostTags({ tags }) {
  return (
    <Row gap={8} wrap>
      {tags.map((t) => (
        <Tag key={t.name} label={t.name} color={t.color} />
      ))}
    </Row>
  )
}
