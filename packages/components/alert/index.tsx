'use client'

import * as React from 'react'
import { useLocale } from '@wuh.site/components/locales'

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
import type { AlertProps } from './types'

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
    title,
    summary,
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
    shareLabel,
    closable = false,
    onClose,
    role,
    className,
    children,
    'aria-live': ariaLiveProp,
    ...rest
  } = props

  const { t } = useLocale()
  const resolvedTitle = title ?? t('components.alert.defaultTitle')
  const resolvedSummary = summary ?? t('components.alert.defaultSummary')
  const resolvedShareLabel = shareLabel ?? t('components.alert.shareLabel')

  const resolvedRole = role ?? (variant === 'warning' || variant === 'error' ? 'alert' : 'status')
  const resolvedAriaLive = ariaLiveProp ?? (resolvedRole === 'alert' ? 'assertive' : 'polite')
  const formattedUpdatedAt = formatDateTimeToSecond(updatedAt)
  const shouldRenderHeader = showHeader && (resolvedTitle || resolvedSummary || icon || closable)
  const resolvedLicense = license ?? copyright
  const updatedMessageTitle = formattedUpdatedAt
    ? updatedBy
      ? t('components.alert.updatedByTitle', { by: updatedBy, time: formattedUpdatedAt })
      : t('components.alert.updatedAtTitle', { time: formattedUpdatedAt })
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
              {resolvedTitle ? <Title>{resolvedTitle}</Title> : null}
              {resolvedSummary ? <Summary>{resolvedSummary}</Summary> : null}
            </TitleWrap>
          </HeadContent>
          {closable ? (
            <CloseButton type='button' onClick={onClose} aria-label={t('components.alert.closeNotice')}>
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
              {t('components.alert.updatedAtLabel')}
            </MetaLabel>
            <MetaValue as='div' title={updatedMessageTitle ?? undefined}>
              {updatedBy ? (
                <>
                  {updatedByLink ? (
                    <LabelLink
                      href={updatedByLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      title={t('components.alert.githubProfileTitle', { by: updatedBy })}
                    >
                      <Tag label={updatedBy} />
                    </LabelLink>
                  ) : (
                    <Tag label={updatedBy} />
                  )}
                  {' '}{t('components.alert.updatedAt', { time: formattedUpdatedAt })}
                </>
              ) : (
                t('components.alert.updatedAt', { time: formattedUpdatedAt })
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
              {t('components.alert.sourceLinkLabel')}
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
              {t('components.alert.projectLabel')}
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
              {t('components.alert.licenseLabel')}
            </MetaLabel>
            <MetaValue $wrap title={typeof resolvedLicense === 'string' ? resolvedLicense : undefined}>{resolvedLicense}</MetaValue>
          </MetaItem>
        ) : null}

        {labels?.length ? (
          <MetaItem>
            <MetaLabel>
              <MetaLabelIcon>
                <IconTag />
              </MetaLabelIcon>
              {t('components.alert.labelsLabel')}
            </MetaLabel>
            <LabelList aria-label={t('components.alert.labelsAria')}>
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
          <SharedLinkGroup items={shareItems} label={resolvedShareLabel} />
        </ShareWrap>
      ) : null}

      {children}
    </AlertContainer>
  )
})

export type { AlertVariant } from './styles'
export type { AlertLabel, AlertLink, AlertProps } from './types'
export type { ShareItem } from '../shared-link-group'

export default Alert
