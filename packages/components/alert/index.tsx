'use client'

import * as React from 'react'

import SharedLinkGroup, { type ShareItem } from '../shared-link-group'
import Tag from '../tag'
import {
  AlertContainer,
  CloseButton,
  Head,
  HeadContent,
  IconBadge,
  LabelLink,
  LabelList,
  MetaGrid,
  MetaItem,
  MetaLabel,
  MetaLabelIcon,
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
  updatedBy?: string
  updatedByLink?: string
  sourceLink?: AlertLink
  projectLink?: AlertLink
  labels?: AlertLabel[]
  license?: React.ReactNode
  /** @deprecated 使用 `license` 代替 */
  copyright?: React.ReactNode
  shareItems?: ShareItem[]
  shareLabel?: string
  closable?: boolean
  onClose?: () => void
}

const pad = (value: number) => value.toString().padStart(2, '0')

const formatDateTimeToSecond = (value?: DateInput | null) => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const ClockIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <circle cx='12' cy='12' r='8' />
    <path d='M12 8v5l3 2' />
  </svg>
)

const LinkIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M10 13a5 5 0 0 0 7.1 0l2.1-2.1a5 5 0 1 0-7.1-7.1L10.7 5' />
    <path d='M14 11a5 5 0 0 0-7.1 0L4.8 13.1a5 5 0 1 0 7.1 7.1L13.3 19' />
  </svg>
)

const FolderIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z' />
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z' />
    <path d='M9.5 12.5l1.8 1.8 3.7-3.7' />
  </svg>
)

const TagIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M20 13l-7 7-9-9V4h7l9 9z' />
    <circle cx='7.5' cy='7.5' r='1.5' />
  </svg>
)

const Alert = React.forwardRef<HTMLElement, AlertProps>(function Alert(props, ref) {
  const {
    variant = 'info',
    framed = true,
    showHeader = true,
    title = '冗余信息',
    summary = '以下为文章补充说明，便于转载与继续阅读。',
    icon,
    updatedAt,
    updatedBy,
    updatedByLink,
    sourceLink,
    projectLink,
    labels,
    license,
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
  const formattedUpdatedAt = formatDateTimeToSecond(updatedAt)
  const shouldRenderHeader = showHeader && (title || summary || icon || closable)
  const resolvedLicense = license ?? copyright
  const updatedMessageTitle = formattedUpdatedAt
    ? updatedBy
      ? `由 ${updatedBy} 于 ${formattedUpdatedAt} 更新`
      : `于 ${formattedUpdatedAt} 更新`
    : null

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
            <MetaLabel>
              <MetaLabelIcon>
                <ClockIcon />
              </MetaLabelIcon>
              更新时间:
            </MetaLabel>
            <MetaValue as='div' title={updatedMessageTitle ?? undefined}>
              {updatedBy ? (
                <>
                  由{' '}
                  {updatedByLink ? (
                    <LabelLink
                      href={updatedByLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      title={`访问 ${updatedBy} 的 GitHub 主页`}
                    >
                      <Tag label={updatedBy} />
                    </LabelLink>
                  ) : (
                    <Tag label={updatedBy} />
                  )}
                  {' '}于 {formattedUpdatedAt} 更新
                </>
              ) : (
                `于 ${formattedUpdatedAt} 更新`
              )}
            </MetaValue>
          </MetaItem>
        ) : null}

        {sourceLink ? (
          <MetaItem>
            <MetaLabel>
              <MetaLabelIcon>
                <LinkIcon />
              </MetaLabelIcon>
              原文链接:
            </MetaLabel>
            <MetaLink href={sourceLink.href} target='_blank' rel='noopener noreferrer' title={sourceLink.label}>
              {sourceLink.label}
            </MetaLink>
          </MetaItem>
        ) : null}

        {projectLink ? (
          <MetaItem>
            <MetaLabel>
              <MetaLabelIcon>
                <FolderIcon />
              </MetaLabelIcon>
              所属项目:
            </MetaLabel>
            <MetaLink href={projectLink.href} target='_blank' rel='noopener noreferrer' title={projectLink.label}>
              {projectLink.label}
            </MetaLink>
          </MetaItem>
        ) : null}

        {resolvedLicense ? (
          <MetaItem>
            <MetaLabel>
              <MetaLabelIcon>
                <ShieldIcon />
              </MetaLabelIcon>
              开源许可:
            </MetaLabel>
            <MetaValue title={typeof resolvedLicense === 'string' ? resolvedLicense : undefined}>{resolvedLicense}</MetaValue>
          </MetaItem>
        ) : null}

        {labels?.length ? (
          <MetaItem>
            <MetaLabel>
              <MetaLabelIcon>
                <TagIcon />
              </MetaLabelIcon>
              所属标签:
            </MetaLabel>
            <LabelList aria-label='文档标签'>
              {labels.map((label) => (
                <LabelLink key={`${label.name}-${label.href}`} href={label.href} target='_blank' rel='noopener noreferrer' title={label.name}>
                  <Tag label={label.name} color={label.color} />
                </LabelLink>
              ))}
            </LabelList>
          </MetaItem>
        ) : null}
      </MetaGrid>

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
