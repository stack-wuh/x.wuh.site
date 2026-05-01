import { createGlobalStyle } from 'styled-components'
import { TBaseColorLevel, Tokens } from './tokens'

export const CssVariableStyles = createGlobalStyle`
  :root {
    --font-geist-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
    --font-geist-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    --font-serif: Georgia, 'Songti SC', 'Noto Serif SC', 'STSong', serif;
  }

  html, body {
    max-width: 100vw;
    overflow-x: hidden;
  }

  body {
    color: var(--text-color);
    background: var(--page-bg, var(--background-color));
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
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
    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.spaces)
        .map((key) => {
          return `--space-${key}: ${theme.spaces[key as keyof typeof theme.spaces]};`
        })
        .join(';')
    }}

    /** FontSize */
    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.fontSizes)
        .map((key) => {
          return `--font-size-${key}: ${theme.fontSizes[key as keyof typeof theme.fontSizes]};`
        })
        .join(';')
    }}

    /** Border Radius */
    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.borderRadius)
        .map((key) => {
          return `--border-radius-${key}: ${theme.borderRadius[key as keyof typeof theme.borderRadius]};`
        })
        .join(';')
    }}
  }

  :root {
    --primary-color: ${(props) => {
      const theme = props.theme as Tokens
      return theme.primary.light['500']
    }};
    --secondary-color: ${(props) => {
      const theme = props.theme as Tokens
      return theme.normal.light['500']
    }};
    --success-color: ${(props) => {
      const theme = props.theme as Tokens
      return theme.success.light['500']
    }};
    --danger-color: ${(props) => {
      const theme = props.theme as Tokens
      return theme.danger.light['500']
    }};
    --warning-color: ${(props) => {
      const theme = props.theme as Tokens
      return theme.warning.light['500']
    }};
    --text-color: ${(props) => {
      const theme = props.theme as Tokens
      return theme.background.light['100']
    }};
    --text-primary: ${(props) => {
      const theme = props.theme as Tokens
      return theme.normal.light['900']
    }};
    --text-secondary: ${(props) => {
      const theme = props.theme as Tokens
      return theme.normal.light['700']
    }};
    --text-muted: ${(props) => {
      const theme = props.theme as Tokens
      return theme.normal.light['600']
    }};
    --background-color: ${(props) => {
      const theme = props.theme as Tokens
      return theme.background.light['900']
    }};
    --transition-fast: 200ms;
    --elevation-soft: 0 2px 8px rgba(0,0,0,.04);
    --elevation-card: 0 4px 16px rgba(0,0,0,.06);
    --elevation-card-hover: 0 8px 24px rgba(0,0,0,.09);
    --radius-card: var(--border-radius-2xl);
    --accent-color: #C89060;
    --page-bg:
      linear-gradient(180deg, #F2EDE4 0%, #EDE6DA 100%);

    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.primary.light)
        .map((key) => {
          return `--primary-${key}: ${theme.primary.light[key as unknown as keyof TBaseColorLevel]};`
        })
        .join(';')
    }}

    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.normal.light)
        .map((key) => {
          return `--normal-${key}: ${theme.normal.light[key as unknown as keyof TBaseColorLevel]};`
        })
        .join(';')
    }}

      ${(props) => {
        const theme = props.theme as Tokens
        return Object.keys(theme.success.light)
          .map((key) => {
            return `--success-${key}: ${theme.success.light[key as unknown as keyof TBaseColorLevel]};`
          })
          .join(';')
      }}

        ${(props) => {
          const theme = props.theme as Tokens
          return Object.keys(theme.danger.light)
            .map((key) => {
              return `--danger-${key}: ${theme.danger.light[key as unknown as keyof TBaseColorLevel]};`
            })
            .join(';')
        }}

        ${(props) => {
          const theme = props.theme as Tokens
          return Object.keys(theme.warning.light)
            .map((key) => {
              return `--warning-${key}: ${theme.warning.light[key as unknown as keyof TBaseColorLevel]};`
            })
            .join(';')
        }}

            ${(props) => {
              const theme = props.theme as Tokens
              return Object.keys(theme.background.light)
                .map((key) => {
                  return `--background-${key}: ${theme.background.light[key as unknown as keyof TBaseColorLevel]};`
                })
                .join(';')
            }}
  }

  :root[data-theme='plain'] {
    --primary-color: #A87348;
    --secondary-color: #9B8D78;
    --text-primary: #2A2218;
    --text-secondary: #6B5E4E;
    --text-muted: #9B8D78;
    --text-color: #2A2218;

    --primary-100: #FBF4EE;
    --primary-200: #F5E4D6;
    --primary-300: #EBC9AE;
    --primary-400: #DBA87E;
    --primary-500: #C89060;
    --primary-600: #A87348;
    --primary-700: #8C5A35;
    --primary-800: #6B4325;
    --primary-900: #4A2C18;

    --normal-100: #FDFCFA;
    --normal-200: #F5F1EA;
    --normal-300: #E8E2D6;
    --normal-400: #D4CBB8;
    --normal-500: #B8AC98;
    --normal-600: #9B8D78;
    --normal-700: #6B5E4E;
    --normal-800: #4A3F32;
    --normal-900: #2A2218;

    --background-color: #F2EDE4;
    --background-100: #FFFDF9;
    --background-200: #F8F3EC;
    --background-300: #F0E8DC;
    --background-400: #E5D8C4;
    --background-500: #D4C4AC;
    --background-600: #BFA88C;
    --background-700: #A68B6C;
    --background-800: #8B7052;
    --background-900: #F2EDE4;

    --accent-color: #C89060;
    --elevation-soft: 0 2px 8px rgba(0,0,0,.04);
    --elevation-card: 0 4px 16px rgba(0,0,0,.06);
    --elevation-card-hover: 0 8px 24px rgba(0,0,0,.09);
    --page-bg:
      linear-gradient(180deg, #F2EDE4 0%, #EDE6DA 100%);
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
    :root {
      --primary-color: ${(props) => {
        const theme = props.theme as Tokens
        return theme.primary.dark['500']
      }};
      --secondary-color: ${(props) => {
        const theme = props.theme as Tokens
        return theme.normal.dark['500']
      }};
      --success-color: ${(props) => {
        const theme = props.theme as Tokens
        return theme.success.dark['500']
      }};
      --danger-color: ${(props) => {
        const theme = props.theme as Tokens
        return theme.danger.dark['500']
      }};
      --warning-color: ${(props) => {
        const theme = props.theme as Tokens
        return theme.warning.dark['500']
      }};
      --text-color: ${(props) => {
        const theme = props.theme as Tokens
        return theme.normal.dark['500']
      }};
      --text-primary: ${(props) => {
        const theme = props.theme as Tokens
        return theme.normal.dark['500']
      }};
      --text-secondary: ${(props) => {
        const theme = props.theme as Tokens
        return theme.normal.dark['700']
      }};
      --text-muted: ${(props) => {
        const theme = props.theme as Tokens
        return theme.normal.dark['800']
      }};
      --background-color: ${(props) => {
        const theme = props.theme as Tokens
        return theme.background.dark['900']
      }};
      --transition-fast: 200ms;
      --elevation-soft: 0 2px 8px rgba(0,0,0,.18);
      --elevation-card: 0 4px 16px rgba(0,0,0,.32);
      --elevation-card-hover: 0 8px 24px rgba(0,0,0,.45);
      --radius-card: var(--border-radius-2xl);
      --accent-color: #D4A478;
      --page-bg:
        linear-gradient(180deg, #1a1512 0%, #14100e 100%);

      ${(props) => {
        const theme = props.theme as Tokens
        return Object.keys(theme.primary.dark)
          .map((key) => {
            return `--primary-${key}: ${theme.primary.dark[key as unknown as keyof TBaseColorLevel]};`
          })
          .join(';')
      }}

    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.normal.dark)
        .map((key) => {
          return `--normal-${key}: ${theme.normal.dark[key as unknown as keyof TBaseColorLevel]};`
        })
        .join(';')
    }}

      ${(props) => {
        const theme = props.theme as Tokens
        return Object.keys(theme.success.dark)
          .map((key) => {
            return `--success-${key}: ${theme.success.dark[key as unknown as keyof TBaseColorLevel]};`
          })
          .join(';')
      }}

        ${(props) => {
          const theme = props.theme as Tokens
          return Object.keys(theme.danger.dark)
            .map((key) => {
              return `--danger-${key}: ${theme.danger.dark[key as unknown as keyof TBaseColorLevel]};`
            })
            .join(';')
        }}

        ${(props) => {
          const theme = props.theme as Tokens
          return Object.keys(theme.warning.dark)
            .map((key) => {
              return `--warning-${key}: ${theme.warning.dark[key as unknown as keyof TBaseColorLevel]};`
            })
            .join(';')
        }}

            ${(props) => {
              const theme = props.theme as Tokens
              return Object.keys(theme.background.dark)
                .map((key) => {
                  return `--background-${key}: ${theme.background.dark[key as unknown as keyof TBaseColorLevel]};`
                })
                .join(';')
            }}
    }

    :root[data-theme='plain'] {
      --primary-color: #D4A478;
      --secondary-color: #BFA88C;
      --text-primary: #F5F1EA;
      --text-secondary: rgba(245, 241, 234, 0.78);
      --text-muted: rgba(245, 241, 234, 0.62);
      --text-color: #F5F1EA;

      --background-color: #14100e;
      --background-100: #1c1814;
      --background-200: #221c18;
      --background-300: #2a221c;
      --background-900: #0b0908;

      --normal-300: rgba(255, 255, 255, 0.12);
      --normal-600: rgba(255, 255, 255, 0.28);
      --elevation-soft: 0 2px 8px rgba(0,0,0,.22);
      --elevation-card: 0 4px 16px rgba(0,0,0,.36);
      --elevation-card-hover: 0 8px 24px rgba(0,0,0,.5);
      --page-bg:
        linear-gradient(180deg, #14100e, #0b0908);
    }
  }
`
