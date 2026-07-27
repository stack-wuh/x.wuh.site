# 任务清单

## Phase 1: 复现与最小修复

### Task 1: 记录对齐缺陷并建立回归检查

- [x] **文件:** `packages/components/dialog/styles/index.tsx`
- [x] 在现有测试能力范围内建立可复现的样式断言；项目无适用自动化样式测试，使用一次性源码样式断言建立失败证据。
- [x] 覆盖 `DialogHeader` 与 `CloseButton` 两层交叉轴对齐。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 修复前断言失败：`header=false, close=false`。

### Task 2: 修复共享 Dialog 对齐

- [x] **文件:** `packages/components/dialog/styles/index.tsx`
- [x] 将 `DialogHeader` 的交叉轴对齐改为居中。
- [x] 将 `CloseButton` 内部图标的交叉轴对齐改为居中。
- [x] 不改变结构、间距、尺寸、交互与无障碍属性。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 2 分钟
- [x] **验证:** 回归断言通过：`DialogHeader and CloseButton use align-items:center`。

## Phase 2: 验证

### Task 3: 执行静态与视觉回归验证

- [x] **文件:** `packages/components/dialog/styles/index.tsx`
- [x] 验证共享样式同时覆盖单标题和“标题 + 副标题”场景。
- [x] 验证同一共享 Header 样式覆盖桌面 center 与移动端 bottom placement。
- [x] 确认关闭按钮的语义、事件、hover 与 focus-visible 样式未发生代码变更。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 12 分钟
- [x] **验证:** 样式回归断言与 `git diff --check` 通过；`NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 通过。浏览器 Preview 服务因环境启动后立即丢失而无法完成交互验证；`oxlint` 与 Next build 在当前 x86_64/Node 22.22.3 环境均以 SIGSEGV 退出。

## 验收

- [x] 单标题 Dialog 的标题与关闭按钮沿 Header 中轴垂直居中。
- [x] 带副标题 Dialog 的关闭按钮相对标题组整体垂直居中。
- [x] `×` 在 44×44 像素点击区域内水平、垂直居中。
- [x] 桌面 center 和移动端 bottom placement 均使用相同共享对齐规则。
- [x] Header 间距、按钮尺寸、关闭交互、hover 与 focus-visible 未发生代码变更。
- [x] `NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 零错误。
