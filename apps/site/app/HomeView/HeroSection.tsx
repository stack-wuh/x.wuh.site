import { IconLogo } from '@wuh.site/components/icons'
import * as S from '../styles'

/**
 * Hero 区块：纯展示（logo + 站点标题 + 标语），无交互。
 * 作为 Server Component 渲染，不参与客户端水合。
 */
export default function HeroSection() {
  return (
    <S.Hero>
      <IconLogo width={64} height={38.4} />
      <S.SiteTitle>wuh.site&nbsp;&middot;&nbsp;朝朝如念</S.SiteTitle>
      <S.SiteTagline>雾失楼台，月迷津渡</S.SiteTagline>
    </S.Hero>
  )
}
