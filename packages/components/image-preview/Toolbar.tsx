import * as React from 'react'
import type { ToolbarRenderProps } from './types'
import {
  IconClose,
  IconArrowLeft,
  IconArrowRight,
  IconZoomIn,
  IconZoomOut,
  IconReset,
  IconRotateRight,
  IconDownload,
  IconFullscreen,
  IconExitFullscreen,
  IconMore,
} from '../icons'
import { Toolbar, IconButton } from './styles'

type Props = ToolbarRenderProps & {
  isMobile: boolean
  onMoreClick: () => void
}

export const ImagePreviewToolbar: React.FC<Props> = (props) => {
  const {
    close, next, previous, zoomIn, zoomOut, resetZoom, rotate,
    toggleFullscreen, download,
    canZoomIn, canZoomOut, isFullscreen,
    isMobile, onMoreClick,
    allowZoom = true, allowRotate = true, allowDownload = true, allowFullscreen = true,
  } = props as Props & { allowZoom?: boolean; allowRotate?: boolean; allowDownload?: boolean; allowFullscreen?: boolean }

  // For type safety, use the original props.allowZoom etc. from ToolbarRenderProps doesn't have these,
  // so we use the destructured values from the parent. The parent passes them via closure.
  // Actually, we receive them as additional props.

  if (isMobile) {
    return (
      <Toolbar>
        <IconButton type='button' aria-label='关闭预览' onClick={close}>
          <IconClose />
        </IconButton>
        <IconButton type='button' aria-label='上一张' onClick={previous}>
          <IconArrowLeft />
        </IconButton>
        <IconButton type='button' aria-label='下一张' onClick={next}>
          <IconArrowRight />
        </IconButton>
        <IconButton type='button' aria-label='更多操作' onClick={onMoreClick}>
          <IconMore />
        </IconButton>
      </Toolbar>
    )
  }

  return (
    <Toolbar>
      <IconButton type='button' aria-label='关闭预览' onClick={close}>
        <IconClose />
      </IconButton>
      <IconButton type='button' aria-label='上一张' onClick={previous}>
        <IconArrowLeft />
      </IconButton>
      <IconButton type='button' aria-label='下一张' onClick={next}>
        <IconArrowRight />
      </IconButton>
      {allowZoom && (
        <>
          <IconButton type='button' aria-label='放大' onClick={zoomIn} disabled={!canZoomIn}>
            <IconZoomIn />
          </IconButton>
          <IconButton type='button' aria-label='缩小' onClick={zoomOut} disabled={!canZoomOut}>
            <IconZoomOut />
          </IconButton>
          <IconButton type='button' aria-label='重置缩放' onClick={resetZoom}>
            <IconReset />
          </IconButton>
        </>
      )}
      {allowRotate && (
        <IconButton type='button' aria-label='旋转图片' onClick={rotate}>
          <IconRotateRight />
        </IconButton>
      )}
      {allowDownload && (
        <IconButton type='button' aria-label='下载图片' onClick={download}>
          <IconDownload />
        </IconButton>
      )}
      {allowFullscreen && (
        <IconButton type='button' aria-label={isFullscreen ? '退出全屏' : '进入全屏'} onClick={toggleFullscreen}>
          {isFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
        </IconButton>
      )}
    </Toolbar>
  )
}

export default ImagePreviewToolbar
