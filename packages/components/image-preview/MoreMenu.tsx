'use client'

import * as React from 'react'
import { useLocale } from '@wuh.site/components/locales'
import {
  IconZoomIn,
  IconZoomOut,
  IconReset,
  IconRotate,
  IconDownload,
  IconFullscreen,
  IconExitFullscreen,
} from '../icons'
import { MoreMenuOverlay, MoreMenuContainer, MoreMenuItem } from './styles'

type Props = {
  open: boolean
  allowZoom: boolean
  allowRotate: boolean
  allowDownload: boolean
  allowFullscreen: boolean
  isNativeFullscreen: boolean
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  rotate: () => void
  download: () => void
  toggleFullscreen: () => void
  onClose: () => void
}

export const MoreMenu: React.FC<Props> = ({
  open, allowZoom, allowRotate, allowDownload, allowFullscreen,
  isNativeFullscreen,
  zoomIn, zoomOut, resetZoom, rotate, download, toggleFullscreen,
  onClose,
}) => {
  const { t } = useLocale()
  if (!open) return null

  const select = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <MoreMenuOverlay onClick={onClose}>
      <MoreMenuContainer onClick={(e) => e.stopPropagation()}>
        {allowZoom && (
          <>
            <MoreMenuItem onClick={() => select(zoomIn)}>
              <IconZoomIn /> {t('components.preview.zoomIn')}
            </MoreMenuItem>
            <MoreMenuItem onClick={() => select(zoomOut)}>
              <IconZoomOut /> {t('components.preview.zoomOut')}
            </MoreMenuItem>
            <MoreMenuItem onClick={() => select(resetZoom)}>
              <IconReset /> {t('components.preview.resetZoom')}
            </MoreMenuItem>
          </>
        )}
        {allowRotate && (
          <MoreMenuItem onClick={() => select(rotate)}>
            <IconRotate /> {t('components.preview.rotateShort')}
          </MoreMenuItem>
        )}
        {allowDownload && (
          <MoreMenuItem onClick={() => select(download)}>
            <IconDownload /> {t('components.preview.downloadShort')}
          </MoreMenuItem>
        )}
        {allowFullscreen && (
          <MoreMenuItem onClick={() => select(toggleFullscreen)}>
            {isNativeFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
            {isNativeFullscreen ? t('components.preview.exitFullscreen') : t('components.preview.fullscreen')}
          </MoreMenuItem>
        )}
      </MoreMenuContainer>
    </MoreMenuOverlay>
  )
}

export default MoreMenu
