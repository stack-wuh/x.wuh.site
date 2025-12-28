import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import Router from 'next/router'
import Script from 'next/script'
import React from 'react'
import NProgress from 'nprogress'
import ErrorBoundary from '@/components/ErrorBoundary'
import ReduxProvider from '@/components/ReduxProvider'
import { ConfigProvider } from '@/hooks/useConfig'
import { AudioProvider } from '@/hooks/useAudio'
import { useExternal, useEventListener } from 'ahooks'
import '@/styles/index.scss'
import { config } from '@/constant/config'
import * as gtag from '@/lib/gtag'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { DefaultSeo, FAQPageJsonLd, LogoJsonLd } from 'next-seo'
import WithDynamic from '@/layout/withDynamic'

import SEOConfig, { FAQConfig, LogoConfig } from '../next-seo.config'

Router.events.on('routeChangeStart', () => {
  NProgress.start()
})
Router.events.on('routeChangeComplete', url => {
  NProgress.done()
  gtag.pageview(url)
})
Router.events.off('routeChangeComplete', url => {
  gtag.pageview(url)
})
Router.events.on('routeChangeError', () => {
  NProgress.done()
})

type NextPageWithLayout = NextPage & {
  getLayout?: (Component: ReactElement) => ReactNode
}
type NextPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps, router }: NextPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page)
  const layout = getLayout(<Component {...pageProps} />)

  /**
   * @NOTE bubble 气泡框的脚本链接
   */
  const [bubblePath, setBubblePath] = React.useState('')

  /**
   * @NOTE Banner 区域的样式表
   */
  const [slidePath, setSlidePath] = React.useState('')
  const [slideThemePath, setSlideThemePath] = React.useState('')

  /**
   * @NOTE 用到的Google Font 字体库
   */
  const [googleFontPath, setGoogleFontPath] = React.useState('')
  const [googleFontNormalPath, setGoogleFontNormalPath] = React.useState('')

  /**
   * @NOTE ali font 链接
   */
  const [iconNormalPath, setIconNormalPath] = React.useState('')
  const [iconColorPath, setIconColorPath] = React.useState('')

  /**
   * @NOTE 普通字体图标的链接
   */
  useExternal(iconNormalPath, { type: 'css' })
  /**
    * @NOTE 带色彩的字体图标库
    */
  useExternal(iconColorPath, { type: 'css' })

  useExternal(bubblePath, { type: 'js' })
  useExternal(googleFontPath, { type: 'css' })
  useExternal(googleFontNormalPath, { type: 'css' })

  useExternal(slidePath, { type: 'css' })
  useExternal(slideThemePath, { type: 'css' })

  useEventListener('load', () => {
    setIconNormalPath('//at.alicdn.com/t/font_1587964_ap06iu717e5.css')
    setBubblePath('/scripts/bubble.js')
    
    
    setIconColorPath('//at.alicdn.com/t/font_2595178_wa25xow6jmp.css')
    setSlidePath('https://src.wuh.site/stylesheet/slick.min.css')
    setSlideThemePath('https://src.wuh.site/stylesheet/slick-theme.min.css')

    setGoogleFontPath('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap')
    setGoogleFontNormalPath('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap')
  })

  return (
    <ReduxProvider>
      <ErrorBoundary>
        <DefaultSeo {...SEOConfig} />
        <FAQPageJsonLd mainEntity={FAQConfig.mainEntity} />
        <LogoJsonLd url={LogoConfig.url} logo={LogoConfig.logo} />
        <Script
          id="gtag"
          strategy="afterInteractive"
          src={`https://src.wuh.site/scripts/google-tag-manager.js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        
        <ConfigProvider.Provider value={config}>
          <AudioProvider>
            <SwitchTransition mode="out-in">
              <CSSTransition
                in={router.asPath === '/'}
                key={router.asPath}
                classNames="page-transition"
                timeout={1000}
                unmountOnExit
                onEntered={() => {
                  if (router.asPath === '/') {
                    const target = document.querySelector('html')
                    const scrollTop = target?.getAttribute('scroll')
                    if (scrollTop) {
                      window.scrollTo(0, Math.abs(+scrollTop))

                      setTimeout(() => {
                        target?.setAttribute('scroll', ' ')
                      })
                    }
                  }
                }}
                onExiting={node => {
                  if (router.asPath.startsWith('/post')) {
                    const rect = node.getBoundingClientRect()
                    document
                      .querySelector('html')
                      ?.setAttribute('scroll', `${rect.y}`)
                  }
                }}
                addEndListener={(node, done) => {
                  node.addEventListener('transitionend', done, false)
                }}>

                <WithDynamic>{layout}</WithDynamic>
              </CSSTransition>
            </SwitchTransition>
          </AudioProvider>
        </ConfigProvider.Provider>
      </ErrorBoundary>
    </ReduxProvider>
  )
}

export default React.memo(MyApp)
