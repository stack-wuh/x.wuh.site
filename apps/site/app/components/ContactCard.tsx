'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Button from '@wuh.site/components/button'
import Image from '@wuh.site/components/image'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

import ImagePreview, { type ImagePreviewItem } from '@wuh.site/components/image-preview'
import { IconGithub, IconTwitter, IconDouban, IconMusic, IconDiscord, IconLogo } from '@wuh.site/components/icons'

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

/** 3D 指针手势定稿参数：倾角 ±12°（设计稿滑杆确认） */
const TILT_DEG = 12

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-base);
`

const Body = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-md);
  align-items: start;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: var(--space-xs);
  }
`

/* 左侧操作区：纸面 + 3D 指针手势
   --rx/--ry/--gx/--gy 由 useEffect 指针跟踪直写 DOM（不经 React state），
   透视 700px、裱框 translateZ(28px) 浮起、光层再 +6px 罩全纸面 */
const ActionArea = styled(Button).attrs({ variant: "outlined", color: "secondary", size: "small" })`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: var(--border-radius-md);
  background: var(--background-200);
  border: 1px solid color-mix(in oklab, var(--normal-300) 35%, transparent);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transform: translateY(var(--ty, 0px)) perspective(700px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transform-style: preserve-3d;
  transition: transform var(--motion-dur-quick) ease-out, box-shadow var(--motion-dur-quick) ease-out;

  /* 错峰入场：落笔（信息区 80ms、提示区 160ms） */
  animation-name: write-fade;
  animation-duration: var(--motion-dur-write);
  animation-timing-function: var(--motion-ease-out-soft);
  animation-fill-mode: both;
  animation-delay: 0ms;

  &:hover {
    --ty: -2px;
    box-shadow: var(--elevation-card);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 4px;
  }

  /* 指针高光：暖金（--accent-color）。纯白高光在 wine light 奶白纸面零对比不可见，
     定稿取 accent 光泽；层深越过裱框（28px+6px）罩全纸面 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      circle at var(--gx, 50%) var(--gy, 38%),
      color-mix(in oklab, var(--accent-color) 55%, transparent),
      color-mix(in oklab, var(--accent-color) 18%, transparent) 42%,
      transparent 62%
    );
    opacity: 0;
    transform: translateZ(34px);
    transition: opacity var(--transition-fast) ease-out;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 0.85;
  }
`

/* 白边裱框：码浮于纸面之上 */
const QrMat = styled.div`
  width: 176px;
  height: 176px;
  padding: 8px;
  background: var(--background-100);
  border-radius: var(--border-radius-sm);
  display: flex;
  transform: translateZ(28px);
`
const QRImage = styled(Image)`
  width: 160px;
  height: 160px;
`

const LinkButton = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--primary-color);
  font-weight: 600;
  transform: translateZ(14px);

  &:hover {
    text-decoration: none;
  }
`

const LinkIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
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
  gap: 6px;
  padding-top: 6px;
  min-width: 0;
  animation: write-fade var(--motion-dur-write) var(--motion-ease-out-soft) both;
  animation-delay: 80ms;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`

const Name = styled.span`
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
`

const Handle = styled.span`
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  letter-spacing: 0.04em;
`

const Role = styled.span`
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin-top: 2px;
`

const Tagline = styled.p`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  color: var(--text-muted);
  line-height: 1.6;
  font-style: italic;
  margin-top: 2px;
`

/* 底部提示 */
const Hints = styled.div`
  display: flex;
  gap: var(--space-base);
  padding-top: 10px;
  border-top: 1px solid color-mix(in oklab, var(--normal-300) 25%, transparent);

  animation: write-fade var(--motion-dur-write) var(--motion-ease-out-soft) both;
  animation-delay: 160ms;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex-direction: column;
    gap: 4px;
  }
`

const Hint = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  line-height: 1.5;
`

const HintDot = styled.span`
  margin-right: 6px;
  color: color-mix(in oklab, var(--primary-color) 60%, transparent);
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
  const actionRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

  // 3D 指针手势：CSS 变量直写 DOM（每帧不触发重渲）；
  // 触屏设备不绑定监听，reduced-motion 停用倾斜（hover 上浮与光泽淡入保留）
  useEffect(() => {
    const el = actionRef.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      el.style.setProperty('--rx', ((0.5 - y) * TILT_DEG * 2).toFixed(2) + 'deg')
      el.style.setProperty('--ry', ((x - 0.5) * TILT_DEG * 2).toFixed(2) + 'deg')
      el.style.setProperty('--gx', (x * 100).toFixed(1) + '%')
      el.style.setProperty('--gy', (y * 100).toFixed(1) + '%')
    }
    const handleLeave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }

    el.addEventListener('pointermove', handleMove)
    el.addEventListener('pointerleave', handleLeave)
    return () => {
      el.removeEventListener('pointermove', handleMove)
      el.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  const hasQR = Boolean(qrSrc)
  const hasLink = Boolean(linkUrl)

  return (
    <>
      <Root>
        <Body>
          <ActionArea
            ref={actionRef}
            type='button'
            as={hasLink ? 'a' : 'button'}
            href={hasLink ? linkUrl : undefined}
            target={hasLink ? '_blank' : undefined}
            rel={hasLink ? 'noopener noreferrer' : undefined}
            aria-label={hasLink ? `前往 ${badge}` : `查看 ${badge} 二维码`}
            onClick={hasQR ? () => setPreviewOpen(true) : undefined}
          >
            {hasQR && (
              <QrMat>
                <QRImage role='qr' src={qrSrc} alt={`${name} 的 ${badge} 二维码`} width={160} height={160} />
              </QrMat>
            )}
            {hasLink && (
              <LinkButton as='span'>
                <LinkIcon>{linkIconMap[badge]}</LinkIcon>
                {linkLabel}
              </LinkButton>
            )}
          </ActionArea>
          <Info>
            <Header>
              <IconLogo width={48} height={29} />
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
