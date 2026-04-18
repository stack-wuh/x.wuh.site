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

  :root[data-theme='plain'] {
    --primary-color: #a13531;
    --secondary-color: #8d6e63;
    --text-primary: #2a211d;
    --text-secondary: #6b544b;
    --text-muted: #8d6e63;
    --text-color: #2a211d;

    --primary-100: #faeae9;
    --primary-200: #f3d5d2;
    --primary-300: #e6b2ae;
    --primary-400: #c35b57;
    --primary-500: #a13531;
    --primary-600: #7f2523;
    --primary-700: #641c1b;
    --primary-800: #4c1515;
    --primary-900: #331010;

    --normal-100: #ffffff;
    --normal-200: #f3efe9;
    --normal-300: #e1d6cc;
    --normal-400: #c9b9ac;
    --normal-500: #ae9a8c;
    --normal-600: #8d6e63;
    --normal-700: #6b544b;
    --normal-800: #4b3a33;
    --normal-900: #2a211d;

    --background-color: #f5efe6;
    --background-100: #fffbf6;
    --background-200: #f4eee7;
    --background-300: #ece3da;
    --background-400: #e2d5c8;
    --background-500: #d4c2b0;
    --background-600: #c2aa93;
    --background-700: #a88c72;
    --background-800: #7e6554;
    --background-900: #4a3a33;

    --accent-color: #e3b567;
    --elevation-soft: 0 4px 14px rgba(0,0,0,.05);
    --elevation-card: 0 16px 32px rgba(0,0,0,0.08);
    --elevation-card-hover: 0 22px 40px rgba(0,0,0,0.12);
    --page-bg:
      radial-gradient(circle at 18% 0%, color-mix(in oklab, var(--accent-color) 16%, transparent), transparent 55%),
      linear-gradient(180deg, #f7f1ea, #f3e7d8);
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

    :root[data-theme='plain'] {
      --primary-color: #f07a73;
      --secondary-color: #c2aa93;
      --text-primary: #f8f1ea;
      --text-secondary: rgba(248, 241, 234, 0.82);
      --text-muted: rgba(248, 241, 234, 0.68);
      --text-color: #f8f1ea;

      --background-color: #14100f;
      --background-100: #1c1614;
      --background-200: #221a18;
      --background-300: #2a201d;
      --background-900: #0b0908;

      --normal-300: rgba(255, 255, 255, 0.16);
      --normal-600: rgba(255, 255, 255, 0.32);
      --elevation-soft: 0 4px 14px rgba(0,0,0,.28);
      --elevation-card: 0 18px 36px rgba(0,0,0,0.48);
      --elevation-card-hover: 0 26px 46px rgba(0,0,0,0.62);
      --page-bg:
        radial-gradient(circle at 18% 0%, color-mix(in oklab, var(--primary-color) 18%, transparent), transparent 55%),
        radial-gradient(circle at 88% 18%, color-mix(in oklab, var(--accent-color) 16%, transparent), transparent 52%),
        linear-gradient(180deg, #0b0908, #14100f);
    }
  }
`
