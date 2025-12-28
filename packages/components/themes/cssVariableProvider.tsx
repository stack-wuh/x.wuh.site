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

  /* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
  @font-face {
    font-family: 'iconfont';  /* Project id 2595178 */
    src: 
        url('//at.alicdn.com/t/font_2595178_wa25xow6jmp.woff2?t=1623580472696') format('woff2'),
        url('//at.alicdn.com/t/font_2595178_wa25xow6jmp.woff?t=1623580472696') format('woff'),
        url('//at.alicdn.com/t/font_2595178_wa25xow6jmp.ttf?t=1623580472696') format('truetype');
  }

  .iconfont {
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
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
    ${(props) => Object.keys(props.theme.gradients.light).map((key) => {
      return `--gradient-${key}: ${props.theme.gradients.light[key as keyof typeof props.theme.gradients.light]};`
    }).join(';')}
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
      ${(props) => Object.keys(props.theme.gradients.dark).map((key) => {
        return `--gradient-${key}: ${props.theme.gradients.dark[key as keyof typeof props.theme.gradients.dark]};`
      }).join(';')}
    }
  }
`
