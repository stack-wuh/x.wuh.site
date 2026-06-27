'use client'
import * as React from 'react'
import styled from '@wuh.site/components/styled'
import { useThemeMode, type Theme } from '@/app/components/theme/ThemeModeProvider'

const H2 = styled.h2`
  margin-top: 32px;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
`

const SwatchRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  gap: 0;
  margin: 8px 0 16px;

  & > div {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 500;
    font-family: var(--font-mono);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      height: 92px;
      margin-top: -12px;
    }
  }
`

const ToggleBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0 32px;
`

const ThemeChip = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  border: 1px solid ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--normal-300)')};
  background: ${(p) => (p.$active ? 'color-mix(in srgb, var(--primary-color) 12%, transparent)' : 'var(--background-100)')};
  color: ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--text-secondary)')};
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
  }
`

const Label = styled.span`
  display: inline-block;
  width: 140px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`

const THEME_OPTIONS: Theme[] = ['wine', 'plain']
const THEME_LABELS: Record<Theme, string> = {
  wine: '酒红',
  plain: '素雅',
}

const COLOR_NAMES = ['primary', 'normal', 'background', 'success', 'danger', 'warning'] as const

const SEMANTIC_VARS = [
  '--primary-color', '--secondary-color', '--success-color', '--danger-color', '--warning-color',
  '--text-primary', '--text-secondary', '--text-muted', '--background-color', '--accent-color',
] as const

function readPalette(name: string): string[] {
  if (typeof window === 'undefined') return []
  const result: string[] = []
  for (let l = 100; l <= 900; l += 100) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}-${l}`)
      .trim()
    result.push(value || '#N/A')
  }
  return result
}

function readVar(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function Swatch({ colors }: { colors: string[] }) {
  return (
    <SwatchRow>
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            backgroundColor: color,
            color: i < 4 ? '#fff' : '#111',
          }}
          title={`${(i + 1) * 100}: ${color}`}
        >
          {color}
        </div>
      ))}
    </SwatchRow>
  )
}

export default function DesignTokenPage() {
  const { theme } = useThemeMode()
  const [previewTheme, setPreviewTheme] = React.useState<Theme | null>(null)
  const [, forceRender] = React.useState(0)

  const activeTheme = previewTheme ?? theme

  // Apply preview family to DOM, restore on cleanup
  React.useEffect(() => {
    if (!previewTheme) return
    document.documentElement.dataset.themeFamily = previewTheme
    forceRender((n) => n + 1)
    return () => {
      document.documentElement.dataset.themeFamily = theme
      forceRender((n) => n + 1)
    }
  }, [previewTheme, theme])

  const [currentColors, setCurrentColors] = React.useState<Record<string, string[]>>({})
  const [semanticVals, setSemanticVals] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const colors: Record<string, string[]> = {}
    for (const name of COLOR_NAMES) {
      colors[name] = readPalette(name)
    }
    setCurrentColors(colors)

    const svals: Record<string, string> = {}
    for (const v of SEMANTIC_VARS) {
      svals[v] = readVar(v)
    }
    setSemanticVals(svals)
  }, [activeTheme])

  return (
    <div style={{ padding: '48px', maxWidth: '960px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--text-primary)' }}>
        Design Token 调试面板
      </h1>

      <ToggleBar>
        <ThemeChip $active={!previewTheme} onClick={() => setPreviewTheme(null)}>
          跟随页面
        </ThemeChip>
        {THEME_OPTIONS.map((t) => (
          <ThemeChip key={t} $active={activeTheme === t} onClick={() => setPreviewTheme(t)}>
            {THEME_LABELS[t]}
          </ThemeChip>
        ))}
      </ToggleBar>

      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 24 }}>
        生效主题: <strong>{THEME_LABELS[activeTheme]}</strong>
        &nbsp;| &lt;html data-theme-family=&quot;{activeTheme}&quot; data-color-scheme=&quot;跟随系统&quot;&gt;
      </p>

      <H2>语义变量</H2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px 16px' }}>
        {SEMANTIC_VARS.map((v) => {
          const val = semanticVals[v] ?? ''
          return (
            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: val || 'transparent', border: '1px solid var(--normal-300)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{v}</span>
            </div>
          )
        })}
      </div>

      {COLOR_NAMES.map((name) => (
        <React.Fragment key={name}>
          <H2>{name.charAt(0).toUpperCase() + name.slice(1)}</H2>
          {currentColors[name] ? (
            <Swatch colors={currentColors[name]} />
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>加载中...</p>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 4, marginBottom: 16 }}>
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((l) => (
              <Label key={l}>--{name}-{l}</Label>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
