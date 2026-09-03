'use client'

import * as React from 'react'
import {
  X, Copy, ThumbsUp, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  ZoomIn, ZoomOut, RotateCw, RotateCcw, Maximize, Minimize, RefreshCw, Link, Download
} from 'lucide-react'
import { useIconfontLoadState } from './iconfont-context'
import WechatFallback from './fallbacks/wechat'
import QQFallback from './fallbacks/qq'
import DoubanFallback from './fallbacks/douban'
import WeiboFallback from './fallbacks/weibo'
import NeteaseMusicFallback from './fallbacks/netease-music'
import DiscordFallback from './fallbacks/discord'
import GithubFallback from './fallbacks/github'
import TwitterFallback from './fallbacks/twitter'
import EmailFallback from './fallbacks/email'

interface IconfontIconProps {
  size?: number
  color?: string
  className?: string
}

type FallbackComponent = React.FC<{ size: number; className?: string }>

/** 将 lucide 图标包装为 fallback 签名，忽略 color */
const lucideFallback = (Icon: React.FC<{ size?: number; className?: string }>): FallbackComponent => {
  const Wrapped: FallbackComponent = ({ size, className }) => (
    <Icon size={size} className={className} aria-hidden="true" />
  )
  return Wrapped
}

const makeIcon = (
  name: string,
  Fallback?: FallbackComponent,
  /** outline：恒用描边 fallback，不被 iconfont 字体 glyph（实心风格）覆盖 */
  options?: { outline?: boolean }
) => {
  const Icon = ({ size = 16, color, className }: IconfontIconProps) => {
    const loadState = useIconfontLoadState()

    if (loadState === 'loaded' && !options?.outline) {
      return (
        <i
          className={`iconfont-color ${name}${className ? ` ${className}` : ''}`}
          style={{ fontSize: size, ...(color ? { color } : {}) }}
          aria-hidden='true'
        />
      )
    }

    if (Fallback) {
      return <Fallback size={size} className={className} />
    }

    return null
  }
  Icon.displayName = `IconfontIcon(${name})`
  return Icon
}

// 品牌/社交图标 — 恒用 SVG outline fallback（iconfont 中的品牌 glyph 为实心风格，与全站描边语言冲突）
export const IconWechat = makeIcon('iconwechat-circle', WechatFallback, { outline: true })
export const IconQQ = makeIcon('iconqq-circle', QQFallback, { outline: true })
export const IconDouban = makeIcon('icondouban-circle', DoubanFallback, { outline: true })
export const IconWeibo = makeIcon('iconsina-circle', WeiboFallback, { outline: true })
export const IconMusic = makeIcon('iconwangyiyun', NeteaseMusicFallback, { outline: true })
export const IconEmail = makeIcon('iconemail', EmailFallback, { outline: true })
export const IconGithub = makeIcon('icongithub', GithubFallback, { outline: true })
export const IconTwitter = makeIcon('icontwitter-circle-fill', TwitterFallback, { outline: true })
export const IconDiscord = makeIcon('icondiscord', DiscordFallback, { outline: true })

// UI/操作图标 — lucide-react fallback
export const IconClose = makeIcon('iconclose', lucideFallback(X))
export const IconCopy = makeIcon('iconcopy', lucideFallback(Copy))
export const IconThumbUp = makeIcon('iconlike', lucideFallback(ThumbsUp))
export const IconScrollToTop = makeIcon('iconfanhui', lucideFallback(ChevronUp))
export const IconArrowLeft = makeIcon('iconarrow-left', lucideFallback(ChevronLeft))
export const IconArrowUp = makeIcon('iconarrow-up', lucideFallback(ChevronUp))
export const IconArrowBottom = makeIcon('iconarrow-down', lucideFallback(ChevronDown))
export const IconArrowRight = makeIcon('iconarrow-right1', lucideFallback(ChevronRight))
export const IconZoomIn = makeIcon('iconminus-circle', lucideFallback(ZoomIn))
export const IconZoomOut = makeIcon('iconplus-circle', lucideFallback(ZoomOut))
export const IconRotateRight = makeIcon('iconrotate-right', lucideFallback(RotateCw))
export const IconRotateLeft = makeIcon('iconrotate-left', lucideFallback(RotateCcw))
export const IconDownload = makeIcon('iconarrow-down', lucideFallback(Download))
export const IconFullscreen = makeIcon('iconarrows-alt', lucideFallback(Maximize))
export const IconExitFullscreen = makeIcon('iconshrink', lucideFallback(Minimize))
export const IconReset = makeIcon('iconreload', lucideFallback(RefreshCw))
export const IconLink = makeIcon('iconshared', lucideFallback(Link))
export const IconLike = makeIcon('iconlike', lucideFallback(ThumbsUp))
