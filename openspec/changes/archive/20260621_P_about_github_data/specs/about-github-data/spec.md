# spec: about-github-data

## 后端 API

### GET /repos/profile

返回 GitHub 用户信息。

**Response 200**:

```json
{
  "profile": {
    "login": "stack-wuh",
    "name": "吴尒红",
    "avatar_url": "https://avatars.githubusercontent.com/u/34117238?v=4",
    "bio": "a boy just ~",
    "blog": "wuh.site",
    "location": "ShenZhen GuangDong China",
    "public_repos": 64,
    "followers": 12,
    "following": 36,
    "created_at": "2017-11-30T03:48:47Z"
  }
}
```

- 缓存: 5 分钟内存缓存
- 降级: API 失败返回 stale cache，无 cache 时 `profile` 为 `null`
- 认证: 使用 `GITHUB_PERSONAL_TOKEN` 环境变量

## 前端数据映射

### 个人

| UI 区块 | 数据来源 | Fallback |
|---------|---------|----------|
| 头像 | `profile.avatar_url` | 字母 "W" 渐变圆形 |
| 姓名 | `profile.name` | "Shadow Wu" |
| 角色 | `profile.location` | "ShenZhen GuangDong China" |
| Bio | `personalBio` 常量 | — |
| Tags | `blogTags` 常量 | — |

### 平台

| 平台 | 数据来源 |
|------|---------|
| GitHub | `profile.public_repos` repos · `profile.followers` followers |
| 语雀 | 静态文案 |
| 微信公众号 | 静态文案 |

### 联系方式

使用 `LinkGroup`（size='small'）+ `Dialog` + `ContactCard`，与首页共享 `ContactConfig`：

微信、QQ、Twitter、邮箱、GitHub、豆瓣、网易云、Discord — 8 个社交入口。点击微信/QQ 弹出二维码，点击 Twitter/GitHub/豆瓣/网易云/Discord 跳转链接，邮箱直接 mailto。

### 热力图

`useRequest` 从 `/v2/github/contributions?username=stack-wuh` 获取，传入 `@wuh.site/components/heatmap`。

## Tags

基于博客 labels 频率分析，取频率 ≥ 3 的技术标签：

```
Javascript(6)  React(6)  Git(5)  Node(4)  Nginx(3)  Vue(3)
```

## 个人简介

基于 43 篇博客内容客观总结：

> 全栈工程师，2018 年开始用 GitHub Issues 记录技术实践与个人思考。内容覆盖前端（React/Vue）、Node 服务端、运维部署（Docker/Nginx）及工程化。信奉实践驱动写作，写过的每一篇都是踩过的坑或拆过的轮子。现居深圳，业余时间喜欢读历史与推理小说。

## 页面结构

```
app/about/
├── page.tsx        # Server Component (ISR 1h, fetch profile + repos)
├── AboutView.tsx   # Client Component (LinkGroup, Dialog, useRequest heatmap)
├── data.ts         # blogTags, personalBio, timelineLogs, formatMonthDay
├── styles.ts       # Hero padding 32px 0 24px, LinkGroup small icons
└── layout.tsx      # 不变
```

## 样式调整

- Hero: `padding: 32px 0 24px`（底部留白改善副标题与内容的间距）
- 删除了 `ContactRow`、`ContactItem` 样式组件（LinkGroup 替代）
