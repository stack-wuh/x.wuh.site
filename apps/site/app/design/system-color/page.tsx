"use client";

import * as React from "react";
import {
  useThemeMode,
  type Theme,
} from "@/app/components/theme/ThemeModeProvider";
import * as S from "./styles";
import {
  COLOR_NAMES,
  SCALE_LABELS,
  SEMANTIC_VARS,
  THEME_LABELS,
  THEME_OPTIONS,
} from "./specs";

function readPalette(name: string): string[] {
  if (typeof window === "undefined") return [];
  const result: string[] = [];
  for (let l = 100; l <= 900; l += 100) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}-${l}`)
      .trim();
    result.push(value || "#N/A");
  }
  return result;
}

function readVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function Swatch({ colors }: { colors: string[] }) {
  return (
    <S.SwatchRow>
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            backgroundColor: color,
            color: i < 4 ? "#fff" : "#111",
          }}
          title={`${(i + 1) * 100}: ${color}`}
        >
          {color}
        </div>
      ))}
    </S.SwatchRow>
  );
}

export default function DesignTokenPage() {
  const { theme } = useThemeMode();
  const [previewTheme, setPreviewTheme] = React.useState<Theme | null>(null);
  const [, forceRender] = React.useState(0);

  const activeTheme = previewTheme ?? theme;

  React.useEffect(() => {
    if (!previewTheme) return;
    document.documentElement.dataset.themeFamily = previewTheme;
    forceRender((n) => n + 1);
    return () => {
      document.documentElement.dataset.themeFamily = theme;
      forceRender((n) => n + 1);
    };
  }, [previewTheme, theme]);

  const [currentColors, setCurrentColors] = React.useState<
    Record<string, string[]>
  >({});
  const [semanticVals, setSemanticVals] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    const colors: Record<string, string[]> = {};
    for (const name of COLOR_NAMES) {
      colors[name] = readPalette(name);
    }
    setCurrentColors(colors);

    const svals: Record<string, string> = {};
    for (const v of SEMANTIC_VARS) {
      svals[v] = readVar(v);
    }
    setSemanticVals(svals);
  }, [activeTheme]);

  return (
    <S.Root>
      <S.Title>Design Token 调试面板</S.Title>

      <S.ToggleBar>
        <S.ThemeChip
          $active={!previewTheme}
          onClick={() => setPreviewTheme(null)}
        >
          跟随页面
        </S.ThemeChip>
        {THEME_OPTIONS.map((t) => (
          <S.ThemeChip
            key={t}
            $active={activeTheme === t}
            onClick={() => setPreviewTheme(t)}
          >
            {THEME_LABELS[t]}
          </S.ThemeChip>
        ))}
      </S.ToggleBar>

      <S.ActiveThemeText>
        生效主题: <strong>{THEME_LABELS[activeTheme]}</strong>
        &nbsp;| &lt;html data-theme-family=&quot;{activeTheme}&quot;
        data-color-scheme=&quot;跟随系统&quot;&gt;
      </S.ActiveThemeText>

      <S.H2>语义变量</S.H2>
      <S.SemanticGrid>
        {SEMANTIC_VARS.map((v) => {
          const val = semanticVals[v] ?? "";
          return (
            <S.SemanticItem key={v}>
              <S.SemanticColor
                style={{ backgroundColor: val || "transparent" }}
              />
              <S.SemanticName>{v}</S.SemanticName>
            </S.SemanticItem>
          );
        })}
      </S.SemanticGrid>

      {COLOR_NAMES.map((name) => (
        <React.Fragment key={name}>
          <S.H2>{name.charAt(0).toUpperCase() + name.slice(1)}</S.H2>
          {currentColors[name] ? (
            <Swatch colors={currentColors[name]} />
          ) : (
            <S.MutedText>加载中...</S.MutedText>
          )}
          <S.LabelRow>
            {SCALE_LABELS.map((l) => (
              <S.Label key={l}>
                --{name}-{l}
              </S.Label>
            ))}
          </S.LabelRow>
        </React.Fragment>
      ))}
    </S.Root>
  );
}
