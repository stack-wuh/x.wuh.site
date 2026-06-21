# About 页接入 GitHub 真实数据 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 About 页"关于我"区块的硬编码数据替换为 GitHub 真实数据（头像/姓名/repos/标签），同时用个人简介文本替换假指标行。

**Architecture:** 后端扩展 `ReposService` 新增 `GET /repos/profile` 端点（复用已有 Octokit），前端 page.tsx 拆为 Server Component（fetch 数据）+ AboutView.tsx（Client Component 渲染），遵循首页 `page.tsx → HomeView.tsx` 的既有模式。

**Tech Stack:** NestJS 10 + Octokit (REST), Next.js 15 App Router (ISR), shared-contracts (defineService)

---

## 文件职责

| 文件 | 操作 | 职责 |
|------|------|------|
| `packages/wuh.site.nest/src/modules/repos/dto/profile.dto.ts` | 新建 | GitHubProfileDto + 响应包装 |
| `packages/wuh.site.nest/src/modules/repos/repos.service.ts` | 修改 | 新增 `getUserProfile()` |
| `packages/wuh.site.nest/src/modules/repos/repos.controller.ts` | 修改 | 新增 `GET /repos/profile` |
| `packages/shared-contracts/src/endpoints.ts` | 修改 | 注册 `reposService.getProfile` |
| `packages/shared-contracts/src/index.ts` | 修改 | 新增 `GitHubProfileDto` 类型 |
| `packages/wuh.site.next/app/about/data.ts` | 修改 | 删除 mock 数据，新增 `blogTags` + `personalBio` |
| `packages/wuh.site.next/app/about/AboutView.tsx` | 新建 | Client Component，接收 props 渲染 |
| `packages/wuh.site.next/app/about/page.tsx` | 修改 | 改为 Server Component，fetch 数据 |

---

### Task 1: 创建 Profile DTO

**Files:**
- Create: `packages/wuh.site.nest/src/modules/repos/dto/profile.dto.ts`

- [ ] **Step 1: 编写 Profile DTO 文件**

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GitHubProfileDto {
  @ApiProperty({ description: 'GitHub username' })
  login: string

  @ApiProperty({ description: 'Display name' })
  name: string

  @ApiProperty({ description: 'Avatar URL' })
  avatar_url: string

  @ApiPropertyOptional({ description: 'GitHub bio' })
  bio: string

  @ApiPropertyOptional({ description: 'Blog URL' })
  blog: string

  @ApiPropertyOptional({ description: 'Location' })
  location: string

  @ApiProperty({ description: 'Public repo count' })
  public_repos: number

  @ApiProperty({ description: 'Follower count' })
  followers: number

  @ApiProperty({ description: 'Following count' })
  following: number

  @ApiProperty({ description: 'Account creation date (ISO string)' })
  created_at: string
}

