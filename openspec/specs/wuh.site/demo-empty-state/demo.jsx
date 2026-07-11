// ============================================
// 空状态占位 — 搜索无结果
// import 路径：
//   Empty  → @wuh.site/components/empty
// ============================================

import Empty from '@wuh.site/components/empty'
import { SearchX } from 'lucide-react'

export function NoSearchResults({ query, onReset }) {
  return (
    <Empty
      icon={<SearchX size={24} />}
      title="没有找到相关文章"
      description={`关键词 "${query}" 没有匹配结果，试试其他关键词。`}
      actions={[{ label: '清除筛选', variant: 'outlined', onClick: onReset }]}
    />
  )
}
