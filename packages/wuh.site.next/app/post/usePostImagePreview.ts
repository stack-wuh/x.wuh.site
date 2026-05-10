import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type ImagePreviewItem, type ImagePreviewProps } from '@wuh.site/components/image-preview'
import { useImagePreview } from '@wuh.site/hooks/useImagePreview'

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
      image.setAttribute('aria-label', title ?? alt ?? `预览第 ${nextIndex + 1} 张图片`)

      const wrapperLink = image.closest('a')
      if (wrapperLink) {
        wrapperLink.dataset.previewIndex = String(nextIndex)
        wrapperLink.setAttribute('aria-label', title ?? alt ?? `预览第 ${nextIndex + 1} 张图片`)
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
  }, [])

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

    const pres = root.querySelectorAll('article pre')
    pres.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return
      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.textContent = '复制'
      btn.setAttribute('type', 'button')
      btn.onclick = async () => {
        const code = pre.querySelector('code')?.textContent || ''
        try {
          await navigator.clipboard.writeText(code)
          btn.textContent = '已复制'
          setTimeout(() => {
            btn.textContent = '复制'
          }, 1500)
        } catch {
          btn.textContent = '失败'
          setTimeout(() => {
            btn.textContent = '复制'
          }, 1500)
        }
      }
      pre.appendChild(btn)
    })

    setPreviewItems(decorateAndCollectImages())
  }, [bodyHtml, decorateAndCollectImages])

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
      hint: '博客图片预览',
    }),
    [closePreview, openPreview, previewIndex, previewItems, previewOpen, setIndex]
  )

  return {
    containerRef,
    previewProps,
  }
}
