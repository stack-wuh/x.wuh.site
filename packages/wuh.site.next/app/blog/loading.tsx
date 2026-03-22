'use client'

import styled from 'styled-components'
import Skeleton from '@wuh.site/components/skeleton'

const Container = styled.div`
  max-width: 920px;
  margin: 0 auto;
  padding: 72px 56px;
  color: var(--text-primary);

  @media (max-width: 900px) {
    padding: 64px 32px;
  }

  @media (max-width: 640px) {
    padding: 48px 20px;
  }
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
  border: 1px solid var(--normal-300);
  border-radius: 12px;
  background: var(--background-100);

  @media (prefers-color-scheme: dark) {
    background: var(--normal-800);
    border-color: var(--normal-600);
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
  border: 1px solid var(--normal-300);
  background: var(--background-100);

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
    background: var(--normal-800);
  }
`

const renderRows = (count: number) => Array.from({ length: count }, (_, index) => index)

export default function Loading() {
  return (
    <Container>
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
    </Container>
  )
}
