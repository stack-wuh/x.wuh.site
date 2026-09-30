'use client'

import * as React from 'react'
import { useLocale } from '@wuh.site/components/locales'
import type { ToolbarRenderProps } from './specs'
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
  const { t } = useLocale()
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
        <IconButton type='button' aria-label={t('components.preview.close')} onClick={close}>
          <IconClose />
        </IconButton>
        <IconButton type='button' aria-label={t('components.preview.previous')} onClick={previous}>
          <IconArrowLeft />
        </IconButton>
        <IconButton type='button' aria-label={t('components.preview.next')} onClick={next}>
          <IconArrowRight />
        </IconButton>
        <IconButton type='button' aria-label={t('components.preview.more')} onClick={onMoreClick}>
          <IconMore />
        </IconButton>
      </Toolbar>
    )
  }

  return (
    <Toolbar>
      <IconButton type='button' aria-label={t('components.preview.close')} onClick={close}>
        <IconClose />
      </IconButton>
      <IconButton type='button' aria-label={t('components.preview.previous')} onClick={previous}>
        <IconArrowLeft />
      </IconButton>
      <IconButton type='button' aria-label={t('components.preview.next')} onClick={next}>
        <IconArrowRight />
      </IconButton>
      {allowZoom && (
        <>
          <IconButton type='button' aria-label={t('components.preview.zoomIn')} onClick={zoomIn} disabled={!canZoomIn}>
            <IconZoomIn />
          </IconButton>
          <IconButton type='button' aria-label={t('components.preview.zoomOut')} onClick={zoomOut} disabled={!canZoomOut}>
            <IconZoomOut />
          </IconButton>
          <IconButton type='button' aria-label={t('components.preview.resetZoom')} onClick={resetZoom}>
            <IconReset />
          </IconButton>
        </>
      )}
      {allowRotate && (
        <IconButton type='button' aria-label={t('components.preview.rotate')} onClick={rotate}>
          <IconRotateRight />
        </IconButton>
      )}
      {allowDownload && (
        <IconButton type='button' aria-label={t('components.preview.download')} onClick={download}>
          <IconDownload />
        </IconButton>
      )}
      {allowFullscreen && (
        <IconButton
          type='button'
          aria-label={isFullscreen ? t('components.preview.exitFullscreen') : t('components.preview.enterFullscreen')}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
        </IconButton>
      )}
    </Toolbar>
  )
}

export default ImagePreviewToolbar
