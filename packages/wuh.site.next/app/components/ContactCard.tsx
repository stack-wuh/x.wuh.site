'use client'

import { useMemo, useState } from 'react'
import styled from 'styled-components'

import ImagePreview, { type ImagePreviewItem } from '@wuh.site/components/image-preview'

export type ContactCardProps = {
  badge?: string
  qrSrc: string
  name: string
  handle: string
  title: string
  tagline: string
  hints?: string[]
  cardGradient?: string
  borderColor?: string
  hintColor?: string
}

const Card = styled.div<{ cardGradient?: string; borderColor?: string }>`
  width: min(729px, 100%);
  padding: var(--space-xl);
  border-radius: 36px;
  background: ${(p) => p.cardGradient ?? 'linear-gradient(180deg, rgba(124, 77, 255, 0.18), rgba(15, 23, 42, 0.95))'};
  border: 1px solid ${(p) => p.borderColor ?? 'rgba(148, 163, 184, 0.45)'};
  box-shadow: 0 28px 65px rgba(2, 6, 23, 0.6);
  backdrop-filter: blur(32px);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 12px;
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    pointer-events: none;
  }

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.12);
  }
`

const Badge = styled.span`
  align-self: flex-end;
  font-size: var(--font-size-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.35);
  font-weight: 600;
`

const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--space-lg);
  align-items: center;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`

const NameBlock = styled.div`
  min-width: 0;
`

const Name = styled.p`
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
`

const Handle = styled.span`
  font-size: var(--font-size-sm);
  color: #d1d5db;
  letter-spacing: 0.14em;
  display: block;
`

const Title = styled.span`
  font-size: var(--font-size-md);
  color: var(--text-secondary);
`

const Tagline = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  color: #cbd5f5;
  max-width: 280px;
`

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: radial-gradient(circle at 10% 10%, #ffffff, #a855f7, #2563eb);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.08em;
  display: grid;
  place-items: center;
  font-size: 1.4rem;
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.35);
`

const QRTrigger = styled.button`
  width: 240px;
  height: 240px;
  border-radius: 28px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 22px 40px rgba(15, 23, 42, 0.42);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 26px 48px rgba(15, 23, 42, 0.5);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-400);
    outline-offset: 4px;
  }
`

const QRImage = styled.img`
  width: 226px;
  height: 226px;
  object-fit: cover;
  border-radius: 24px;
`

const HintGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Hint = styled.p<{ hintColor?: string }>`
  margin: 0;
  font-size: var(--font-size-xs);
  color: ${(p) => p.hintColor ?? '#dbeafe'};
  text-align: left;
  line-height: 1.4;
`

const ContactCard = ({
  badge = 'WeChat',
  qrSrc,
  name,
  handle,
  title,
  tagline,
  hints = [],
  cardGradient,
  borderColor,
  hintColor,
}: ContactCardProps) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)

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
  const [previewIndex, setPreviewIndex] = useState(0)

  const handlePreviewOpen = () => {
    if (previewItems.length === 0) return
    setPreviewIndex(0)
    setPreviewOpen(true)
  }

  const handlePreviewClose = () => setPreviewOpen(false)
  const handleIndexChange = (nextIndex: number) => setPreviewIndex(nextIndex)

  return (
    <>
      <Card cardGradient={cardGradient} borderColor={borderColor}>
        <Badge>{badge}</Badge>
        <Body>
          <Info>
            <InfoHeader>
              <Avatar aria-hidden='true'>{initials || 'W'}</Avatar>
              <NameBlock>
                <Name>{name}</Name>
                <Handle>{handle}</Handle>
              </NameBlock>
            </InfoHeader>
            <Title>{title}</Title>
            <Tagline>{tagline}</Tagline>
          </Info>
          <QRTrigger type='button' aria-label={`查看 ${name} 的 ${badge} 二维码`} onClick={handlePreviewOpen}>
            {qrSrc && <QRImage src={qrSrc} alt={`${name} 的 ${badge} 二维码`} />}
          </QRTrigger>
        </Body>
        <HintGroup>
          {(hints.length > 0 ? hints : [
            `扫描二维码即可启动 1:1 交流`,
            '备注「官网来访」将更快通过',
          ]).map((hint, index) => (
          <Hint key={index} hintColor={hintColor}>
            {hint}
          </Hint>
          ))}
        </HintGroup>
      </Card>
      {previewItems.length > 0 && (
        <ImagePreview
          items={previewItems}
          open={previewOpen}
          currentIndex={previewIndex}
          onClose={handlePreviewClose}
          onIndexChange={handleIndexChange}
          allowDownload={false}
        />
      )}
    </>
  )
}

export default ContactCard
