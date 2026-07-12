'use client'

import { useMemo, useState } from 'react'
import styled from '@wuh.site/components/styled'
import Button from '@wuh.site/components/button'

import ImagePreview, { type ImagePreviewItem } from '@wuh.site/components/image-preview'
import { IconGithub, IconTwitter, IconDouban, IconMusic, IconDiscord } from '@wuh.site/components/icons'

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
const ActionArea = styled(Button).attrs({ variant: "outlined", color: "secondary", size: "small" })`
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

/* ====== Icons ====== */

const linkIconMap: Record<string, React.ReactNode> = {
  GitHub: <IconGithub />,
  Twitter: <IconTwitter />,
  '豆瓣': <IconDouban />,
  '网易云': <IconMusic />,
  Discord: <IconDiscord />,
}

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
                <LinkIcon>{linkIconMap[badge]}</LinkIcon>
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
