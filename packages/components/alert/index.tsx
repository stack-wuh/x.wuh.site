'use client'

import * as React from 'react'

import SharedLinkGroup, { type ShareItem } from '../shared-link-group'
import Tag from '../tag'
import {
  AlertContainer,
  CloseButton,
  Copyright,
  Head,
  HeadContent,
  IconBadge,
  LabelLink,
  LabelList,
  LabelSection,
  MetaGrid,
  MetaItem,
  MetaLabel,
  MetaLink,
  MetaValue,
  ShareWrap,
  Summary,
  Title,
  TitleWrap,
  type AlertVariant,
} from './styles'

type DateInput = string | number | Date

export type AlertLink = {
  label: string
  href: string
}

export type AlertLabel = {
  name: string
  color?: string | null
  href: string
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  variant?: AlertVariant
  framed?: boolean
  showHeader?: boolean
  title?: React.ReactNode
  summary?: React.ReactNode
  icon?: React.ReactNode
  updatedAt?: DateInput | null
  sourceLink?: AlertLink
  projectLink?: AlertLink
  labels?: AlertLabel[]
  copyright?: React.ReactNode
  shareItems?: ShareItem[]
  shareLabel?: string
  closable?: boolean
  onClose?: () => void
}

const formatDateTimeToMinute = (value?: DateInput | null) => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

const Alert = React.forwardRef<HTMLElement, AlertProps>(function Alert(props, ref) {
  const {
    variant = 'info',
    framed = true,
    showHeader = true,
    title = '冗余信息',
    summary = '以下为文章补充说明，便于转载与继续阅读。',
    icon,
    updatedAt,
    sourceLink,
    projectLink,
    labels,
    copyright,
    shareItems,
    shareLabel = '分享文章',
    closable = false,
    onClose,
    role,
    className,
    children,
    'aria-live': ariaLiveProp,
    ...rest
  } = props

  const resolvedRole = role ?? (variant === 'warning' || variant === 'error' ? 'alert' : 'status')
  const resolvedAriaLive = ariaLiveProp ?? (resolvedRole === 'alert' ? 'assertive' : 'polite')
  const formattedUpdatedAt = formatDateTimeToMinute(updatedAt)
  const shouldRenderHeader = showHeader && (title || summary || icon || closable)

  return (
    <AlertContainer
      ref={ref}
      $variant={variant}
      $framed={framed}
      role={resolvedRole}
      aria-live={resolvedAriaLive}
      className={className}
      {...rest}
    >
      {shouldRenderHeader ? (
        <Head>
          <HeadContent>
            <IconBadge aria-hidden='true'>{icon ?? 'i'}</IconBadge>
            <TitleWrap>
              {title ? <Title>{title}</Title> : null}
              {summary ? <Summary>{summary}</Summary> : null}
            </TitleWrap>
          </HeadContent>
          {closable ? (
            <CloseButton type='button' onClick={onClose} aria-label='关闭提示'>
              ×
            </CloseButton>
          ) : null}
        </Head>
      ) : null}

      <MetaGrid>
        {formattedUpdatedAt ? (
          <MetaItem>
            <MetaLabel>更新时间</MetaLabel>
            <MetaValue>{formattedUpdatedAt}</MetaValue>
          </MetaItem>
        ) : null}

        {sourceLink ? (
          <MetaItem>
            <MetaLabel>文档原链接</MetaLabel>
            <MetaLink href={sourceLink.href} target='_blank' rel='noopener noreferrer'>
              {sourceLink.label}
            </MetaLink>
          </MetaItem>
        ) : null}

        {projectLink ? (
          <MetaItem>
            <MetaLabel>所属 Project</MetaLabel>
            <MetaLink href={projectLink.href} target='_blank' rel='noopener noreferrer'>
              {projectLink.label}
            </MetaLink>
          </MetaItem>
        ) : null}
      </MetaGrid>

      {labels?.length ? (
        <LabelSection>
          <MetaLabel>文档标签</MetaLabel>
          <LabelList>
            {labels.map((label) => (
              <LabelLink key={`${label.name}-${label.href}`} href={label.href} target='_blank' rel='noopener noreferrer'>
                <Tag label={label.name} color={label.color} />
              </LabelLink>
            ))}
          </LabelList>
        </LabelSection>
      ) : null}

      {copyright ? <Copyright>{copyright}</Copyright> : null}

      {shareItems?.length ? (
        <ShareWrap>
          <SharedLinkGroup items={shareItems} label={shareLabel} />
        </ShareWrap>
      ) : null}

      {children}
    </AlertContainer>
  )
})

export type { AlertVariant } from './styles'
export type { ShareItem }

export default Alert
