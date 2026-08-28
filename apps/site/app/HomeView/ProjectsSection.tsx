'use client'

import { IconFolderGit2 } from '@wuh.site/components/icons'
import type { RepoDto } from '@wuh.site/core'
import { reposService } from '@wuh.site/core/endpoints'
import * as S from '../styles'
import Empty from '@wuh.site/components/empty'

/** 精选项目：客户端刷新 GitHub 数据，客户端叶子 */
export default function ProjectsSection({ fallbackRepos }: { fallbackRepos: RepoDto[] }) {
  const { data: reposData } = reposService.getAll.use({ query: { limit: '6' } })
  const repos = reposData ? ((reposData as any).repos || []).slice(0, 6) as RepoDto[] : fallbackRepos

  return (
    <S.Section>
      <S.SectionHeader className='reveal'>
        <S.SectionTitle>精选项目</S.SectionTitle>
      </S.SectionHeader>
      {repos.length === 0 ? (
        <Empty icon={<IconFolderGit2 />} title="暂无项目" description="获取 GitHub 数据失败，请稍后重试" />
      ) : (
        <S.ProjectList>
          {repos.map(repo => (
            <S.ProjectLink
              key={repo.html_url}
              href={repo.html_url}
              target='_blank'
              rel='noopener noreferrer'
              className='reveal'
            >
              <S.ProjectName>{repo.name}</S.ProjectName>
              {repo.description && <S.ProjectDesc>{repo.description}</S.ProjectDesc>}
              <S.ProjectMeta>{repo.language ?? ''}{repo.stargazers_count > 0 ? ` · ☆ ${repo.stargazers_count}` : ''}</S.ProjectMeta>
            </S.ProjectLink>
          ))}
        </S.ProjectList>
      )}
    </S.Section>
  )
}
