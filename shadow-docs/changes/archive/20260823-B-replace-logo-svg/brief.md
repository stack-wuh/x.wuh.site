# 替换 /logo.svg 为 IconLogo 组件

## 动机

`/logo.svg` 资源文件已被删除，logo 改用 `@wuh.site/components/icons` 中的 `IconLogo` 组件渲染。`SiteHeader` 已正确使用 `<IconLogo>`，但 `HomeView` 和 `ContactCard` 仍引用 `/logo.svg`，导致 404。

## 决策

两处引用改为 `IconLogo` 组件：

- `apps/site/app/HomeView/index.tsx:111` — `<S.StyledLogo>` 替换为 `<IconLogo>`，移除 `StyledLogo` 依赖
- `apps/site/app/components/ContactCard.tsx:261` — `<Avatar>` 中的 logo 替换为 `<IconLogo>`，`Avatar` 的样式类 `contact-logo` 不再需要
- `apps/site/app/styles/index.ts` — 移除 `StyledLogo` 导出（确认无其他引用后）
- `apps/site/test/image-role-migration.test.mjs` — 更新测试断言

## 任务

- [x] `HomeView` 替换 `StyledLogo` → `IconLogo`
- [x] `ContactCard` 替换 `Avatar` 中的 logo → `IconLogo`
- [x] 移除 `styles/index.ts` 中 `StyledLogo` 定义
- [x] 清理 `ContactCard` 中 `Avatar` 样式组件（`Image` import 仍被 `QRImage` 使用，保留）
- [x] 更新测试文件

## 结果

4 个文件变更，10 行新增，29 行删除：

- `apps/site/app/HomeView/index.tsx` — `S.StyledLogo` 替换为 `<IconLogo width={64} height={38.4} />`
- `apps/site/app/components/ContactCard.tsx` — `Avatar` (styled Image) 替换为 `<IconLogo width={48} height={29} />`，移除 `Avatar` 样式组件
- `apps/site/app/styles/index.ts` — 移除 `StyledLogo` 定义
- `apps/site/test/image-role-migration.test.mjs` — 更新测试断言为 IconLogo 组件匹配

测试：10/10 通过。dev 启动正常。