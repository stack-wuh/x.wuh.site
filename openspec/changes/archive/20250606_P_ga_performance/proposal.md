# Google Analytics 性能分析接入

## 概述

为 x.wuh.site 博客接入 Google Analytics 4 (GA4)，同时覆盖用户行为分析（页面浏览）和性能监控（Core Web Vitals）。

## 需求

- 接入 GA4 页面浏览追踪（自动追踪每次路由变更的 pageview）
- 接入 Web Vitals 性能指标监控（LCP, INP, CLS, TTFB, FCP）
- 所有环境启用，不做 cookie consent
- Measurement ID: G-X4ZVBQXW9E
- 组件统一放在 `packages/components` 目录下
