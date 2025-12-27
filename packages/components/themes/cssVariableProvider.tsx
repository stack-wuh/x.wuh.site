import { createGlobalStyle } from 'styled-components'

export const CssVariableStyles = createGlobalStyle`
  html, body {
    max-width: 100vw;
    overflow-x: hidden;
  }

  body {
    color: var(--text-color);
    background-color: var(--background-color);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /** Spaces **/
    ${(props) =>
      Object.keys(props.theme.spaces)
        .map((key) => {
          return `--space-${key}: ${props.theme.spaces[key as keyof typeof props.theme.spaces]};`
        })
        .join(';')}

    /** FontSize */
    ${(props) =>
      Object.keys(props.theme.fontSizes)
        .map((key) => {
          return `--font-size-${key}: ${props.theme.fontSizes[key as keyof typeof props.theme.fontSizes]};`
        })
        .join(';')}
    
    /** Border Radius */
    ${(props) =>
      Object.keys(props.theme.borderRadius)
        .map((key) => {
          return `--border-radius-${key}: ${props.theme.borderRadius[key as keyof typeof props.theme.borderRadius]};`
        })
        .join(';')}
    }

  :root {
    --primary-color: ${(props) => props.theme.colors.primary};
    --secondary-color: ${(props) => props.theme.colors.secondary};
    --success-color: ${(props) => props.theme.colors.success};
    --danger-color: ${(props) => props.theme.colors.danger};
    --warning-color: ${(props) => props.theme.colors.warning};
    --info-color: ${(props) => props.theme.colors.info};
    --text-color: ${(props) => props.theme.colors.text};
    --background-color: ${(props) => props.theme.colors.background};
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
    :root {
      --primary-color: ${(props) => props.theme.colors.primary};
      --secondary-color: ${(props) => props.theme.colors.secondary};
      --success-color: ${(props) => props.theme.colors.success};
      --danger-color: ${(props) => props.theme.colors.danger};
      --warning-color: ${(props) => props.theme.colors.warning};
      --info-color: ${(props) => props.theme.colors.info};
      --text-color: ${(props) => props.theme.colors.background};
      --background-color: ${(props) => props.theme.colors.text};
      }
  }
`