export class GitHubProfileResponseDto {
  @ApiProperty({ description: 'GitHub profile', type: GitHubProfileDto })
  profile: GitHubProfileDto
}
```

### Task 2: 扩展 ReposService — 新增 getUserProfile()

**Files:**
- Modify: `packages/wuh.site.nest/src/modules/repos/repos.service.ts:1-82`

- [ ] **Step 1: 新增 import**

在文件顶部 import 区域追加：

```typescript
import { GitHubProfileDto } from './dto/profile.dto'
```

- [ ] **Step 2: 在 ReposService 类中添加 profile 缓存字段**

在 `private readonly CACHE_TTL = 5 * 60 * 1000` 后追加：

```typescript
private profileCache: { data: GitHubProfileDto; timestamp: number } | null = null
```

- [ ] **Step 3: 添加 getUserProfile() 方法**

在 `getRepos()` 方法之后（第 81 行 `}` 之后，第 82 行 `}` 之前）插入：

```typescript
async getUserProfile(): Promise<GitHubProfileDto | null> {
  if (this.profileCache && Date.now() - this.profileCache.timestamp < this.CACHE_TTL) {
    return this.profileCache.data
  }

  try {
    const login = this.configService.get<string>('CONTENT_REPO_OWNER') || 'stack-wuh'

    const { data } = await this.octokit.rest.users.getByUsername({ username: login })

    const profile: GitHubProfileDto = {
      login: data.login,
      name: data.name ?? data.login,
      avatar_url: data.avatar_url,
      bio: data.bio ?? '',
      blog: data.blog ?? '',
      location: data.location ?? '',
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at,
    }

    this.profileCache = { data: profile, timestamp: Date.now() }
    return profile
  } catch (error) {
    this.logger.error(`Failed to fetch user profile: ${error.message}`)
    if (this.profileCache) {
      return this.profileCache.data
    }
    return null
  }
}
```

### Task 3: 扩展 ReposController — 新增 GET /repos/profile

**Files:**
- Modify: `packages/wuh.site.nest/src/modules/repos/repos.controller.ts:1-22`

- [ ] **Step 1: 更新 import**

把现有的 `{ ReposResponseDto }` 替换为包含新 DTO：

```typescript
import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReposService } from './repos.service'
import { ReposResponseDto } from './dto/repos.dto'
import { GitHubProfileResponseDto } from './dto/profile.dto'
```

- [ ] **Step 2: 添加 profile 端点**

在 `getRepos()` 方法之后、类结束 `}` 之前插入：

```typescript
@Get('profile')
@ApiOperation({ summary: 'Get GitHub user profile' })
@ApiResponse({
  status: 200,
  description: 'GitHub user profile data',
  type: GitHubProfileResponseDto,
})
async getUserProfile(): Promise<GitHubProfileResponseDto> {
  const profile = await this.reposService.getUserProfile()
  return { profile }
}
```

### Task 4: 注册前端端点 + 共享类型

**Files:**
- Modify: `packages/shared-contracts/src/endpoints.ts:18-20`
- Modify: `packages/shared-contracts/src/index.ts`

- [ ] **Step 1: 在 endpoints.ts 注册 getProfile**

把 `reposService` 定义从：

```typescript
export const reposService = defineService({
  getAll: { url: '/repos', method: 'GET' },
})
```

改为：

```typescript
export const reposService = defineService({
  getAll:     { url: '/repos',         method: 'GET' },
  getProfile: { url: '/repos/profile', method: 'GET' },
})
```

- [ ] **Step 2: 在 shared-contracts/src/index.ts 添加类型**

在 `RepoDto` 定义之后追加：

```typescript
// GitHub Profile
export interface GitHubProfileDto {
  login: string
  name: string
  avatar_url: string
  bio: string
  blog: string
  location: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}
```

- [ ] **Step 3: 验证后端编译**

```bash
cd packages/wuh.site.nest && pnpm exec tsc --noEmit
```

Expected: 0 errors.

### Task 5: 清理 data.ts — 删除 mock 数据，新增真实常量

**Files:**
- Modify: `packages/wuh.site.next/app/about/data.ts:1-94`

- [ ] **Step 1: 删除 metrics, expertiseTags, platformStories**

删除以下三块代码（行 25-81）：

```typescript
// 删除行 25-29:
export const metrics = [
  { label: '最近 30 天产出', value: '32 条' },
  { label: '活跃平台', value: '3 / 3' },
  { label: '平均响应', value: '6 小时' },
]

// 删除行 31:
export const expertiseTags = ['架构研究', '内容系统', '工具链', '社区运营', 'DevRel']

// 删除行 62-81:
export const platformStories = [
  {
    name: 'GitHub',
    description: '开源项目 & 代码笔记，30+ 仓库持续维护',
    lastUpdated: '2026-04-10',
    linkLabel: '前往仓库',
  },
  {
    name: '语雀',
    description: '长篇技术文章，文档更新 >100 条 / 年',
    lastUpdated: '2026-04-15',
    linkLabel: '查看文档',
  },
  {
    name: '微信公众号',
    description: '碎片思考 & 周报，侧重经验总结与工具推荐',
    lastUpdated: '2026-04-14',
    linkLabel: '跳转公众号',
  },
]
```

- [ ] **Step 2: 新增 blogTags 和 personalBio**

在 `timelineFilters` 之后追加：

```typescript
export const blogTags = ['Javascript', 'React', 'Git', 'Node', 'Nginx', 'Vue']

export const personalBio =
  '全栈工程师，2018 年开始用 GitHub Issues 记录技术实践与个人思考。内容覆盖前端（React/Vue）、Node 服务端、运维部署（Docker/Nginx）及工程化。信奉实践驱动写作，写过的每一篇都是踩过的坑或拆过的轮子。现居深圳，业余时间喜欢读历史与推理小说。'
