import styled from '@wuh.site/components/styled'

export const FloatingButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 640px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`
