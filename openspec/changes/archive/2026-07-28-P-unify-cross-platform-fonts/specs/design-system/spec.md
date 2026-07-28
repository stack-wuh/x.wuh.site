# Spec: 设计系统

## ADDED Requirements

### Requirement: 全站字体 token 单一入口
All font-family declarations MUST reference semantic tokens only; direct platform font names are MUST NOT be used.

#### Scenario: 组件引用字体
- **GIVEN** 全站组件需要引用字体
- **WHEN** 任何组件或页面样式声明 font-family
- **THEN** 只能引用 `var(--font-sans)`、`var(--font-serif)` 或 `var(--font-mono)` 三个语义 token
- **AND** 不直接声明 Georgia、system-ui、Menlo、Consolas、SFMono、BlinkMacSystemFont、Segoe UI 等平台字体

### Requirement: 禁止字体合成
All font weights and styles MUST be served from real font files; the browser MUST NOT synthesize bold or italic.

#### Scenario: 浏览器渲染字体
- **GIVEN** 浏览器渲染使用字体 token 的文本
- **WHEN** 当前字重在字体文件中有真实字型
- **THEN** 浏览器使用真实字型渲染，不合成粗体或斜体
- **AND** 全局 `font-synthesis: none` 确保缺失字重在开发期暴露而非被静默合成

## MODIFIED Requirements

### Requirement: CSS 变量命名规范
The font CSS variables MUST reference self-hosted Noto fonts covering CJK and Latin, with real weights 400/500/600/700.

#### Scenario: 字体 token 使用 Noto 自托管字体
- **GIVEN** 组件使用 CSS 字体变量
- **WHEN** 浏览器解析 `--font-sans`、`--font-serif`、`--font-mono`
- **THEN** `--font-sans` 由 Noto Sans SC 自托管提供，覆盖中文和 Latin，fallback 为 `ui-sans-serif, system-ui, sans-serif`
- **AND** `--font-serif` 由 Noto Serif SC 自托管提供，覆盖中文和 Latin，fallback 为 `Georgia, serif`
- **AND** `--font-mono` 由 JetBrains Mono 自托管提供，fallback 为 `ui-monospace, 'Courier New', monospace`
- **AND** 三个字体 token 的真实字重均覆盖 400/500/600/700，禁止浏览器 synthetic bold
