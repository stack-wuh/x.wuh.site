// ============================================
// 纯图标按钮 — 工具栏/操作栏
// import 路径：
//   Button  → @wuh.site/components/button
//   Row     → @wuh.site/components/flex
// ============================================

import Button from '@wuh.site/components/button'
import { Row } from '@wuh.site/components/flex'
import { Heart, Share2, Bookmark, MoreHorizontal } from 'lucide-react'

export function PostActionBar() {
  return (
    <Row gap={4} alignItems="center">
      <Button variant="text" color="primary" size="small" aria-label="点赞">
        <Heart size={18} />
      </Button>
      <Button variant="text" color="primary" size="small" aria-label="分享">
        <Share2 size={18} />
      </Button>
      <Button variant="text" color="primary" size="small" aria-label="收藏">
        <Bookmark size={18} />
      </Button>
      <Button variant="text" color="secondary" size="small" aria-label="更多">
        <MoreHorizontal size={18} />
      </Button>
    </Row>
  )
}
