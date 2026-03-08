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
    const cssId = 'hljs-atom-style'
    const darkHref = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
    const lightHref = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css'
    const media =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : undefined

    const applyTheme = () => {
      const prefersDark = media ? media.matches : false
      const link = document.getElementById(cssId) as HTMLLinkElement | null
      const href = prefersDark ? darkHref : lightHref
      if (link) {
        link.href = href
      } else {
        const newLink = document.createElement('link')
        newLink.id = cssId
        newLink.rel = 'stylesheet'
        newLink.href = href
        document.head.appendChild(newLink)
      }
    }

    const enhanceDom = () => {
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

      const headings = root.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')
      headings.forEach((heading) => {
        const text = heading.textContent?.trim() || ''
        if (!text) return
        const slug = text
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '')
        if (!heading.id) heading.id = slug
        if (!heading.querySelector('.anchor')) {
          const anchor = document.createElement('a')
          anchor.className = 'anchor'
          anchor.href = `#${heading.id}`
          anchor.textContent = '#'
          heading.appendChild(anchor)
        }
      })

      setPreviewItems(decorateAndCollectImages())
    }

    const runHighlight = () => {
      const root = containerRef.current
      if (!root) return
      try {
        // @ts-expect-error hljs is provided by CDN script
        if (window.hljs && typeof window.hljs.highlightAll === 'function') {
          // @ts-expect-error hljs is provided by CDN script
          window.hljs.highlightAll()
        } else {
          const blocks = root.querySelectorAll('pre code')
          blocks.forEach((block) => {
            block.classList.add('hljs')
          })
        }
      } finally {
        enhanceDom()
      }
    }

    applyTheme()
    if (media) {
      if (media.addEventListener) {
        media.addEventListener('change', applyTheme)
      } else if (media.addListener) {
        media.addListener(applyTheme)
      }
    }

    const scriptId = 'hljs-lib'
    enhanceDom()

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js'
      script.onload = runHighlight
      script.onerror = enhanceDom
      document.body.appendChild(script)
    } else {
      runHighlight()
    }

    return () => {
      if (media) {
        if (media.removeEventListener) {
          media.removeEventListener('change', applyTheme)
        } else if (media.removeListener) {
          media.removeListener(applyTheme)
        }
      }
    }
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

  useEffect(() => {
    try {
      // @ts-expect-error hljs is provided by CDN script
      if (window.hljs && typeof window.hljs.highlightAll === 'function') {
        // @ts-expect-error hljs is provided by CDN script
        window.hljs.highlightAll()
      }
    } catch {
      // noop
    }
  }, [bodyHtml])

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
