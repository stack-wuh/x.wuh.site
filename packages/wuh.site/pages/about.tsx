import React from 'react'
import withLayout from '@/layout/layout'
import Space from '@/components/space/space'
import AMap from '@/components/amap'
import Divider from '@/components/divider'
import Empty from '@/components/empty'
import { NextSeo, BreadcrumbJsonLd } from 'next-seo'

const AboutPage = () => {
  return (
    <div className="ww_about">
      <NextSeo
        title="wuh.site -- 吴尒红 · wuh.site"
        description="自小多才俊,向来志气高.别人有宝剑,我有笔如刀."
      />
      <BreadcrumbJsonLd
        itemListElements={[
          { position: 1, name: '关于 | About', item: 'https://wuh.site/about' },
        ]}
      />

      <div className="ww_about__list">
        <ul>
          <li>
            <i className="iconfont-color iconbiji" />
            <span className="text-wave">
              飘渺的风怎么追逐自由的雨, 就像此时的我在想彼时的你。
            </span>
          </li>
          <li>
            <i className="iconfont-color iconbiaoqianA01_biji-94" />
            <span className="text-bg-line">
              他是一个男孩, 仍然活在理想的世界里, 因为现实世界里的月光太惨白。
            </span>
          </li>
          <li>
            <i className="iconfont-color iconmusic-on-white-copy" />
            <span>
              周杰伦,&nbsp;李宗盛,&nbsp;纯音乐,&nbsp;
              <a
                className="text-link"
                href="https://music.163.com/#/playlist?id=565717308"
                target="_blank"
                rel="external noreferrer">
                网抑云
              </a>
            </span>
          </li>
          <li>
            <i className="iconfont-color iconshuji" />
            <span>
              <a
                className="text-link margin-right-4 text-none"
                rel="external noreferrer"
                href="https://weread.qq.com/misc/booklist/74791710_7kPtxUxu0?code=021d5oFa1GAFQA0MHTIa1F8ayy1d5oF1&state=ok_userinfo"
                target="_blank">
                阅读
              </a>
              ,&nbsp;
              <a
                className="text-link margin-right-4 text-none"
                rel="external noreferrer"
                href="https://www.douban.com/people/wuh-site/notes"
                target="_blank">
                日记
              </a>
              ,&nbsp;
              <a
                className="text-link margin-right-4 text-none"
                rel="external noreferrer"
                href="https://www.douban.com/people/wuh-site/subject_doulists/book"
                target="_blank">
                豆瓣-书/片单
              </a>
              ,&nbsp;
              <span>
                小说, 推理, 人间词话&nbsp;&nbsp;
                <a
                  className="margin-right-4 text-none iconfont-color iconlogo"
                  rel="external noreferrer"
                  href="https://gitbook.wuh.site"
                  target="_blank"
                />
              </span>
            </span>
          </li>
          <li className="flex-align-center">
            <i className="iconfont-color iconxinhao" />
            <Space size="small" ghost>
              <a
                href="https://www.github.com/stack-wuh"
                rel="external noreferrer"
                target="_blank"
                className="icon-outer icon-outer-github">
                <i className="iconfont icon-github" />
                <span>Github</span>
              </a>
              <a
                href="https://twitter.com/wuh131420"
                rel="external noreferrer"
                target="_blank"
                className="icon-outer icon-outer-twitter">
                <i className="iconfont icon-twitter" />
                <span>Twitter</span>
              </a>
              <a
                href="https://www.douban.com/people/wuh-site/"
                rel="external noreferrer"
                target="_blank"
                className="icon-link iconfont-color icondouban-circle"
              />
              <a
                href="https://space.bilibili.com/18414227"
                rel="external noreferrer"
                target="_blank"
                className="icon-link iconfont-color iconbilibili"
              />
              <a
                href="https://weibo.com/wuerhong"
                rel="external noreferrer"
                target="_blank"
                className="icon-link iconfont-color iconsina-circle"
              />
              <a
                href="https://www.linkedin.com/in/shadow-wu"
                rel="external noreferrer"
                target="_blank"
                className="icon-link iconfont-color iconlinkedin-circle"
              />
              <a
                href="https://www.zhihu.com/people/wuhong.site"
                rel="external noreferrer"
                target="_blank"
                className="icon-link iconfont-color iconzhihu-circle"
              />
            </Space>
          </li>
        </ul>
      </div>
      <Divider />
      <AMap />
      <Divider />
      <Empty align="center" size="large">
        <p>Nothing About</p>
      </Empty>
    </div>
  )
}

export default React.memo(withLayout(AboutPage))
