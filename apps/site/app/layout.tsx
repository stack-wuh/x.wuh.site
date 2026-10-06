import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, AUTHOR_NAME, AUTHOR_URL } from '@wuh.site/core'
import AppProviders from './components/AppProviders'
import CursorLayer from '@wuh.site/components/cursor'
import FontPrefetch from './components/FontPrefetch'
import JsonLd from './components/JsonLd'
import { createSiteStructuredData } from './lib/structured-data'
import serifWoff2 from './fonts/files/NotoSerifSC-400.woff2'
import sansWoff2 from './fonts/files/NotoSansSC-400.woff2'
import './fonts/cjk.css'

// CJK 字体（Noto Sans/Serif SC）改由 ./fonts/cjk.css 经构建管线接入
// （哈希 + immutable 缓存）；next/font 仅保留等宽字体。
const jetbrainsMono = localFont({
  src: [
    { path: '../public/fonts/JetBrainsMono-400.woff2', weight: '400' },
  ],
  variable: '--font-mono',
  display: 'fallback',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  creator: AUTHOR_NAME,
  publisher: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    images: [{
      url: '/og-default.png',
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og-default.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#b91c1c' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0a0a' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="alternate" type="application/rss+xml" title="wuh.site RSS" href="https://wuh.site/api/rss.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  // Step 1: disable all CSS transitions before touching data attrs
  document.documentElement.setAttribute('data-no-transition', '');
  // Force reflow so the transition:none rule is applied
  void document.documentElement.offsetHeight;

  // Step 2: restore persisted theme family
  var family = 'wine';
  try {
    var storedFamily = window.localStorage.getItem('wuh.site.theme');
    if (storedFamily === 'wine' || storedFamily === 'plain') family = storedFamily;
  } catch (_) {}
  document.documentElement.dataset.themeFamily = family;

  // Step 3: restore display mode and resolve the effective color scheme
  var mode = 'system';
  try {
    var storedMode = window.localStorage.getItem('wuh.site.color-scheme-mode');
    if (storedMode === 'system' || storedMode === 'light' || storedMode === 'dark') mode = storedMode;
  } catch (_) {}
  var scheme = mode === 'light' || mode === 'dark'
    ? mode
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.colorScheme = scheme;

  // Step 4: re-enable transitions now that data attrs are settled
  document.documentElement.removeAttribute('data-no-transition');
})();
          `.trim(),
          }}
        />
      </head>
      <body className={`${jetbrainsMono.variable}`}>
      {/* 首屏必需字重（Serif/Sans 400）在 HTML 解析期即被发现——
          等价信息经 CSS 解析才触达会拖慢换装（FontPrefetch 的 idle load 更晚） */}
      <link rel='preload' href={serifWoff2} as='font' type='font/woff2' crossOrigin='anonymous' />
      <link rel='preload' href={sansWoff2} as='font' type='font/woff2' crossOrigin='anonymous' />
      <JsonLd data={createSiteStructuredData()} />
      <FontPrefetch />
      {/* 光标跟随层与页面同级：rAF+translate3d 合成器层，pointer:fine ∧ no-reduced-motion 才接管，
          环境不满足时由降级链静态帧顶替——触控与 reduce 用户零影响 */}
      <AppProviders><CursorLayer />{children}</AppProviders>
      </body>
    </html>
  )
}
