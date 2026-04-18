'use client'

import styled from 'styled-components'
import Skeleton from '@wuh.site/components/skeleton'

const Root = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background: transparent;
  padding: clamp(24px, 3vw, 64px) clamp(16px, 4vw, 60px);
`

const Main = styled.main`
  width: min(1200px, 100%);
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xl);
  padding: clamp(32px, 3vw, 72px) clamp(20px, 5vw, 56px);
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 16px 20px;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-card);
  background: var(--background-100);
  box-shadow: var(--elevation-soft);

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
  }
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: var(--space-lg);
`

const PageItem = styled.div`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.06);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
  }
`

const renderRows = (count: number) => Array.from({ length: count }, (_, index) => index)

export default function Loading() {
  return (
    <Root>
      <Main>
        <Header>
          <Skeleton variant='text' height={30} width='32%' />
          <HeaderRow>
            <Skeleton variant='text' height={14} width={220} />
            <Skeleton variant='text' height={14} width={140} />
          </HeaderRow>
        </Header>

        <List>
          {renderRows(6).map((item) => (
            <Card key={item}>
              <Skeleton variant='text' height={16} width='70%' />
              <Skeleton variant='text' height={12} width='28%' />
              <MetaRow>
                <Skeleton variant='rect' height={20} width={64} radius={999} />
                <Skeleton variant='rect' height={20} width={72} radius={999} />
                <Skeleton variant='rect' height={20} width={56} radius={999} />
              </MetaRow>
            </Card>
          ))}
        </List>

        <Pagination aria-hidden='true'>
          <PageItem>
            <Skeleton variant='text' width={40} height={12} />
          </PageItem>
          <PageItem>
            <Skeleton variant='text' width={18} height={12} />
          </PageItem>
          <PageItem>
            <Skeleton variant='text' width={18} height={12} />
          </PageItem>
          <PageItem>
            <Skeleton variant='text' width={40} height={12} />
          </PageItem>
        </Pagination>
      </Main>
    </Root>
  )
}
