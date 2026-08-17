'use client'

import * as React from 'react'
import { IconWechat, IconQQ, IconWeibo, IconTwitter, IconEmail, IconLink, IconCopy } from '../icons'
import * as S from './styles'
import type { ShareItem, ShareType, SharedLinkGroupProps } from './specs'

export type { ShareItem, ShareType, SharedLinkGroupProps, SharedLinkGroupSize } from './specs'

const getPresetIcon = (type: ShareType) => {
  switch (type) {
    case 'wechat':
      return <IconWechat />
    case 'qq':
      return <IconQQ />
    case 'weibo':
      return <IconWeibo />
    case 'twitter':
      return <IconTwitter />
    case 'email':
      return <IconEmail />
    case 'link':
      return <IconLink />
    case 'copy':
      return <IconCopy />
    default:
      return null
  }
}

const SharedLinkGroup: React.FC<SharedLinkGroupProps> = ({
  items,
  size = 'medium',
  gap = 12,
  label = '分享到'
}) => {
  const handleClick = (item: ShareItem) => {
    if (item.onClick) {
      item.onClick()
    }
  }

  return (
    <S.SContainer>
      {label && <S.SLabel>{label}</S.SLabel>}
      <S.SGroup $gap={gap}>
        {items.map((item) => {
          const icon = item.icon ?? getPresetIcon(item.type)
          const hasLink = !!item.href || !!item.onClick

          return (
            <div key={`${item.type}-${item.title || ''}`} style={{ position: 'relative' }}>
              {item.href ? (
                <S.SLink href={item.href} target='_blank' rel='noopener noreferrer' aria-label={item.title ?? item.type}>
                  <S.SShareButton $size={size} $hasLink={hasLink} aria-label={item.title ?? item.type}>
                    <S.SIcon aria-hidden='true'>{icon}</S.SIcon>
                    {item.title && <S.STitle>{item.title}</S.STitle>}
                  </S.SShareButton>
                </S.SLink>
              ) : (
                <S.SShareButton
                  $size={size}
                  $hasLink={hasLink}
                  onClick={() => handleClick(item)}
                  aria-label={item.title ?? item.type}
                >
                  <S.SIcon aria-hidden='true'>{icon}</S.SIcon>
                  {item.title && <S.STitle>{item.title}</S.STitle>}
                </S.SShareButton>
              )}
            </div>
          )
        })}
      </S.SGroup>
    </S.SContainer>
  )
}

export default SharedLinkGroup
