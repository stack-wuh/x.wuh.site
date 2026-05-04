# About 页面代码拆分

## 问题

`app/about/page.tsx` 728 行，样式（450行）和数据（100行）与组件逻辑混在一起，维护困难。

## 方案

激进拆分：7 个文件，各司其职。

## Scope

`packages/wuh.site.next/app/about/` 目录下 7 个文件
