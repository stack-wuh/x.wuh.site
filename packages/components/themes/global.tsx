import styled from 'styled-components'

export const Flex = styled.div<{ $gap?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.$gap ?? props.theme.spaces.lg};
`