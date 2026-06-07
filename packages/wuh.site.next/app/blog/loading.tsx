'use client'

import styled from '@wuh.site/components/styled'
import Skeleton from '@wuh.site/components/skeleton'

const Root = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-sans);
  background: transparent;
  padding: clamp(24px, 3vw, 64px) clamp(16px, 4vw, 60px);
`

const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xl);
  padding: clamp(24px, 3vw, 48px) clamp(20px, 5vw, 32px);
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
`

const YearGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;

  @media (max-width: 520px) {
    flex-wrap: wrap;
    gap: 6px;
  }
`

const PaginationSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: var(--space-lg);
  width: 100%;
`

const renderGroups = (count: number) => Array.from({ length: count }, (_, i) => i)

export default function Loading() {
  return (
    <Root>
      <Main>
        <Header>
          <Skeleton variant='text' height={30} width='28%' />
          <Skeleton variant='text' height={13} width={260} />
        </Header>

        <Timeline>
          {renderGroups(2).map((group) => (
            <YearGroup key={group}>
              <Skeleton variant='text' height={13} width={48} />
              {renderGroups(3).map((item) => (
                <Row key={`${group}-${item}`}>
                  <Skeleton variant='circle' width={6} height={6} shimmer={false} />
                  <Skeleton variant='text' height={15} width={`${50 + (item % 3) * 18}%`} />
                  <Skeleton variant='rect' height={20} width={56} radius={4} />
                  <Skeleton variant='text' height={12} width={64} />
                </Row>
              ))}
            </YearGroup>
          ))}
        </Timeline>

        <PaginationSkeleton aria-hidden='true'>
          <Skeleton variant='text' width={56} height={14} />
          <Skeleton variant='text' width={80} height={18} />
          <Skeleton variant='text' width={56} height={14} />
        </PaginationSkeleton>
      </Main>
    </Root>
  )
}
