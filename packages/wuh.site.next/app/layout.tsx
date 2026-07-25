import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Serif_SC } from 'next/font/google'
import AppProviders from './components/AppProviders'
import JsonLd from './components/JsonLd'
import { createSiteStructuredData } from './lib/structured-data'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://wuh.site'),
  title: {
    default: 'wuh.site · 朝朝如念',
    template: '%s · wuh.site',
  },
  description: '记录前端工程、开源项目、设计系统与个人思考。',
  authors: [{ name: 'shadow', url: 'https://github.com/stack-wuh' }],
  creator: 'shadow',
  publisher: 'wuh.site',
  robots: { index: true, follow: true },
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

  // Step 2: set theme color scheme
  var scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.colorScheme = scheme;

  // Step 3: restore persisted theme family
  try {
    var stored = window.localStorage.getItem('wuh.site.theme');
    if (stored === 'wine' || stored === 'plain') {
      document.documentElement.dataset.themeFamily = stored;
    }
  } catch (_) {}

  // Step 4: re-enable transitions now that data attrs are settled
  document.documentElement.removeAttribute('data-no-transition');
})();
          `.trim(),
          }}
        />
      </head>
      <body className={`${inter.variable} ${notoSerifSC.variable}`}>
        <JsonLd data={createSiteStructuredData()} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
