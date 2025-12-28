import { createGlobalStyle } from 'styled-components'
import { TBaseColorLevel } from './tokens'

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
    --primary-color: ${(props) => props.theme.primary.light['500']};
    --secondary-color: ${(props) => props.theme.normal.light['500']};
    --success-color: ${(props) => props.theme.success.light['500']};
    --danger-color: ${(props) => props.theme.danger.light['500']};
    --warning-color: ${(props) => props.theme.warning.light['500']};
    --text-color: ${(props) => props.theme.normal.light['800']};
    --background-color: ${(props) => props.theme.background.light['900']};

    ${(props) =>
      Object.keys(props.theme.primary.light)
        .map((key) => {
          return `--primary-${key}: ${props.theme.primary.light[key as unknown as keyof TBaseColorLevel]};`
        })
        .join(';')}

    ${(props) =>
      Object.keys(props.theme.normal.light)
        .map((key) => {
          return `--normal-${key}: ${props.theme.normal.light[key as unknown as keyof TBaseColorLevel]};`
        })
        .join(';')}

      ${(props) =>
        Object.keys(props.theme.success.light)
          .map((key) => {
            return `--success-${key}: ${props.theme.success.light[key as unknown as keyof TBaseColorLevel]};`
          })
          .join(';')}

        ${(props) =>
          Object.keys(props.theme.danger.light)
            .map((key) => {
              return `--danger-${key}: ${props.theme.danger.light[key as unknown as keyof TBaseColorLevel]};`
            })
            .join(';')}

        ${(props) =>
          Object.keys(props.theme.warning.light)
            .map((key) => {
              return `--warning-${key}: ${props.theme.warning.light[key as unknown as keyof TBaseColorLevel]};`
            })
            .join(';')}

            ${(props) =>
              Object.keys(props.theme.background.light)
                .map((key) => {
                  return `--background-${key}: ${props.theme.background.light[key as unknown as keyof TBaseColorLevel]};`
                })
                .join(';')}
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
    :root {
      --primary-color: ${(props) => props.theme.primary.dark['500']};
      --secondary-color: ${(props) => props.theme.normal.dark['500']};
      --success-color: ${(props) => props.theme.success.dark['500']};
      --danger-color: ${(props) => props.theme.danger.dark['500']};
      --warning-color: ${(props) => props.theme.warning.dark['500']};
      --text-color: ${(props) => props.theme.normal.dark['800']};
      --background-color: ${(props) => props.theme.background.dark['500']};

      ${(props) =>
        Object.keys(props.theme.primary.dark)
          .map((key) => {
            return `--primary-${key}: ${props.theme.primary.dark[key as unknown as keyof TBaseColorLevel]};`
          })
          .join(';')}

    ${(props) =>
      Object.keys(props.theme.normal.dark)
        .map((key) => {
          return `--normal-${key}: ${props.theme.normal.dark[key as unknown as keyof TBaseColorLevel]};`
        })
        .join(';')}

      ${(props) =>
        Object.keys(props.theme.success.dark)
          .map((key) => {
            return `--success-${key}: ${props.theme.success.dark[key as unknown as keyof TBaseColorLevel]};`
          })
          .join(';')}

        ${(props) =>
          Object.keys(props.theme.danger.dark)
            .map((key) => {
              return `--danger-${key}: ${props.theme.danger.dark[key as unknown as keyof TBaseColorLevel]};`
            })
            .join(';')}

        ${(props) =>
          Object.keys(props.theme.warning.dark)
            .map((key) => {
              return `--warning-${key}: ${props.theme.warning.dark[key as unknown as keyof TBaseColorLevel]};`
            })
            .join(';')}

            ${(props) =>
              Object.keys(props.theme.background.dark)
                .map((key) => {
                  return `--background-${key}: ${props.theme.background.dark[key as unknown as keyof TBaseColorLevel]};`
                })
                .join(';')}
    }
  }
`
