import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type ImagePreviewItem, type ImagePreviewProps } from '@wuh.site/components/image-preview'
import { useImagePreview } from '@wuh.site/hooks/useImagePreview'
import { useLocale } from '@wuh.site/components/locales'

type PreviewProps = Pick<
  ImagePreviewProps,
  | 'items'
  | 'open'
  | 'currentIndex'
  | 'onOpenChange'
  | 'onIndexChange'
  | 'onClose'
  | 'showThumbnails'
  | 'enableLoop'
  | 'allowDownload'
  | 'hint'
>

export const usePostImagePreview = (bodyHtml?: string) => {
  const { t } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const [previewItems, setPreviewItems] = useState<ImagePreviewItem[]>([])
  const preview = useImagePreview({
    loop: true,
    itemCount: previewItems.length,
  })
  const { openPreview, open: previewOpen, index: previewIndex, closePreview, setIndex } = preview

  const decorateAndCollectImages = useCallback(() => {
    const root = containerRef.current
    if (!root) return [] as ImagePreviewItem[]

    const images = root.querySelectorAll<HTMLImageElement>('.markdown-body img')
    const collected: ImagePreviewItem[] = []

    images.forEach((image) => {
      const src = image.getAttribute('src')?.trim()
      if (!src) return

      const alt = image.getAttribute('alt')?.trim() || undefined
      const title = image.getAttribute('title')?.trim() || undefined
      const nextIndex = collected.length
      const fallbackAria = t('post.preview.imageAria', { n: nextIndex + 1 })

      collected.push({
        id: image.getAttribute('data-sourcepos') ?? `${src}-${nextIndex}`,
        src,
        alt,
        title,
        description: title ?? alt,
      })

      image.dataset.previewIndex = String(nextIndex)
      image.setAttribute('tabindex', '0')
      image.setAttribute('role', 'button')
      image.setAttribute('aria-label', title ?? alt ?? fallbackAria)

      const wrapperLink = image.closest('a')
      if (wrapperLink) {
        wrapperLink.dataset.previewIndex = String(nextIndex)
        wrapperLink.setAttribute('aria-label', title ?? alt ?? fallbackAria)
        const currentHref = wrapperLink.getAttribute('href')
        if (currentHref && !wrapperLink.dataset.originalHref) {
          wrapperLink.dataset.originalHref = currentHref
        }
        wrapperLink.removeAttribute('href')
        wrapperLink.removeAttribute('target')
        wrapperLink.removeAttribute('rel')
        wrapperLink.setAttribute('role', 'button')
        wrapperLink.setAttribute('tabindex', '0')
      }
    })

    return collected
  }, [t])

  const openPreviewByTarget = useCallback(
    (target: EventTarget | null) => {
      const element = target instanceof HTMLElement ? target : null
      if (!element) return false

      const previewNode = element.closest<HTMLElement>('[data-preview-index]')
      if (previewNode) {
        const indexValue = Number(previewNode.dataset.previewIndex)
        if (Number.isInteger(indexValue)) {
          openPreview(indexValue)
          return true
        }
      }

      const imageNode = element.closest('.markdown-body img') as HTMLImageElement | null
      if (!imageNode) return false

      const root = containerRef.current
      if (!root) return false
      const images = Array.from(root.querySelectorAll<HTMLImageElement>('.markdown-body img'))
      const fallbackIndex = images.findIndex((img) => img === imageNode)
      if (fallbackIndex < 0) return false

      openPreview(fallbackIndex)
      return true
    },
    [openPreview]
  )

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const copyLabel = t('post.preview.copy')
    const copiedLabel = t('post.preview.copied')
    const failedLabel = t('post.preview.copyFailed')

    const pres = root.querySelectorAll('article pre')
    pres.forEach((pre) => {
      let btn = pre.querySelector<HTMLButtonElement>('.copy-btn')
      if (!btn) {
        btn = document.createElement('button')
        btn.className = 'copy-btn'
        btn.setAttribute('type', 'button')
        pre.appendChild(btn)
      }
      const button = btn
      button.textContent = copyLabel
      button.onclick = async () => {
        const code = pre.querySelector('code')?.textContent || ''
        try {
          await navigator.clipboard.writeText(code)
          button.textContent = copiedLabel
          setTimeout(() => {
            button.textContent = copyLabel
          }, 1500)
        } catch {
          button.textContent = failedLabel
          setTimeout(() => {
            button.textContent = copyLabel
          }, 1500)
        }
      }
    })

    setPreviewItems(decorateAndCollectImages())
  }, [bodyHtml, decorateAndCollectImages, t])

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const handleClick = (event: MouseEvent) => {
      if (openPreviewByTarget(event.target)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      if (openPreviewByTarget(event.target)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    root.addEventListener('click', handleClick, true)
    root.addEventListener('keydown', handleKeydown, true)

    return () => {
      root.removeEventListener('click', handleClick, true)
      root.removeEventListener('keydown', handleKeydown, true)
    }
  }, [bodyHtml, openPreviewByTarget])

  const previewProps = useMemo<PreviewProps>(
    () => ({
      items: previewItems,
      open: previewOpen,
      currentIndex: previewIndex,
      onOpenChange: (nextOpen) => {
        if (nextOpen) {
          openPreview()
          return
        }
        closePreview()
      },
      onIndexChange: (nextIndex) => setIndex(nextIndex),
      onClose: closePreview,
      showThumbnails: previewItems.length > 1,
      enableLoop: previewItems.length > 1,
      allowDownload: false,
      hint: t('post.preview.hint'),
    }),
    [closePreview, openPreview, previewIndex, previewItems, previewOpen, setIndex, t]
  )

  return {
    containerRef,
    previewProps,
  }
}
