'use client'

import styled from 'styled-components'
import Skeleton from '@wuh.site/components/skeleton'

const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 64px 24px;
  color: var(--text-primary);
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
`

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
`

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const ArticleCard = styled.section`
  background: var(--background-100);
  border: 1px solid var(--normal-300);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--elevation-soft);

  @media (max-width: 640px) {
    padding: 20px;
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-800);
    border-color: var(--normal-600);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
  }
`

const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const SkeletonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const InlineRow = styled.div`
  display: flex;
  gap: var(--space-sm);
  align-items: center;
`

export default function Loading() {
  return (
    <Container>
      <Header>
        <Skeleton variant='text' height={28} width='68%' />
        <MetaRow>
          <Skeleton variant='text' width={140} />
          <Skeleton variant='text' width={88} />
          <Skeleton variant='text' width={96} />
        </MetaRow>
        <TagRow>
          <Skeleton variant='rect' height={22} width={72} radius={999} />
          <Skeleton variant='rect' height={22} width={86} radius={999} />
          <Skeleton variant='rect' height={22} width={64} radius={999} />
        </TagRow>
      </Header>

      <ArticleCard>
        <ContentStack>
          <Skeleton variant='rect' height={200} radius={12} />
          <SkeletonRow>
            <Skeleton variant='text' height={14} width='96%' />
            <Skeleton variant='text' height={14} width='92%' />
            <Skeleton variant='text' height={14} width='88%' />
          </SkeletonRow>
          <SkeletonRow>
            <Skeleton variant='text' height={14} width='90%' />
            <Skeleton variant='text' height={14} width='85%' />
            <Skeleton variant='text' height={14} width='70%' />
          </SkeletonRow>
          <InlineRow>
            <Skeleton variant='rect' height={36} width={120} radius={10} />
            <Skeleton variant='rect' height={36} width={140} radius={10} />
          </InlineRow>
          <SkeletonRow>
            <Skeleton variant='text' height={14} width='94%' />
            <Skeleton variant='text' height={14} width='78%' />
          </SkeletonRow>
        </ContentStack>
      </ArticleCard>
    </Container>
  )
}