```

- [ ] **Step 3: 验证 data.ts 无编译错误**

```bash
cd packages/wuh.site.next && pnpm exec tsc --noEmit app/about/data.ts
```

Expected: 0 errors.

### Task 6: 创建 AboutView.tsx (Client Component)

**Files:**
- Create: `packages/wuh.site.next/app/about/AboutView.tsx`
- Reference: 原 page.tsx 的 JSX 结构保持不变，只改数据注入方式

- [ ] **Step 1: 编写 AboutView.tsx**

```tsx
'use client'

import type { GitHubProfileDto, RepoDto } from '@wuh.site/shared-contracts'
import {
  PageRoot,
  Hero, HeroLabel, HeroTitle, HeroSub,
  SectionHeader, SectionLabel,
  AboutTimeline, TimelineTrack, TimelineDot, AboutContent,
  ProfileRow, Avatar, AvatarLetter, ProfileInfo, ProfileName, ProfileRole,
  Bio, TagRow, Tag,
  PlatformList, PlatformCard, PlatformName, PlatformDesc,
  ContactRow, ContactItem,
  HeatmapGrid, HeatmapRow, DayLabel, Cells, Cell,
  FilterGroup, ChipButton,
  Legend, LegendItem, Swatch, LegendLabel,
  TimelineList, TimelineRow, TimelineDate, TimelineTitle, TimelineSelect,
} from './styles'
import {
  blogTags, personalBio, heatmap, filters, timelineFilters,
  timelineLogs, heatColors, legendLabels, formatMonthDay,
} from './data'

interface AboutViewProps {
  profile: GitHubProfileDto | null
  repos: RepoDto[]
}

const AboutView = ({ profile, repos }: AboutViewProps) => {
  const name = profile?.name || 'Shadow Wu'
  const avatarUrl = profile?.avatar_url ?? null
  const location = profile?.location || 'ShenZhen GuangDong China'

  return (
    <PageRoot>
      {/* 1. Hero */}
      <Hero>
        <HeroLabel>About</HeroLabel>
        <HeroTitle>输出节奏总览</HeroTitle>
        <HeroSub>记录思考，串联碎片，构建自己的知识系统</HeroSub>
      </Hero>

      {/* 2. 关于我 — 合并：个人 + 平台 + 联系 + 简介 */}
      <section>
        <SectionHeader>
          <SectionLabel>关于我</SectionLabel>
        </SectionHeader>
        <AboutTimeline>
          <TimelineTrack>
            <TimelineDot $top={0} />
            <TimelineDot $top={80} />
            <TimelineDot $top={160} />
          </TimelineTrack>
          <AboutContent>
            {/* Profile */}
            <div>
              <ProfileRow>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    width={56}
                    height={56}
                    style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <Avatar>
                    <AvatarLetter>W</AvatarLetter>
                  </Avatar>
                )}
                <ProfileInfo>
                  <ProfileName>{name}</ProfileName>
                  <ProfileRole>{location}</ProfileRole>
                </ProfileInfo>
              </ProfileRow>
              <Bio style={{ marginTop: 12 }}>
                {personalBio}
              </Bio>
              <TagRow style={{ marginTop: 10 }}>
                {blogTags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagRow>
            </div>

            {/* Platforms */}
            <div>
              <SectionLabel style={{ marginBottom: 10 }}>输出平台</SectionLabel>
              <PlatformList>
                <PlatformCard>
                  <div>
                    <PlatformName>GitHub</PlatformName>
                    <PlatformDesc style={{ marginLeft: 8 }}>
                      {profile
                        ? `${profile.public_repos} repos · ${profile.followers} followers`
                        : '开源项目 & 代码笔记'}
                    </PlatformDesc>
                  </div>
                </PlatformCard>
                <PlatformCard>
                  <div>
                    <PlatformName>语雀</PlatformName>
                    <PlatformDesc style={{ marginLeft: 8 }}>长篇技术文章，文档持续更新</PlatformDesc>
                  </div>
                </PlatformCard>
                <PlatformCard>
                  <div>
                    <PlatformName>微信公众号</PlatformName>
                    <PlatformDesc style={{ marginLeft: 8 }}>碎片思考 & 周报，侧重经验总结与工具推荐</PlatformDesc>
                  </div>
                </PlatformCard>
              </PlatformList>
            </div>

            {/* Contact */}
            <div>
              <SectionLabel style={{ marginBottom: 10 }}>联系方式</SectionLabel>
              <ContactRow>
                <ContactItem href='mailto:hello@wuh.site'>Email</ContactItem>
                <ContactItem href='https://github.com/stack-wuh' target='_blank' rel='noreferrer'>GitHub</ContactItem>
                <ContactItem href={profile?.blog ? `https://${profile.blog}` : 'https://wuh.site'} target='_blank' rel='noreferrer'>Blog</ContactItem>
              </ContactRow>
            </div>
          </AboutContent>
        </AboutTimeline>
      </section>

      {/* 3. Heatmap */}
      <section>
        <SectionHeader>
          <SectionLabel>产出热力图</SectionLabel>
          <FilterGroup>
            {filters.map((f, i) => (
              <ChipButton key={f} $active={i === 0}>{f}</ChipButton>
            ))}
          </FilterGroup>
        </SectionHeader>
        <HeatmapGrid>
          {heatmap.map((row) => (
            <HeatmapRow key={row.weekday}>
              <DayLabel>{row.weekday}</DayLabel>
              <Cells>
                {row.cells.map((cell) => (
                  <Cell
                    key={cell.date}
                    $level={cell.level}
                    title={`${formatMonthDay(cell.date)} · ${cell.count} 条`}
                  />
                ))}
              </Cells>
            </HeatmapRow>
          ))}
        </HeatmapGrid>
        <Legend>
          {legendLabels.map((label, i) => (
            <LegendItem key={label}>
              <Swatch style={{ background: heatColors[i] }} />
              <LegendLabel>{label}</LegendLabel>
            </LegendItem>
          ))}
        </Legend>
      </section>

      {/* 4. Timeline */}
      <section>
        <SectionHeader>
          <SectionLabel>最近日志</SectionLabel>
          <TimelineSelect defaultValue={timelineFilters[0]}>
            {timelineFilters.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </TimelineSelect>
        </SectionHeader>
        <TimelineList>
          {timelineLogs.map((log) => (
            <TimelineRow key={log.date}>
              <TimelineDate>{formatMonthDay(log.date)}</TimelineDate>
              <TimelineTitle>{log.summary}</TimelineTitle>
            </TimelineRow>
          ))}
        </TimelineList>
      </section>
    </PageRoot>
  )
}

