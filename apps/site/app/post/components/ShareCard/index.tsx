'use client'

import * as React from 'react'
import Dialog from '@wuh.site/components/dialog'
import message from '@wuh.site/components/message'
import { useLocale } from '@wuh.site/components/locales'
import { IconDownload } from '@wuh.site/components/icons'
import { drawShareCard, type ShareCardTexts } from './canvas'
import type { ShareCardProps } from './specs'
import * as S from './styles'

type Status = 'idle' | 'loading' | 'ready' | 'error'

export default function ShareCard({ open, onClose, data }: ShareCardProps) {
  const { t } = useLocale()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const dataRef = React.useRef(data)
  dataRef.current = data
  const textsRef = React.useRef<ShareCardTexts>({ scanToRead: '', viewsMeta: '' })
  textsRef.current = {
    scanToRead: t('post.shareCard.scanToRead'),
    viewsMeta: (data.viewCount ?? 0) > 0 ? t('post.shareCard.views', { n: data.viewCount as number }) : '',
  }
  const [status, setStatus] = React.useState<Status>('idle')
  const [errorMsg, setErrorMsg] = React.useState('')
  const blobUrlRef = React.useRef<string | null>(null)
  const [retryKey, setRetryKey] = React.useState(0)

  React.useEffect(() => {
    if (!open) return
    let cancelled = false

    setStatus('loading')
    setErrorMsg('')

    const run = async () => {
      const canvas = canvasRef.current
      if (!canvas || cancelled) return
      try {
        await drawShareCard(canvas, dataRef.current, textsRef.current)
        if (cancelled) return
        canvas.toBlob((blob) => {
          if (cancelled) return
          if (!blob) {
            setErrorMsg(t('post.shareCard.taintedCanvas'))
            setStatus('error')
            return
          }
          if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
          blobUrlRef.current = URL.createObjectURL(blob)
          setStatus('ready')
        }, 'image/png')
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : String(err))
          setStatus('error')
        }
      }
    }

    const timer = setTimeout(run, 50)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [open, retryKey, t])

  React.useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [])

  const handleDownload = () => {
    if (!blobUrlRef.current) return
    const a = document.createElement('a')
    a.href = blobUrlRef.current
    const safeName = data.title.replace(/[^\w\u4e00-\u9fa5-]/g, '').slice(0, 24) || 'post'
    a.download = `wuh.site-${safeName}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    message.success(t('post.shareCard.saved'))
  }

  const handleShare = async () => {
    if (!blobUrlRef.current) return
    try {
      const res = await fetch(blobUrlRef.current)
      const blob = await res.blob()
      const file = new File([blob], 'wuh.site-share.png', { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: data.title,
          text: data.summary || '',
          files: [file],
        })
      } else {
        handleDownload()
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      handleDownload()
    }
  }

  const handleRetry = () => setRetryKey((k) => k + 1)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('post.shareCard.title')}
      subtitle={t('post.shareCard.subtitle')}
      width='min(380px, calc(100vw - 32px))'
      closeOnEsc
      closeOnOverlay
      footer={({ close }) => (
        <S.ActionGroup>
          <S.ActionButton variant='text' color='secondary' size='small' onClick={close}>
            {t('post.shareCard.cancel')}
          </S.ActionButton>
          {status === 'ready' && (
            <>
              <S.ActionButton
                variant='outlined'
                color='secondary'
                size='small'
                onClick={handleShare}
              >
                {t('post.shareCard.share')}
              </S.ActionButton>
              <S.ActionButton
                variant='filled'
                color='primary'
                size='small'
                icon={<IconDownload size={16} />}
                onClick={handleDownload}
              >
                {t('post.shareCard.save')}
              </S.ActionButton>
            </>
          )}
        </S.ActionGroup>
      )}
    >
      <S.PreviewWrap>
        {status === 'loading' && (
          <S.LoadingWrap>
            <S.Spinner />
            <span>{t('post.shareCard.generating')}</span>
          </S.LoadingWrap>
        )}
        {status === 'error' && (
          <S.ErrorWrap>
            <span>{t('post.shareCard.failed')}</span>
            {errorMsg && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                {errorMsg}
              </span>
            )}
            <S.RetryButton variant='outlined' color='primary' size='small' onClick={handleRetry}>
              {t('post.shareCard.retry')}
            </S.RetryButton>
          </S.ErrorWrap>
        )}
        <S.CanvasPreview ref={canvasRef} $hidden={status !== 'ready'} />
      </S.PreviewWrap>
    </Dialog>
  )
}
