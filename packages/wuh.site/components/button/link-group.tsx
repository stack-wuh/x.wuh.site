import React from 'react'
import Affix from '@/components/affix'
import Space from '../space/space'
import Button from './button'

const linkBtnMaps = [
  {
    label: '知乎',
    icon: 'iconfont icon-zhihu1',
    href: 'https://www.zhihu.com/people/wuhong.site',
    hrefClassName: 'ww_button__link--zhihu',
    name: 'zhihu',
    title: '去知乎',
    tabIndex: 1,
  },
  {
    label: 'QQ',
    icon: 'iconfont icon-qq',
    href: 'https://src.wuh.site/web/qq.jpg',
    hrefClassName: 'ww_button__link--qq',
    name: 'qq',
    title: 'Share to: QQ',
    tabIndex: 1,
  },
  {
    label: 'wechat',
    icon: 'iconfont icon-wechat',
    href: 'https://src.wuh.site/web/wechat.jpeg',
    hrefClassName: 'ww_button__link--wechat',
    name: 'wechat',
    title: 'Share to: 微信',
    tabIndex: 1,
  },
  {
    label: '微信公众号',
    icon: 'iconfont icon-wechat-platform',
    href: 'https://src.wuh.site/web/wechat-platform.jpg',
    hrefClassName: 'ww_button__link--weopen',
    name: 'wechat',
    title: 'Share to: 微信公众号',
    tabIndex: 1,
  },
  {
    label: 'github',
    icon: 'iconfont icon-github1',
    href: 'https://github.com/stack-wuh',
    hrefClassName: 'ww_button__link--github',
    name: 'github',
    title: '去Github',
    tabIndex: 1,
  },
  {
    label: 'gitbook',
    icon: 'iconfont icon-Gitbook',
    href: 'https://gitbook.wuh.site',
    hrefClassName: 'ww_button__link--gitbook',
    name: 'gitbook',
    title: '去Gitbook',
    tabIndex: 1,
  },
  {
    label: 'twitter',
    icon: 'iconfont icon-ttww',
    href: 'https://twitter.com/wuh131420',
    hrefClassName: 'ww_button__link--twitter',
    name: 'twitter',
    title: '去twitter',
    tabIndex: 1,
  },
  {
    label: 'yuque',
    icon: 'iconfont icon-yuque-fill',
    href: 'https://www.yuque.com/shadow.wu',
    hrefClassName: 'ww_button__link--yuque',
    name: 'yuque',
    title: '去语雀',
    tabIndex: 1,
  },
]

const LinkGroup: React.FC<{}> = () => {
  return (
    <Affix>
      <div className="ww_button ww_button-group ww_button-group__link">
        <Space size={0} direction="vertical" ghost>
          {linkBtnMaps.map(item => (
            <>
              <Button
                ghost
                events={{ category: 'link', label: item.name }}
                key={item.name}
                htmlHref={item.href}
                hrefClassName={item.hrefClassName}
                icon={item.icon}
                title={item.title}
                size="small"
                type="ghost"
              />
            </>
          ))}
        </Space>
      </div>
    </Affix>
  )
}

export default LinkGroup
