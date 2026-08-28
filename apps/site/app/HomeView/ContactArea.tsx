'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import LinkGroup from '@wuh.site/components/link-group'
import { IconMusic, IconDiscord } from '@wuh.site/components/icons'
import * as S from '../styles'
import { CONTACT_CONFIG, type ContactType } from '../components/ContactConfig'

const Dialog = dynamic(() => import('@wuh.site/components/dialog'))
const ContactCard = dynamic(() => import('../components/ContactCard'), {
  loading: () => null,
})

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
        title={activeContactConfig ? `${activeContactConfig.badge} 联系` : '联系'}
        fullScreen={false}
        width='min(760px, calc(100vw - 32px))'
      >
        {activeContactConfig && <ContactCard {...activeContactConfig} />}
      </Dialog>
    </>
  )
}
