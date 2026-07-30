# Spec: 首屏加载性能

## Purpose

定义关键页面首屏数据边界、资源测量和真实用户指标要求，确保首屏主体不被非首屏内容阻塞，并可通过实验室与真实用户数据验证。

## Requirements

### Requirement: 首屏必要数据优先返回
服务端生成初始 HTML 时 SHALL 只等待形成首屏主体所需的数据；非首屏数据 SHALL NOT 无条件阻塞首屏 HTML 返回。
- **GIVEN** 用户访问首页、Blog、About 或文章详情页
- **WHEN** 服务端生成初始 HTML
- **THEN** 服务端生成初始 HTML 时，SHALL 只等待形成首屏主体所需的数据
- **AND** 非首屏数据 SHALL NOT 无条件阻塞首屏 HTML 返回

#### Scenario: 服务端返回首屏主体
- **GIVEN** 非首屏数据请求尚未完成
- **WHEN** 服务端生成页面 HTML
- **THEN** 首屏主体先返回，非首屏数据不阻塞响应

### Requirement: 首页非首屏内容延后加载
Hero 及确认属于首屏的内容 SHALL 优先展示；仓库、年度总结、微信读书和其他非首屏区块 MAY 在首屏后加载或渲染；延后区块 SHALL 保留稳定占位、空状态和错误日志。
- **GIVEN** 首页需要展示 Hero、精选内容、年度总结、微信读书和项目等区块
- **WHEN** 首页首屏 HTML 返回并开始绘制
- **THEN** Hero 及确认属于首屏的内容 SHALL 优先展示
- **AND** 仓库、年度总结、微信读书和其他非首屏区块 MAY 在首屏后加载或渲染
- **AND** 延后区块 SHALL 保留稳定占位、空状态和错误日志

#### Scenario: 首页首屏不等待次要区块
- **GIVEN** 仓库、年度总结或微信读书接口响应较慢
- **WHEN** 用户访问首页
- **THEN** Hero 和精选内容仍可先绘制
- **AND** 次要区块在请求完成后展示或显示对应状态

### Requirement: 文章正文不依赖相关文章
标题、元数据和正文 SHALL NOT 等待 `getRelatedPosts`；相关文章 SHALL 在正文首屏之后加载或渲染；相关文章失败 SHALL NOT 阻断正文阅读。
- **GIVEN** 文章主体已由 `getIssue` 获取并完成必要的正文渲染
- **WHEN** 服务端生成文章详情首屏
- **THEN** 标题、元数据和正文 SHALL NOT 等待 `getRelatedPosts`
- **AND** 相关文章 SHALL 在正文首屏之后加载或渲染
- **AND** 相关文章失败 SHALL NOT 阻断正文阅读

#### Scenario: 相关文章请求失败
- **GIVEN** 文章正文请求成功但相关文章请求失败
- **WHEN** 服务端生成文章详情页
- **THEN** 标题、元数据和正文正常返回
- **AND** 相关文章失败被隔离

### Requirement: About 首屏主体优先
profile 主体 SHALL 优先展示；仓库和活动数据 MAY 在首屏后加载；热力图 SHALL 继续提供稳定加载态、错误态和响应式布局。
- **GIVEN** About 页面同时需要 profile、仓库和活动热力图数据
- **WHEN** 页面生成初始 HTML
- **THEN** profile 主体 SHALL 优先展示
- **AND** 仓库和活动数据 MAY 在首屏后加载
- **AND** 热力图 SHALL 继续提供稳定加载态、错误态和响应式布局

#### Scenario: About 次要数据未就绪
- **GIVEN** profile 已获取但仓库或活动数据尚未返回
- **WHEN** 用户访问 About 页面
- **THEN** profile 主体先展示
- **AND** 热力图显示稳定加载态或错误态

