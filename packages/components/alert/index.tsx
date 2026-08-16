'use client'

import * as React from 'react'

import SharedLinkGroup from '../shared-link-group'
import Tag from '../tag'
import { IconClock, IconLink, IconFolder, IconShield, IconTag } from '../icons'
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
import type { AlertProps } from './specs'

type DateInput = string | number | Date


const isExternalHref = (href: string) => /^https?:\/\//i.test(href)

const pad = (value: number) => value.toString().padStart(2, '0')

const formatDateTimeToSecond = (value?: DateInput | null) => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
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
                <IconClock />
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
                <IconLink />
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
                <IconFolder />
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
                <IconShield />
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
                <IconTag />
              </MetaLabelIcon>
              所属标签:
            </MetaLabel>
            <LabelList aria-label='文档标签'>
              {labels.map((label) => (
                <LabelLink key={`${label.name}-${label.href}`} href={label.href} target={isExternalHref(label.href) ? '_blank' : undefined} rel={isExternalHref(label.href) ? 'noopener noreferrer' : undefined} title={label.name}>
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
export type { AlertLabel, AlertLink, AlertProps } from './specs'
export type { ShareItem } from '../shared-link-group'

export default Alert
