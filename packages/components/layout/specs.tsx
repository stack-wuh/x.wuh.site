export type FooterNavItem = {
  label: string
  href: string
}

/**
 * Footer 站点文案与链接配置。
 * siteBorn 为建站事实源（站龄与版权年份均从它推导），改动只在此处。
 */
export const footerConf = {
  slogan: '驿寄梅花, 鱼传尺素',
  /** 建站起点：备案审核日 */
  siteBorn: new Date('2021-03-08T00:00:00+08:00'),
  navItems: [
    { label: '博客', href: '/blog' },
    { label: '关于', href: '/about' },
    { label: 'RSS 订阅', href: '/api/rss.xml' },
  ] as FooterNavItem[],
  icp: { label: '鄂ICP备20001814号-1', href: 'https://beian.miit.gov.cn/' },
  /** 公安备案（深圳，粤） */
  police: { label: '粤公网安备44030002001803号', href: 'https://beian.mps.gov.cn/' },
  license: 'CC BY-NC-SA 4.0',
  licenseHref: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh',
  techStack: ['Next.js', 'NestJS', 'MongoDB'],
  author: 'Shadow',
}
