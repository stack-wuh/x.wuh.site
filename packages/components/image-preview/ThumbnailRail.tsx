import * as React from 'react'
import type { ImagePreviewItem, ThumbnailRenderProps } from './specs'
import { ThumbnailRail, ThumbnailButton, ThumbLabel } from './styles'

type Props = {
  items: ImagePreviewItem[]
  currentIndex: number
  goTo: (index: number) => void
  renderThumbnail?: (props: ThumbnailRenderProps) => React.ReactNode
}

export const ImagePreviewThumbnails: React.FC<Props> = ({
  items, currentIndex, goTo, renderThumbnail,
}) => {
  if (!items.length) return null

  return (
    <ThumbnailRail>
      {items.map((item, index) => {
        if (renderThumbnail) {
          return (
            <div key={item.id ?? item.src} onClick={() => goTo(index)} role='button' aria-label={`预览第 ${index + 1} 张`}>
              {renderThumbnail({ item, index, active: index === currentIndex })}
            </div>
          )
        }
        return (
          <ThumbnailButton key={item.id ?? item.src ?? index} type='button' $active={index === currentIndex} onClick={() => goTo(index)}>
            <img src={item.thumbnailSrc ?? item.src} alt={item.alt ?? `预览 ${index + 1}`} loading='lazy' />
            {item.title && <ThumbLabel>{item.title}</ThumbLabel>}
          </ThumbnailButton>
        )
      })}
    </ThumbnailRail>
  )
}

export default ImagePreviewThumbnails
