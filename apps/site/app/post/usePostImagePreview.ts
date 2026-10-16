import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type ImagePreviewItem, type ImagePreviewProps } from '@wuh.site/components/image-preview'
import { useEventListener } from '@wuh.site/hooks/useEventListener'
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

  // 失败图转「装裱题注」占位（与组件库 Image 失败态同源语言，样式落 post-markdown.ts）：
  // img 隐藏、原图后插入 figure；佚印为装饰字，语义经 role='alert' 播报
  const markImageLost = useCallback(
    (image: HTMLImageElement) => {
      if (image.dataset.lost) return true
      // 水合前已失败的图不派发可见 error 事件，靠 complete 探测兜住
      if (!(image.complete && image.naturalWidth === 0)) return false
      image.dataset.lost = 'true'
      image.classList.add('md-img-lost')
      if (!image.nextElementSibling?.classList.contains('md-img-mount')) {
        const figure = document.createElement('figure')
        figure.className = 'md-img-mount'
        figure.setAttribute('role', 'alert')
        const caption = document.createElement('span')
        caption.className = 'md-img-mount-caption'
        caption.textContent =
          image.getAttribute('alt')?.trim() ||
          image.getAttribute('title')?.trim() ||
          t('components.image.loadFailed')
        const seal = document.createElement('span')
        seal.className = 'md-img-mount-seal'
        seal.setAttribute('aria-hidden', 'true')
        seal.textContent = '佚'
        figure.append(caption, seal)
        image.insertAdjacentElement('afterend', figure)
      }
      return true
    },
    [t]
  )

  const decorateAndCollectImages = useCallback(() => {
    const root = containerRef.current
    if (!root) return [] as ImagePreviewItem[]

    const images = root.querySelectorAll<HTMLImageElement>('.markdown-body img')
    const collected: ImagePreviewItem[] = []

    images.forEach((image) => {
      // 失败图不进画廊：跳过收集，索引按剩余图重排保持 DOM 与 state 一致
      if (markImageLost(image)) return

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
  }, [t, markImageLost])

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
      const images = Array.from(root.querySelectorAll<HTMLImageElement>('.markdown-body img')).filter(
        (img) => !img.dataset.lost
      )
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
    // 补扫：SSR HTML 里的图在解析期就开始加载，快速 404 可能落在
    // 「挂载时 complete 探测之后、error 监听生效之前」的窗口里，延迟补一次探测
    const resweep = window.setTimeout(() => {
      const node = containerRef.current
      if (!node) return
      let newlyLost = false
      node.querySelectorAll<HTMLImageElement>('.markdown-body img').forEach((image) => {
        if (markImageLost(image)) newlyLost = true
      })
      if (newlyLost) setPreviewItems(decorateAndCollectImages())
    }, 500)
    return () => window.clearTimeout(resweep)
  }, [bodyHtml, decorateAndCollectImages, t, markImageLost])

  // 正文图片/链接的预览捕获层：容器节点持久（bodyHtml 更新只换子树），
  // openPreviewByTarget 经 hook 的最新 handler 取用，无需随其身份重绑
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

  useEventListener('click', handleClick, containerRef, { capture: true })
  useEventListener('keydown', handleKeydown, containerRef, { capture: true })

  // error 不冒泡但 capture 相位可达：容器级监听覆盖全部正文图片，
  // 容器节点持久（bodyHtml 更新只换子树），handler 经 hook 最新值取用不重绑
  const handleImageError = useCallback(
    (event: Event) => {
      const image = event.target instanceof HTMLImageElement ? event.target : null
      if (!image || !image.closest('.markdown-body')) return
      if (markImageLost(image)) setPreviewItems(decorateAndCollectImages())
    },
    [markImageLost, decorateAndCollectImages]
  )
  useEventListener('error', handleImageError, containerRef, { capture: true })

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
