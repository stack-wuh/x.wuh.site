# wuh.site

![](https://img.shields.io/github/package-json/dependency-version/stack-wuh/x.wuh.site/react?style=social)
![](https://img.shields.io/github/package-json/dependency-version/stack-wuh/x.wuh.site/next?style=social)
![](https://img.shields.io/github/package-json/dependency-version/stack-wuh/x.wuh.site/preact?style=social)
![](https://img.shields.io/github/package-json/v/stack-wuh/x.wuh.site/main?style=social)
![](https://img.shields.io/github/v/release/stack-wuh/react-router-config?style=social)
![](https://img.shields.io/github/last-commit/stack-wuh/wuh.site?style=social)
![](https://img.shields.io/github/languages/top/stack-wuh/react-router-config?style=social)
![](https://img.shields.io/github/commit-activity/m/stack-wuh/wuh.site?style=social)
![](https://img.shields.io/github/repo-size/stack-wuh/react-router-config?style=social)
![](https://img.shields.io/docker/pulls/shadowu/wuh.site?color=red&label=%E4%BD%BF%E7%94%A8%E6%AC%A1%E6%95%B0&logo=docker&logoColor=lightblue)
![](https://img.shields.io/docker/image-size/shadowu/wuh.site?label=%E9%95%9C%E5%83%8F%E5%A4%A7%E5%B0%8F&logo=docker&logoColor=lightblue)
![](https://img.shields.io/docker/v/shadowu/wuh.site?color=red&label=docker%20version&logo=docker&logoColor=lightblue)


再次开启一段全新的旅程~~

> 使用 Nextjs，Mongodb 和 Nest.js 构建的个人网站    
> 由 Koa.js 提供日志分析，ant-design-prod 搭建后台    
> 使用pnpm进行包管理, 架构升级monorepo模式

1. 架构升级,next项目中已升级为monorepo架构，使用pnpm workspace管理
2. 技术栈升级，使用最新的版本的Next.js，开启turbo模式，尝试一下webpack5的全新功能
3. 拆分component组件，将一些通用的组件拆分到独立的组件库中，方便多个项目进行复用
4. css-in-js解决方案, 引入styled-components来实现css-in-js的方案，方便进行css的编写和管理
5. 引入Astro，尝试一下新的静态站点生成器，提升站点的性能和SEO表现，用于管理片段化的笔记内容


### 项目结构
1. [[packages/components]] 独立为组件库
2. [[packages/wuh.site.next]] next项目代码
3. [[packages/astro]] 静态文档生成器
4. [[packages/docs]] 文档项目
5. [[packages/config]] ts配置文件

### 项目管理
<a href="https://github.com/users/stack-wuh/projects/6" target="_blank"><img width="1440" height="813" alt="image" src="https://github.com/user-attachments/assets/4adac2ec-c083-4bc0-bc8e-f3a8dad3a9be" /></a>


### 开源许可

![](https://img.shields.io/github/license/stack-wuh/wuh.site)

### 启动项目

#### 1.使用 git

1. `main`分支, 由`Next12 + TypeScript + Webpack5 + SASS`构建的 TS 应用
1. `master`分支, 由`create-react-app`创建的 react 项目
1. `v2`分支为 `Nextjs11 + JS` 构建的 react 项目

```bash
git clone -b main https://github.com/stack-wuh/wuh.site.git wuh.site

cd wuh.site
yarn

yarn run dev
```

#### 2.使用 docker

```bash
docker pull shadowu/wuh.site:latest

docker-compose up -d

# 制作镜像文件
docker build -f Dockerfile -t shadowu/wuh.site:latest .

# 或者使用docker指令启动镜像
docker run --name nextjs_app_container -it -p 3100:3000 --restart=always shadowu/wuh.site:latest
```


[packages/components]: https://github.com/stack-wuh/wuh.site/tree/main/packages/components
[packages/wuh.site.next]: https://github.com/stack-wuh/wuh.site/tree/main/packages/wuh.site.next
[packages/astro]: https://github.com/stack-wuh/wuh.site/tree/main/packages/astro
[packages/docs]: https://github.com/stack-wuh/wuh.site/tree/main/packages/docs
[packages/config]: https://github.com/stack-wuh/wuh.site/tree/main/packages/config
