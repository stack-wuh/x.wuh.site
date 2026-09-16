'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import LinkGroup from '@wuh.site/components/link-group'
import { IconMusic, IconDiscord } from '@wuh.site/components/icons'
import * as S from '../styles'
import { CONTACT_CONFIG, type ContactType } from '../components/ContactConfig'

const Dialog = dynamic(() => import('@wuh.site/components/dialog'))
const ContactCard = dynamic(() => import('../components/ContactCard'), {
  loading: () => null,
})

/** 渠道钤印字符：中文渠道取通用名首字，拉丁渠道取首字母 */
const SEAL_CHARS: Record<ContactType, string> = {
  wechat: '微',
  qq: 'Q',
  twitter: 'T',
  github: 'G',
  douban: '豆',
  netease: '云',
  discord: 'D',
}

/* 钤印：参照外观入口「墨」印语言——印框 primary 45%、衬线印面、xs 圆角；装饰元素 */
const Seal = styled.span`
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 10px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 45%, transparent);
  border-radius: var(--border-radius-xs);
  color: var(--primary-color);
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-weight: 600;
  line-height: 1;
`

/** 社交链接 + 联系弹窗：唯一持有联系状态的客户端叶子 */
export default function ContactArea() {
  const [activeContact, setActiveContact] = useState<ContactType | null>(null)
  const openContact = useCallback((type: ContactType) => setActiveContact(type), [])
  const closeContact = useCallback(() => setActiveContact(null), [])
  const activeContactConfig = activeContact ? CONTACT_CONFIG[activeContact] : null

  return (
    <>
      <S.SocialRow>
        <LinkGroup
          items={[
            { type: 'wechat', title: '微信', onClick: () => openContact('wechat') },
            { type: 'qq', title: 'QQ', onClick: () => openContact('qq') },
            { type: 'twitter', title: 'Twitter', onClick: () => openContact('twitter') },
            { type: 'email', href: 'mailto:wuh131420@foxmail.com', title: '邮箱', hideOnMobile: true },
            { type: 'github', title: 'GitHub', onClick: () => openContact('github') },
            { type: 'douban', title: '豆瓣', onClick: () => openContact('douban') },
            { type: 'custom', title: '网易云', icon: <IconMusic />, onClick: () => openContact('netease') },
            { type: 'custom', title: 'Discord', icon: <IconDiscord />, onClick: () => openContact('discord') },
          ]}
          size='medium'
        />
      </S.SocialRow>

      <Dialog
        open={Boolean(activeContactConfig)}
        onClose={closeContact}
        variant='paper'
        width='min(640px, calc(100vw - 32px))'
        title={
          activeContact && activeContactConfig ? (
            <>
              <Seal aria-hidden="true">{SEAL_CHARS[activeContact]}</Seal>
              {`${activeContactConfig.badge} 联系`}
            </>
          ) : (
            '联系'
          )
        }
        fullScreen={false}
      >
        {activeContactConfig && <ContactCard {...activeContactConfig} />}
      </Dialog>
    </>
  )
}
