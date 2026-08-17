'use client'

import * as React from 'react'
import { IconWechat, IconQQ, IconTwitter, IconEmail, IconGithub, IconDouban } from '../icons'
import * as S from './styles'
import type { LinkGroupProps, LinkType } from './specs'

export type { LinkGroupProps, LinkGroupSize, LinkItem, LinkType } from './specs'

const getPresetIcon = (type: LinkType) => {
  switch (type) {
    case 'wechat':
      return <IconWechat />
    case 'qq':
      return <IconQQ />
    case 'twitter':
      return <IconTwitter />
    case 'email':
      return <IconEmail />
    case 'github':
      return <IconGithub />
    case 'douban':
      return <IconDouban />
    default:
      return null
  }
}

const LinkGroup: React.FC<LinkGroupProps> = ({ items, size = 'medium', gap = 12 }) => {
  return (
    <S.SGroup $gap={gap} role='list'>
      {items.map((item) => {
        const icon = item.icon ?? getPresetIcon(item.type)
        const label = item.title ?? item.type

        return (
          <S.SItem key={`${item.type}-${label}`} role='listitem' $hideOnMobile={item.hideOnMobile}>
            {item.href ? (
              <S.SLink
                $size={size}
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={label}
              >
                <S.SIcon aria-hidden='true'>{icon}</S.SIcon>
                {item.title && <S.STitle>{item.title}</S.STitle>}
              </S.SLink>
            ) : (
              <S.SControl
                $size={size}
                type='button'
                onClick={item.onClick}
                aria-label={label}
              >
                <S.SIcon aria-hidden='true'>{icon}</S.SIcon>
                {item.title && <S.STitle>{item.title}</S.STitle>}
              </S.SControl>
            )}
          </S.SItem>
        )
      })}
    </S.SGroup>
  )
}

export default LinkGroup
