// ============================================
// 图片画廊 — ImagePreview + useImagePreview
// import 路径：
//   ImagePreview     → @wuh.site/components/image-preview
//   useImagePreview  → packages/hooks/useImagePreview
//   Button           → @wuh.site/components/button
// ============================================

'use client'

import ImagePreview from '@wuh.site/components/image-preview'
import { useImagePreview } from 'packages/hooks/useImagePreview'

const GALLERY_ITEMS = [
  { src: '/images/photo-1.jpg', alt: '风景 1', title: '日落' },
  { src: '/images/photo-2.jpg', alt: '风景 2', title: '山峰' },
  { src: '/images/photo-3.jpg', alt: '风景 3', title: '海岸' },
]

export function Gallery({ items = GALLERY_ITEMS }) {
  const preview = useImagePreview({ itemCount: items.length })

  return (
    <>
      {items.map((item, idx) => (
        <button key={idx} onClick={() => preview.openPreview(idx)}>
          <img src={item.src} alt={item.alt} width={200} height={150} />
        </button>
      ))}

      <ImagePreview
        {...preview.bind}
        items={items}
        enableLoop
        showThumbnails
        allowZoom
      />
    </>
  )
}
