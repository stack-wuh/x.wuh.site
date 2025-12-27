import styled from 'styled-components'

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: ${(props) => props.theme.fontSizes.base};
  line-height: 1.5;
  text-align: center;
`