import * as React from 'react'
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
              <IconZoomIn /> 放大
            </MoreMenuItem>
            <MoreMenuItem onClick={() => select(zoomOut)}>
              <IconZoomOut /> 缩小
            </MoreMenuItem>
            <MoreMenuItem onClick={() => select(resetZoom)}>
              <IconReset /> 重置缩放
            </MoreMenuItem>
          </>
        )}
        {allowRotate && (
          <MoreMenuItem onClick={() => select(rotate)}>
            <IconRotate /> 旋转
          </MoreMenuItem>
        )}
        {allowDownload && (
          <MoreMenuItem onClick={() => select(download)}>
            <IconDownload /> 下载
          </MoreMenuItem>
        )}
        {allowFullscreen && (
          <MoreMenuItem onClick={() => select(toggleFullscreen)}>
            {isNativeFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
            {isNativeFullscreen ? '退出全屏' : '全屏'}
          </MoreMenuItem>
        )}
      </MoreMenuContainer>
    </MoreMenuOverlay>
  )
}

export default MoreMenu
