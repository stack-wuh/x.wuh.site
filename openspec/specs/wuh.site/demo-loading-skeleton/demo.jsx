// ============================================
// 加载骨架屏 — 文章卡片 loading 态
// import 路径：
//   Skeleton → @wuh.site/components/skeleton
//   Card     → @wuh.site/components/card
//   Column   → @wuh.site/components/flex
// ============================================

import Skeleton from '@wuh.site/components/skeleton'
import { Column } from '@wuh.site/components/flex'

export function PostCardSkeleton() {
  return (
    <Column gap={12} padding={16}>
      {/* 封面图占位 */}
      <Skeleton variant="rect" width="100%" height={200} radius={12} />
      {/* 标题占位 */}
      <Skeleton variant="text" width="65%" height={22} />
      {/* 摘要占位 — 多行 */}
      <Skeleton variant="text" width="100%" height={14} />
      <Skeleton variant="text" width="85%" height={14} />
      {/* 标签占位 */}
      <Skeleton variant="text" width={120} height={24} radius={4} />
    </Column>
  )
}
