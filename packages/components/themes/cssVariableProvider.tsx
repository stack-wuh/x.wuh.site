import { createGlobalStyle } from 'styled-components'
import { TBaseColorLevel, Tokens } from './tokens'

export const CssVariableStyles = createGlobalStyle`
  :root {
    --font-geist-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
    --font-geist-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
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
    --transition-fast: 180ms;
    --elevation-soft: 0 4px 14px rgba(0,0,0,.06);
    --elevation-card: 0 20px 40px rgba(0,0,0,0.08);
    --elevation-card-hover: 0 30px 50px rgba(0,0,0,0.12);
    --radius-card: var(--border-radius-2xl);
    --accent-color: #E3B567;
    --page-bg:
      radial-gradient(circle at 18% 0%, color-mix(in oklab, var(--primary-color) 18%, transparent), transparent 55%),
      radial-gradient(circle at 88% 18%, color-mix(in oklab, var(--accent-color) 22%, transparent), transparent 52%),
      linear-gradient(180deg,
        color-mix(in oklab, var(--background-color) 92%, var(--primary-color) 8%),
        var(--background-color));

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
      --transition-fast: 180ms;
      --elevation-soft: 0 4px 14px rgba(0,0,0,.25);
      --elevation-card: 0 18px 36px rgba(0,0,0,0.45);
      --elevation-card-hover: 0 26px 46px rgba(0,0,0,0.6);
      --radius-card: var(--border-radius-2xl);
      --accent-color: #E3B567;
      --page-bg:
        radial-gradient(circle at 18% 0%, color-mix(in oklab, var(--primary-color) 18%, transparent), transparent 55%),
        radial-gradient(circle at 88% 18%, color-mix(in oklab, var(--accent-color) 18%, transparent), transparent 52%),
        linear-gradient(180deg,
          color-mix(in oklab, var(--background-color) 92%, var(--primary-color) 8%),
          var(--background-color));

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
  }
`