export default AboutView
```

### Task 7: 重写 page.tsx 为 Server Component

**Files:**
- Modify: `packages/wuh.site.next/app/about/page.tsx` (完整重写)

- [ ] **Step 1: 重写 page.tsx**

```tsx
import { Metadata } from 'next'
import { reposService } from '@wuh.site/shared-contracts/endpoints'
import type { GitHubProfileDto, RepoDto } from '@wuh.site/shared-contracts'
import AboutView from './AboutView'

const SITE_URL = 'https://wuh.site'

export const metadata: Metadata = {
  title: 'About · wuh.site',
  description: '输出节奏总览 — 记录思考，串联碎片，构建自己的知识系统',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About · wuh.site',
    description: '输出节奏总览 — 记录思考，串联碎片，构建自己的知识系统',
    url: `${SITE_URL}/about`,
    siteName: 'wuh.site',
    type: 'website',
  },
}

async function getProfile(): Promise<GitHubProfileDto | null> {
  const { data } = await reposService.getProfile.server({ revalidate: 3600 })
  if (!data) return null
  return (data as any).profile as GitHubProfileDto
}

async function getRepos(): Promise<RepoDto[]> {
  const { data } = await reposService.getAll.server({ revalidate: 3600 })
  if (!data) return []
  return (data as any).repos.slice(0, 6) as RepoDto[]
}

export default async function AboutPage() {
  const [profile, repos] = await Promise.all([
    getProfile(),
    getRepos(),
  ])
  return <AboutView profile={profile} repos={repos} />
}
```

### Task 8: 验证

- [ ] **Step 1: 后端类型检查**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit -p packages/wuh.site.nest/tsconfig.json
```

Expected: 0 errors.

- [ ] **Step 2: 前端类型检查**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit -p packages/wuh.site.next/tsconfig.json
```

Expected: 0 errors.

- [ ] **Step 3: 整体验证**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site && pnpm exec tsc --noEmit
```

Expected: 0 errors across all packages.
