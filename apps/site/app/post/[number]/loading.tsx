'use client'

import styled from '@wuh.site/components/styled'
import Skeleton from '@wuh.site/components/skeleton'

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) 24px;
  color: var(--text-color);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 820px) 260px;
    gap: 24px;
    justify-content: center;
  }
`

const Main = styled.div`
  min-width: 0;
`

const TocSkeleton = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    position: sticky;
    top: 88px;
    border-radius: var(--radius-card);
    border: 1px solid var(--normal-300);
    background: var(--background-100);
    box-shadow: var(--elevation-soft);
    padding: 16px;
  }
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
  border-radius: var(--radius-card);
  padding: 32px;
  box-shadow: var(--elevation-card);

  @media (max-width: 640px) {
    padding: 20px;
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
      <Grid>
        <Main>
          <Header>
            <Skeleton variant='text' height={28} width='68%' />
            <MetaRow>
              <Skeleton variant='text' width={140} />
              <Skeleton variant='text' width={88} />
              <Skeleton variant='text' width={96} />
            </MetaRow>
            <TagRow>
              <Skeleton variant='rect' height={22} width={72} radius={4} />
              <Skeleton variant='rect' height={22} width={86} radius={4} />
              <Skeleton variant='rect' height={22} width={64} radius={4} />
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
                <Skeleton variant='rect' height={36} width={120} radius={8} />
                <Skeleton variant='rect' height={36} width={140} radius={8} />
              </InlineRow>
              <SkeletonRow>
                <Skeleton variant='text' height={14} width='94%' />
                <Skeleton variant='text' height={14} width='78%' />
              </SkeletonRow>
            </ContentStack>
          </ArticleCard>
        </Main>

        <TocSkeleton aria-hidden='true'>
          <Skeleton variant='text' height={12} width={86} />
          <div style={{ height: 10 }} />
          <Skeleton variant='text' height={12} width='90%' />
          <Skeleton variant='text' height={12} width='80%' />
          <Skeleton variant='text' height={12} width='86%' />
          <Skeleton variant='text' height={12} width='72%' />
          <Skeleton variant='text' height={12} width='82%' />
        </TocSkeleton>
      </Grid>
    </Container>
  )
}