### Requirement: Blog 列表主体优先
文章列表和分页主体 SHALL 优先展示；labels MAY 依据性能基线在首屏后加载；筛选、分页 URL 同步和 SEO metadata 行为 SHALL 保持不变。
- **GIVEN** Blog 页面同时需要文章列表和可用 labels
- **WHEN** 页面生成初始 HTML
- **THEN** 文章列表和分页主体 SHALL 优先展示
- **AND** labels MAY 依据性能基线在首屏后加载
- **AND** 筛选、分页 URL 同步和 SEO metadata 行为 SHALL 保持不变

#### Scenario: Blog labels 延迟返回
- **GIVEN** 文章列表请求已完成但 labels 请求尚未完成
- **WHEN** 用户访问 Blog 页面
- **THEN** 文章列表和分页先展示
- **AND** labels 控件随后加载且不阻塞文章阅读

### Requirement: LCP 元素和资源可测量
每个页面 SHALL 能识别实际 LCP 元素及其数据、图片、字体或客户端依赖；图片优先级、尺寸、字体请求和动态加载 SHALL 只依据测量结果调整。
- **GIVEN** 关键页面完成首屏结构调整
- **WHEN** 在固定的移动端实验室环境和真实浏览器中测量
- **THEN** 每个页面 SHALL 能识别实际 LCP 元素及其数据、图片、字体或客户端依赖
- **AND** 图片优先级、尺寸、字体请求和动态加载 SHALL 只依据测量结果调整

#### Scenario: 记录首屏指标
- **GIVEN** 页面在固定实验室环境中加载完成
- **WHEN** 运行性能测量
- **THEN** 记录 FP、FCP、LCP、TTFB、CLS、请求瀑布和实际 LCP 元素

### Requirement: 真实用户指标按页面聚合
指标 SHALL 包含可用于按 pathname 聚合的页面上下文；指标上报失败或延迟 SHALL NOT 阻塞页面渲染。
- **GIVEN** 浏览器执行现有 Web Vitals 上报逻辑
- **WHEN** 上报 FP、FCP、LCP、TTFB 或 CLS
- **THEN** 指标 SHALL 包含可用于按 pathname 聚合的页面上下文
- **AND** 指标上报失败或延迟 SHALL NOT 阻塞页面渲染

#### Scenario: Web Vitals 上报失败
- **GIVEN** 指标上报接口不可用或响应延迟
- **WHEN** 页面加载和绘制发生
- **THEN** 页面渲染继续进行
- **AND** 指标事件保留页面路径上下文供后续聚合


### Requirement: Homepage fetches data at runtime after production build
生产构建完成且用户访问首页时，首页 SHALL 仍在运行时获取必要数据，而不是依赖构建期快照；非首屏数据 MAY 在首屏主体返回后获取。
- **GIVEN** 生产构建已完成且用户访问首页
- **WHEN** 首页运行时获取数据
- **THEN** 首页 SHALL 仍在运行时获取必要数据，而不是依赖构建期快照
- **AND** 非首屏数据 MAY 在首屏主体返回后获取

#### Scenario: 生产运行时获取首页数据
- **GIVEN** 生产构建没有预取动态内容
- **WHEN** 用户访问首页
- **THEN** 必要数据在运行时请求
- **AND** 非首屏数据不要求构建阶段提供快照

### Requirement: Homepage logs server data fetch failures
首页首屏或延后数据请求失败时，服务端 SHALL 继续遵守既有错误日志约定；非首屏请求失败 SHALL NOT 使已返回的首屏主体不可用。
- **GIVEN** 首页首屏或延后数据请求失败
- **WHEN** 请求异常被捕获
- **THEN** 服务端 SHALL 继续遵守既有错误日志约定
- **AND** 非首屏请求失败 SHALL NOT 使已返回的首屏主体不可用

#### Scenario: 首页次要请求失败
- **GIVEN** 首页非首屏数据请求返回错误
- **WHEN** 错误被捕获
- **THEN** 服务端记录错误
- **AND** 首页首屏主体保持可用
