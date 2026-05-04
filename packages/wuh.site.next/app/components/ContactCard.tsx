'use client'

import { useMemo, useState } from 'react'
import styled from 'styled-components'

import ImagePreview, { type ImagePreviewItem } from '@wuh.site/components/image-preview'

export type ContactCardProps = {
  badge: string
  name: string
  handle: string
  title: string
  tagline: string
  hints?: string[]
  /** 二维码图片 URL（微信/QQ 模式） */
  qrSrc?: string
  /** 跳转链接（Twitter/GitHub 模式） */
  linkUrl?: string
  /** 跳转按钮文案 */
  linkLabel?: string
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`

const Body = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-xl);
  align-items: start;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: var(--space-md);
  }
`

/* 左侧操作区 */
const ActionArea = styled.button`
  width: 200px;
  height: 200px;
  border-radius: var(--radius-card);
  background: var(--background-200);
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--elevation-card);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 4px;
  }

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 40%, transparent);
  }
`

const QRImage = styled.img`
  width: 184px;
  height: 184px;
  object-fit: cover;
  border-radius: calc(var(--radius-card) - 4px);
`

const LinkButton = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--primary-color);
  font-weight: 600;

  &:hover {
    text-decoration: none;
  }
`

const LinkIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--primary-color);

  svg {
    width: 100%;
    height: 100%;
  }
`

/* 右侧信息区 */
const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-top: 4px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`

const Avatar = styled.img`
  width: 48px;
  height: auto;
  border-radius: 4px;
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    filter: invert(1);
  }
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Name = styled.span`
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
`

const Handle = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  letter-spacing: 0.04em;
`

const Role = styled.span`
  font-size: var(--font-size-md);
  color: var(--text-secondary);
`

const Tagline = styled.p`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  color: var(--text-muted);
  line-height: 1.6;
  font-style: italic;
`

/* 底部提示 */
const Hints = styled.div`
  display: flex;
  gap: var(--space-md);
  padding-top: var(--space-xs);
  border-top: 1px solid color-mix(in oklab, var(--normal-300) 25%, transparent);

  @media (prefers-color-scheme: dark) {
    border-top-color: color-mix(in oklab, var(--normal-700) 25%, transparent);
  }

  @media (max-width: 560px) {
    flex-direction: column;
    gap: 4px;
  }
`

const Hint = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  line-height: 1.4;
`

const HintDot = styled.span`
  margin-right: 6px;
  opacity: 0.4;
`

/* ====== Component ====== */

const ContactCard = ({
  badge,
  name,
  handle,
  title,
  tagline,
  hints = [],
  qrSrc,
  linkUrl,
  linkLabel,
}: ContactCardProps) => {
  const previewItems = useMemo<ImagePreviewItem[]>(() => {
    if (!qrSrc) return []
    return [
      {
        src: qrSrc,
        alt: `${name} 的 ${badge} 二维码`,
        title: `${name} · ${badge} 二维码`,
        description: tagline,
      },
    ]
  }, [qrSrc, name, badge, tagline])

  const [previewOpen, setPreviewOpen] = useState(false)

  const hasQR = Boolean(qrSrc)
  const hasLink = Boolean(linkUrl)

  return (
    <>
      <Root>
        <Body>
          <ActionArea
            type='button'
            as={hasLink ? 'a' : 'button'}
            href={hasLink ? linkUrl : undefined}
            target={hasLink ? '_blank' : undefined}
            rel={hasLink ? 'noopener noreferrer' : undefined}
            aria-label={hasLink ? `前往 ${badge}` : `查看 ${badge} 二维码`}
            onClick={hasQR ? () => setPreviewOpen(true) : undefined}
          >
            {hasQR && <QRImage src={qrSrc} alt={`${name} 的 ${badge} 二维码`} />}
            {hasLink && (
              <LinkButton as='span'>
                <LinkIcon>
                  {badge === 'GitHub' ? (
                    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                      <path d='M12 .8A11.2 11.2 0 0 0 .8 12c0 5 3.3 9.3 7.8 10.8.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.6-1.4-1.5-1.8-1.5-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 .7 2 .7 1.1 1.9 2.9 1.4 3.6 1.1.1-.8.4-1.4.8-1.7-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.7.1-3.4 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C18.9 6.1 20 6.4 20 6.4c.6 1.7.2 3.1.1 3.4.8.9 1.2 2 1.2 3.3 0 4.6-2.7 5.5-5.3 5.8.5.4.9 1.3.9 2.6v3.8c0 .3.2.7.8.6A11.2 11.2 0 0 0 23.2 12 11.2 11.2 0 0 0 12 .8z' />
                    </svg>
                  ) : (
                    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                      <path d='M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.8-2.2-.8.5-1.7.8-2.6 1-1.6-1.7-4.4-1.4-5.7.6-1 1.4-.8 3.3.4 4.4-2.8-.1-5.4-1.5-7.1-3.7-.9 1.6-.4 3.8 1.2 4.9-.6 0-1.2-.2-1.7-.5 0 1.7 1.2 3.3 3 3.6-.5.1-1 .2-1.6.1.5 1.5 2 2.6 3.7 2.6-1.7 1.3-3.8 2-5.9 2-.4 0-.8 0-1.2-.1 2.2 1.4 4.8 2.1 7.4 2.1 7.9 0 12.3-6.7 12-12.5.8-.6 1.5-1.3 2-2.1z' />
                    </svg>
                  )}
                </LinkIcon>
                {linkLabel}
              </LinkButton>
            )}
          </ActionArea>
          <Info>
            <Header>
              <Avatar src='/logo.svg' alt='wuh.site' />
              <NameBlock>
                <Name>{name}</Name>
                <Handle>{handle}</Handle>
              </NameBlock>
            </Header>
            <Role>{title}</Role>
            <Tagline>{tagline}</Tagline>
          </Info>
        </Body>
        {hints.length > 0 && (
          <Hints>
            {hints.map((hint, i) => (
              <Hint key={i}>
                <HintDot>·</HintDot>
                {hint}
              </Hint>
            ))}
          </Hints>
        )}
      </Root>
      {hasQR && previewItems.length > 0 && (
        <ImagePreview
          items={previewItems}
          open={previewOpen}
          currentIndex={0}
          onClose={() => setPreviewOpen(false)}
          onOpenChange={(open) => setPreviewOpen(open)}
          onIndexChange={() => {}}
          allowDownload={false}
        />
      )}
    </>
  )
}

export default ContactCard
