import ActiveLink from './link'

export default function Nav() {
  return (
    <nav id="nav" role="menubar" className="ww_menu">
      <ActiveLink href="/" activeClassName="is-active" passHref scroll={false}>
        <a className="ww_menu-item" role="menuitem" tabIndex={0}>
          <i className="iconfont icon-code" />
          <span>集合</span>
        </a>
      </ActiveLink>
      <ActiveLink href="/about" activeClassName="is-active" passHref scroll>
        <a className="ww_menu-item" role="menuitem" tabIndex={0}>
          <i className="iconfont icon-bussiness-man" />
          <span>关于</span>
        </a>
      </ActiveLink>
      <ActiveLink href="/music" activeClassName="is-active" passHref scroll>
        <a className="ww_menu-item" role="menuitem" tabIndex={0}>
          <i className="iconfont icon-netease-cloud-music-line" />
          <span>音</span>
        </a>
      </ActiveLink>
      <ActiveLink
        href="https://github.com/stack-wuh/react-router-config"
        activeClassName="is-active"
        passHref>
        <a
          className="ww_menu-item is-link"
          role="menuitem"
          tabIndex={0}
          target="_blank">
          <i className="iconfont icon-github" />
          <span>源代码</span>
        </a>
      </ActiveLink>
      <ActiveLink
        href="https://docs.wuh.site"
        activeClassName="is-active"
        passHref>
        <a
          className="ww_menu-item"
          role="menuitem"
          tabIndex={0}
          target="_blank">
          <i className="iconfont icon-insertlink" />
          <span>文档指南</span>
        </a>
      </ActiveLink>
    </nav>
  )
}
