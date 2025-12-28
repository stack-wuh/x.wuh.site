<p>
  <a href='https://nextjs.org/' style="margin-right: 8px;">
    <img src="https://src.wuh.site/2021-05/2021-08-07-nextjs.org_.png" width='135px' height='60px' />
  </a>
  <a href='https://wuh.site'>
    <img src='https://wuh.site/icons/favicon-192.png' width='60px' height='60px'>
  </a>
</p>

# wuh.site

![](https://img.shields.io/github/package-json/dependency-version/stack-wuh/wuh.site/react?style=social)
![](https://img.shields.io/github/package-json/dependency-version/stack-wuh/wuh.site/next?style=social)
![](https://img.shields.io/github/package-json/dependency-version/stack-wuh/wuh.site/preact?style=social)
![](https://img.shields.io/github/package-json/v/stack-wuh/wuh.site/main?style=social)
![](https://img.shields.io/github/v/release/stack-wuh/react-router-config?style=social)
![](https://img.shields.io/github/last-commit/stack-wuh/wuh.site?style=social)
![](https://img.shields.io/github/languages/top/stack-wuh/react-router-config?style=social)
![](https://img.shields.io/github/commit-activity/m/stack-wuh/wuh.site?style=social)
![](https://img.shields.io/github/repo-size/stack-wuh/react-router-config?style=social)
![](https://img.shields.io/docker/pulls/shadowu/wuh.site?color=red&label=%E4%BD%BF%E7%94%A8%E6%AC%A1%E6%95%B0&logo=docker&logoColor=lightblue)
![](https://img.shields.io/docker/image-size/shadowu/wuh.site?label=%E9%95%9C%E5%83%8F%E5%A4%A7%E5%B0%8F&logo=docker&logoColor=lightblue)
![](https://img.shields.io/docker/v/shadowu/wuh.site?color=red&label=docker%20version&logo=docker&logoColor=lightblue)
[![Lint Code Base](https://github.com/stack-wuh/wuh.site/actions/workflows/linter.yml/badge.svg)](https://github.com/stack-wuh/wuh.site/actions/workflows/linter.yml)[![Release Drafter](https://github.com/stack-wuh/wuh.site/actions/workflows/release-drafter.yml/badge.svg)](https://github.com/stack-wuh/wuh.site/actions/workflows/release-drafter.yml)[![Upload Release Asset](https://github.com/stack-wuh/wuh.site/actions/workflows/gh-release.yml/badge.svg)](https://github.com/stack-wuh/wuh.site/actions/workflows/gh-release.yml)[![Publish Docker image](https://github.com/stack-wuh/wuh.site/actions/workflows/docker-push.yml/badge.svg)](https://github.com/stack-wuh/wuh.site/actions/workflows/docker-push.yml)

> 使用 Nextjs，Mongodb 和 Express 构建的个人网站

> 由 Koajs 提供日志分析，ant-design-prod 搭建后台

首页地址: <a href='https://wuh.site' target='_blank'>https://wuh.site</a>  
Docker 镜像: <a href='https://hub.docker.com/r/shadowu/wuh.site' target='_blank'>shadowu/wuh.site</a>

## 相关项目

- **[AntDesignPro](https://console.wuh.site)后台管理系统**
- **[Koa-console](https://api.wuh.site)Koa 构建的基础服务**

## 更新日志

- **[github.releases](https://github.com/stack-wuh/react-router-config/releases)发布日志**

## 迭代计划

- **[github.project](https://github.com/stack-wuh/react-router-config/projects/1)项目管理**

## ScreenShot

<p style="display: flex;">
  <img src='./screenshot/wuh.site_home.png' width='45%' alt='home' />
  <img src='./screenshot/wuh.site_home_dark.png' width='45%' alt='home_dark' />
</p>
<p></p>
<p style="display: flex;">
  <img src='./screenshot/wuh.site_dark_hover.png' width='45%' alt='home_dark_hover' />
  <img src='./screenshot/wuh.site_about.png' width='45%' alt='about' />
</p>

## 开源许可

![](https://img.shields.io/github/license/stack-wuh/wuh.site)

## 启动项目

### 使用 git

1. `main`分支, 由`Next12 + TypeScript + Webpack5 + SASS`构建的 TS 应用
1. `master`分支, 由`create-react-app`创建的 react 项目
1. `v2`分支为 `Nextjs11 + JS` 构建的 react 项目

```bash
git clone -b main https://github.com/stack-wuh/wuh.site.git wuh.site

cd wuh.site
yarn

yarn run dev
```

### 使用 docker

```bash
docker pull shadowu/wuh.site:latest

docker-compose up -d

# 制作镜像文件
docker build -f Dockerfile -t shadowu/wuh.site:latest .

# 或者使用docker指令启动镜像
docker run --name nextjs_app_container -it -p 3100:3000 --restart=always shadowu/wuh.site:latest
```
