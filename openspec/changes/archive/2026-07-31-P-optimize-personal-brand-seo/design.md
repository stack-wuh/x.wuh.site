# 设计文档

## 架构

沿用 Next.js Metadata API 与现有 JSON-LD builder，不新增 SEO 框架。身份信息统一为“吴尒红（Shadow）”，各页面仍负责生成与自身主题匹配的 description；共享 SEO 工具负责作者实体和结构化数据的一致性。

```text
统一公开身份：吴尒红（Shadow）
          │
          ├── 根布局默认 metadata
          │     ├── description
          │     ├── authors / creator
          │     └── Open Graph / Twitter
          │
          ├── 可索引页面差异化 description
          │     ├── 首页 / About / 博客 / 主题页
          │     └── 微信读书 / 足迹 / 留言板
          │
          └── 结构化身份
                ├── WebSite.publisher → Person
                ├── ProfilePage.mainEntity → Person
                └── BlogPosting.author / publisher → Person
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Metadata | 继续使用 Next.js Metadata API | 保持现有实现与服务端输出方式，不引入新依赖 |
| 姓名格式 | `吴尒红（Shadow）` | 同时覆盖真实姓名和已有公开昵称，便于身份归并 |
| 页面策略 | 所有可索引页面自然覆盖 | 用户明确要求全站可索引页面均包含姓名，同时保持主题差异化 |
| 文章摘要 | 不追加姓名 | 保留 CMS summary / 正文摘要的内容相关性，通过 authors 与 JSON-LD 表达作者 |
| 结构化数据 | 统一 Person 实体 | 将站点、About、文章及 GitHub 身份连接为同一实体 |
| 回归方式 | 静态 metadata 与 builder 测试 | 无需浏览器即可检查字符串覆盖、社交字段和 JSON-LD 身份一致性 |

## 数据模型（如涉及）

不涉及数据库或接口数据模型。SEO 身份采用固定公开常量语义：

```ts
const PERSON_NAME = '吴尒红（Shadow）'
const GITHUB_PROFILE_URL = 'https://github.com/stack-wuh'
const PERSON_URL = 'https://wuh.site/about'
const PERSON_ID = 'https://wuh.site/about#person'
```

实现时优先复用现有 SEO 文件的站点常量，不为单次文案修改建立复杂配置系统。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### 根布局 metadata

全站默认 description 以技术创作者身份为主，例如表达“吴尒红（Shadow）的个人站，记录前端工程、开源项目、设计系统与个人思考”。`authors` 与 `creator` 同步使用统一姓名，并继续关联 GitHub URL。Open Graph 和 Twitter 使用相同默认 description。

### 页面级 metadata

所有可索引页面按自身主题自然加入作者归属：

- 首页：个人品牌 + 前端工程、开源项目、文章与工具。
- About：吴尒红（Shadow）的创作节奏、思考与知识系统。
- 博客：吴尒红（Shadow）的技术文章；标签筛选页维持 `noindex, follow`，但摘要仍保持身份语义。
- 主题页：吴尒红（Shadow）关于指定主题的文章集合。
- 微信读书：吴尒红（Shadow）的微信读书书架与阅读记录。
- 足迹：吴尒红（Shadow）的深圳周边旅行足迹。
- 留言板：在吴尒红（Shadow）的个人站留言交流。

内部 `noindex, nofollow` 设计调试页保持现状，不为其增加公开品牌关键词。

### 文章 metadata

`description` 继续遵循 CMS summary 优先、正文首段回退的现有规则。作者名称回退值从 `stack-wuh` 调整为统一公开身份；若接口提供的作者名称只是账号 login，也需要保证作者实体能够通过 Person ID 和 GitHub `sameAs` 与吴尒红（Shadow）建立一致关联。

### JSON-LD

- 根布局 WebSite 的 description 使用新的全站默认语义。
- Person 的 `name` 使用“吴尒红（Shadow）”，`sameAs` 保留 GitHub 地址。
- ProfilePage 的 mainEntity 与根布局 Person 使用相同 `@id`、name、URL 与 sameAs。
- BlogPosting 的 author/publisher 指向相同 Person 实体，文章 description 保持内容摘要。

## 错误处理与边界

- 动态标签名称仅作为主题信息插入既有 metadata，不改变现有 URL 编解码逻辑。
- 页面 description 不进行无意义的重复姓名堆砌，每个字段最多自然出现一次统一姓名。
- 页面级 metadata 覆盖根布局时，必须同步覆盖 Open Graph 与 Twitter description，避免不同抓取渠道内容不一致。
- 文章存在 CMS 作者或 GitHub login 时，不以账号字符串替代统一 Person 实体；账号作为关联身份保留在 URL / sameAs 中。
- noindex 调试页不纳入姓名覆盖验收。

## 测试策略

1. 先增加失败测试，确认当前所有可索引页面中存在缺失“吴尒红（Shadow）”的 description。
2. 检查页面主 description、Open Graph description、Twitter description 是否同步。
3. 检查 authors、creator、WebSite Person、ProfilePage Person、BlogPosting author 使用统一姓名及 Person ID。
4. 检查文章 description builder 对 CMS summary 和正文摘要的行为未被改变。
5. 检查 `/design/system-color` 仍为 `noindex, nofollow`，且不被强制加入姓名。
6. 运行相关 Node 测试、TypeScript 类型检查、Lint 与 Next.js 构建。

## 响应式策略（如涉及）

不涉及视觉布局或响应式变更。

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；只调整 metadata 与 JSON-LD 文本/身份字段。
- **向后兼容:** canonical、路由、页面内容、CMS summary 和现有 API 均保持不变。
- **性能影响:** 仅静态字符串与对象字段调整，无额外请求或客户端运行时成本。
- **SEO 影响:** 搜索引擎可更清晰地将 wuh.site、吴尒红、Shadow 与 stack-wuh 归并为同一技术创作者实体；各页面仍保留主题相关描述，避免全站重复摘要。
