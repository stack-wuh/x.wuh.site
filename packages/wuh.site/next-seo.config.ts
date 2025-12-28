import { NextSeoProps, FAQPageJsonLdProps, LogoJsonLdProps } from 'next-seo'

const config: NextSeoProps = {
  title: 'wuh.site -- 日积跬步, 以致千里',
  description: '不要停步不前, 每一天都要做出一点点改变, 日积跬步, 以致千里.',
  additionalMetaTags: [
    {
      name: 'author',
      content: '吴尒红 <wuh131420@foxmail.com>',
    },
    {
      name: 'keywords',
      content:
        '吴尒红 博客, shadow 博客, Javascript 技术, 前端开发工程师, Reactjs, Vuejs',
    },
    {
      name: 'copyright',
      content: '@shadow 2021.',
    },
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
    },
    {
      name: 'chartset',
      content: 'utf-8',
    },
    {
      name: 'renderer',
      content: 'webkit',
    },
    {
      httpEquiv: 'x-ua-compatible',
      content: 'IE=Edge,chrome=1',
    },
  ],
  twitter: {
    handle: '@wuh131420',
    site: 'https://wuh.site',
    cardType: 'summary_large_image',
  },
  openGraph: {
    type: 'website',
    locale: 'zh-cn',
    url: 'https://wuh.site',
    site_name: 'wuh.site',
  },
}

export const FAQConfig: FAQPageJsonLdProps = {
  mainEntity: [
    {
      questionName: '为什么选择了Docker+Nginx来部署我的个人应用?',
      acceptedAnswerText:
        '在去年我上线了一个前后端分离的博客项目, 后台服务用的是Express, 在当时我选择了PM2来启动我的Node服务. 为什么会需要PM2呢?NodeJS是一个基于V8的运行时环境, 当我们打开一个shell面板, 输入启动指令 npm run start, 程序开始运行在机器后台, 这个时候我们可以通过服务占用的端口号, 找到这个进程.可以访问我的这一篇博客来查看详细内容。',
    },
    {
      questionName: '为什么React既简单又困难?',
      acceptedAnswerText:
        '将所有的数据源维护在一个JSON数据中，用函数去处理筛选的逻辑，从而得到我们在当前页所需要的数据结构。Antd中的有一个仓库ProTable，ProTable是一个集合了查询、表格和分页的多功能复合型组件，它将Search部分以及Table部分的数据都维护在一份JSON数据中，用不同的参数去驱动UI。',
    },
    {
      questionName: '如何联系我?',
      acceptedAnswerText:
        '提供一下几种方法: <ul><li>email: wuh131420@foxmail.com</li><li>qq: 724132485</li><li>github: stack-wuh</li></ul>',
    },
  ],
}

export const LogoConfig: LogoJsonLdProps = {
  logo: 'https://src.wuh.site/common/avatar.jpg',
  url: 'https://wuh.site',
}

export default config
