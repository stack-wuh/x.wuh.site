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
export const IconMusic = makeIcon('iconmusic-on-white-copy')
export const IconEmail = makeIcon('iconemail')
export const IconGithub = makeIcon('icongithub')
export const IconTwitter = makeIcon('icontwitter-circle-fill')
export const IconDiscord = makeIcon('icondiscord')

export const IconClose = makeIcon('iconclose')
export const IconDownload = makeIcon('icondownload')
export const IconCopy = makeIcon('iconcopy')
export const IconThumbUp = makeIcon('iconlike')
export const IconScrollToTop = makeIcon('iconfanhui')
export const IconArrowRight = makeIcon('iconarrow-right')
