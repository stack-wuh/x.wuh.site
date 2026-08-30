'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { toBlob } from 'html-to-image'
import QRCode from 'qrcode'
import Dialog from '@wuh.site/components/dialog'
import message from '@wuh.site/components/message'
import { IconDownload } from '@wuh.site/components/icons'
import type { ArticleExporterProps } from './specs'
import * as S from './styles'

type Status = 'idle' | 'preparing' | 'generating' | 'ready' | 'error'

const TRANSPARENT_1X1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

export default function ArticleExporter({ open, onClose, data }: ArticleExporterProps) {
  const exportRef = React.useRef<HTMLDivElement>(null)
  const dataRef = React.useRef(data)
  dataRef.current = data
  const [status, setStatus] = React.useState<Status>('idle')
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [imageSize, setImageSize] = React.useState<{ w: number; h: number } | null>(null)
  const [errorMsg, setErrorMsg] = React.useState('')
  const blobUrlRef = React.useRef<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null)
  const [retryKey, setRetryKey] = React.useState(0)

  React.useEffect(() => {
    if (!open) return
    let cancelled = false

    QRCode.toDataURL(data.url, {
      width: 200,
      margin: 1,
      color: { dark: '#2A1E16', light: '#FFFBF8' },
      errorCorrectionLevel: 'M',
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url)
    }).catch(() => {})

    return () => { cancelled = true }
  }, [open, data.url])

  React.useEffect(() => {
    if (!open) return
    let cancelled = false

    setStatus('preparing')
    setPreviewUrl(null)
    setImageSize(null)
    setErrorMsg('')

    const run = async () => {
      await new Promise((r) => setTimeout(r, 80))

      const node = exportRef.current
      if (!node || cancelled) return

      const originalSrcs = new Map<HTMLImageElement, string>()

      try {
        setStatus('generating')

        const imgs = Array.from(node.querySelectorAll<HTMLImageElement>('img[src]:not([src^="data:"])'))
        for (const img of imgs) {
          const src = img.getAttribute('src') || ''
          if (src && !src.startsWith('data:') && !src.startsWith('/api/')) {
            originalSrcs.set(img, src)
            img.src = `/api/image-proxy?url=${encodeURIComponent(src)}`
          }
        }

        await new Promise((r) => setTimeout(r, 200))

        const containerHeight = node.scrollHeight
        const maxRatio = Math.min(2, Math.floor(28000 / Math.max(containerHeight, 1)))
        const pixelRatio = Math.max(1, maxRatio)

        const blob = await toBlob(node, {
          width: 800,
          height: containerHeight || undefined,
          pixelRatio,
          cacheBust: false,
          backgroundColor: '#FFFBF8',
          skipFonts: true,
          imagePlaceholder: TRANSPARENT_1X1,
          onImageErrorHandler: () => {},
          filter: (el) => {
            if (el instanceof HTMLElement && el.classList.contains('copy-btn')) return false
            if (el instanceof HTMLElement && el.classList.contains('anchor')) return false
            return true
          },
        })

        if (cancelled) return
        if (!blob) {
          setErrorMsg('canvas.toBlob 返回空值，可能画布过大')
          setStatus('error')
          return
        }

        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = URL.createObjectURL(blob)
        setPreviewUrl(blobUrlRef.current)

        const img = new Image()
        img.onload = () => {
          if (!cancelled) setImageSize({ w: img.width, h: img.height })
        }
        img.src = blobUrlRef.current

        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        setErrorMsg(err instanceof Error ? err.message : String(err))
        setStatus('error')
      } finally {
        for (const [img, src] of originalSrcs) {
          img.src = src
        }
      }
    }

    const timer = setTimeout(run, 50)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [open, retryKey])

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
    const safeName = data.title.replace(/[^\w\u4e00-\u9fa5-]/g, '').slice(0, 24) || 'article'
    a.download = `wuh.site-${safeName}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    message.success('长图已保存到下载文件夹')
  }

  const handleRetry = () => setRetryKey((k) => k + 1)

  return (
    <>
    <Dialog
      open={open}
      onClose={onClose}
      title='导出全文长图'
      subtitle='将整篇文章保存为一张长图'
      width='min(520px, calc(100vw - 32px))'
      closeOnEsc
      closeOnOverlay
      footer={({ close }) => (
        <S.ActionGroup>
          <S.ActionButton variant='text' color='secondary' size='small' onClick={close}>
            取消
          </S.ActionButton>
          {status === 'ready' && (
            <S.ActionButton
              variant='filled'
              color='primary'
              size='small'
              icon={<IconDownload size={16} />}
              onClick={handleDownload}
            >
              保存图片
            </S.ActionButton>
          )}
        </S.ActionGroup>
      )}
    >
      <S.PreviewWrap>
        {(status === 'preparing' || status === 'generating') && (
          <S.LoadingWrap>
            <S.Spinner />
            <span>
              {status === 'preparing' ? '正在准备文章内容…' : '正在生成长图，文章较长可能需要数秒…'}
            </span>
          </S.LoadingWrap>
        )}
        {status === 'error' && (
          <S.ErrorWrap>
            <span>生成失败</span>
            {errorMsg && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                {errorMsg}
              </span>
            )}
            <S.RetryButton variant='outlined' color='primary' size='small' onClick={handleRetry}>
              重试
            </S.RetryButton>
          </S.ErrorWrap>
        )}
        {status === 'ready' && previewUrl && (
          <>
            <S.PreviewImageWrap>
              <img src={previewUrl} alt='文章长图预览' />
            </S.PreviewImageWrap>
            {imageSize && (
              <S.ImageInfo>
                {imageSize.w} × {imageSize.h} px · PNG
              </S.ImageInfo>
            )}
          </>
        )}
      </S.PreviewWrap>
    </Dialog>

      {open && typeof document !== 'undefined' && createPortal(
      <div style={{ position: 'fixed', top: 0, left: 0, width: 1, height: 1, overflow: 'hidden', opacity: 0, zIndex: -1, pointerEvents: 'none' }}>
      <S.ExportContainer ref={exportRef}>
        <S.ExportHeader>
          {data.cover && (
            <img
              className='export-cover'
              src={data.cover}
              alt={data.coverAlt || data.title}
            />
          )}
          <S.ExportTitle>{data.title}</S.ExportTitle>
          <S.ExportMetaRow>
            {data.authorAvatar && (
              <img
                className='export-avatar'
                src={data.authorAvatar}
                alt={data.authorName}
              />
            )}
            <span>{data.authorName}</span>
            <span>·</span>
            <span>{formatDate(data.createdAt)}</span>
          </S.ExportMetaRow>
          {data.summary && <S.ExportSummary>{data.summary}</S.ExportSummary>}
        </S.ExportHeader>
        <S.ExportBodyWrap>
          <S.ExportBody
            className='markdown-body'
            dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
          />
        </S.ExportBodyWrap>
        <S.ExportFooter>
          {qrDataUrl && <img className='export-qr' src={qrDataUrl} alt='扫码阅读' />}
          <div className='export-footer-info'>
            <div className='export-url'>{data.url}</div>
            <div className='export-colophon'>wuh.site</div>
          </div>
        </S.ExportFooter>
      </S.ExportContainer>
      </div>,
      document.body
    )}
    </>
  )
}
