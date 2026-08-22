import styled from '@wuh.site/components/styled'

export const Header = styled.header`
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-lg);
  flex-wrap: wrap;
`

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`

export const Title = styled.h1`
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.03em;
  color: var(--text-primary);
`

export const Subtitle = styled.p`
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--text-muted);
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`
