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

| UI 区块 | 数据来源 | Fallback |
|---------|---------|----------|
| 头像 | `profile.avatar_url` | 字母 "W" 渐变圆形 |
| 姓名 | `profile.name` | "Shadow Wu" |
| 角色 | `profile.location` | "ShenZhen GuangDong China" |
| Bio | `personalBio` 常量 | — |
| Tags | `blogTags` 常量 | — |
| GitHub 平台卡 | `profile.public_repos` + `profile.followers` | 静态文案 |
| 语雀平台卡 | 静态文案 | — |
| 公众号平台卡 | 静态文案 | — |
| 联系方式 | Email + GitHub URL + `profile.blog` | https://wuh.site |

## Tags

基于博客 labels 频率分析，取频率 ≥ 3 的技术标签：

```
Javascript(6)  React(6)  Git(5)  Node(4)  Nginx(3)  Vue(3)
```

## 个人简介

基于 43 篇博客内容客观总结：

> 全栈工程师，2018 年开始用 GitHub Issues 记录技术实践与个人思考。内容覆盖前端（React/Vue）、Node 服务端、运维部署（Docker/Nginx）及工程化。信奉实践驱动写作，写过的每一篇都是踩过的坑或拆过的轮子。现居深圳，业余时间喜欢读历史与推理小说。

## 页面拆分

```
app/about/
├── page.tsx        # Server Component (数据获取, ISR 1h)
├── AboutView.tsx   # Client Component (接收 props 渲染)
├── data.ts         # 工具函数 + 常量
├── styles.ts       # 不变
└── layout.tsx      # 不变
```
