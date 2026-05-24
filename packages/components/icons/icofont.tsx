import * as React from 'react'

interface IconfontIconProps {
  size?: number
  color?: string
  className?: string
}

const makeIcon = (name: string) => {
  const Icon = ({ size = 16, color, className }: IconfontIconProps) => (
    <i
      className={`iconfont-color ${name}${className ? ` ${className}` : ''}`}
      style={{
        fontSize: size,
        ...(color ? { color } : {}),
      }}
      aria-hidden='true'
    />
  )
  Icon.displayName = `IconfontIcon(${name})`
  return Icon
}

export const IconWechat = makeIcon('iconwechat-circle')
export const IconQQ = makeIcon('iconqq-circle')
export const IconDouban = makeIcon('icondouban-circle')
export const IconWeibo = makeIcon('iconsina-circle')
export const IconMusic = makeIcon('iconwangyiyun')
export const IconEmail = makeIcon('iconemail')
export const IconGithub = makeIcon('icongithub')
export const IconTwitter = makeIcon('icontwitter-circle-fill')
export const IconDiscord = makeIcon('icondiscord')

export const IconClose = makeIcon('iconclose')
export const IconCopy = makeIcon('iconcopy')
export const IconThumbUp = makeIcon('iconlike')
export const IconScrollToTop = makeIcon('iconfanhui')
export const IconArrowLeft = makeIcon('iconarrow-left')
export const IconArrowUp = makeIcon('iconarrow-up')
export const IconArrowBottom = makeIcon('iconarrow-down')
export const IconArrowRight = makeIcon('iconarrow-right1')
export const IconZoomIn = makeIcon('iconminus-circle')
export const IconZoomOut = makeIcon('iconplus-circle')
export const IconRotateRight = makeIcon('iconrotate-right')
export const IconRotateLeft = makeIcon('iconrotate-left')
export const IconDownload = makeIcon('iconarrow-down')
export const IconFullscreen = makeIcon('iconarrows-alt')
export const IconExitFullscreen = makeIcon('iconshrink')
export const IconReset = makeIcon('iconreload')

export const IconLink = makeIcon('iconshared')
export const IconLike = makeIcon('iconlike')