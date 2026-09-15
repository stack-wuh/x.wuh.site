import styled from 'styled-components'
import Link from 'next/link'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

/**
 * 静默条：Header 只做导航与主题入口，视觉全部退后。
 * 整层是辅助信息（与页脚同一档位）：根层自持字体族/字号/行高，行内不再各自声明；
 * 挂在页面容器之外，页面级 font-family 覆盖不到，缺失即回落浏览器默认族。
 * 间距/偏移/圆角只经 --space-* / --border-radius-* 令牌，断点只用 BREAKPOINTS 语义常量。
 */

export const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid color-mix(in oklab, var(--text-muted) 18%, transparent);
  background:
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-color) 72%, transparent),
      color-mix(in oklab, var(--background-color) 84%, transparent)
    );
  backdrop-filter: blur(10px);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  /* 控件条的紧凑行高：不引全站 --line-height-body/heading，两端都落不进控件尺寸 */
  --header-lh: 1.5;
  line-height: var(--header-lh);
  /* 导航行字号档：Header 导航是主动线入口，不落页脚那种 12px 辅助档。
   * 640–1023 平板带用 13px（四主题无稳定 13px 令牌——--font-size-sm 素雅覆写为
   * 15px，正是体检抓出的陷阱，故取局部字面量并注释豁免）；
   * ≥1024 PC 带升到 base 档 15px：宽屏下 13px 视觉参照系偏小（用户实测反馈），
   * 与正文同档的主导航在宽栏里才立得住。 */
  --header-fs: 13px;

  @media (min-width: ${BREAKPOINTS.tablet}px) { --header-fs: var(--font-size-base); }
`

export const HeaderInner = styled.div`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: var(--space-base) var(--space-md);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-sm);
`

export const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  color: var(--text-color);
  min-width: 0;

  /* logo 与导航同参照系缩放：高 = 字号档 ×2（平板 13→26、PC 15→30），宽按 42:26 原比例。
     不新增断点——分档变化由 --header-fs 单点承担 */
  svg {
    height: calc(var(--header-fs) * 2);
    width: calc(var(--header-fs) * 2 / 26 * 42);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: calc(var(--space-xs) / 2);
    border-radius: var(--border-radius-base);
  }
`

export const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: var(--space-sm);

  @media (min-width: ${BREAKPOINTS.mobile}px) { display: flex; }
`

export const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--space-base);
`

export const NavLink = styled(Link)`
  position: relative;
  text-decoration: none;
  color: color-mix(in oklab, var(--text-color) 78%, transparent);
  font-size: var(--header-fs);
  padding: var(--space-xs) var(--space-base);
  transition: color var(--transition-fast) ease;

  /* 下划线是一支运笔：scaleX 从左行笔到右（一横的笔顺），不再是透明度淡入——
     静态语言不变，但出现的方式有了方向和速度 */
  &::after {
    content: '';
    position: absolute;
    left: var(--space-base);
    right: var(--space-base);
    bottom: calc(var(--space-base) / 2);
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--primary-color) 18%, var(--primary-color) 82%, transparent);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform var(--transition-fast) ease-out;
  }

  &:hover,
  &:focus-visible {
    text-decoration: none;
    color: var(--text-color);
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
  }

  /* 当前页常驻同一笔：与 hover 同语言、只差时长。样式直接挂在可访问语义
     aria-current='page' 上（tsx 侧声明），不再另造视觉状态标记 */
  &[aria-current='page'] {
    color: var(--text-color);

    &::after {
      transform: scaleX(1);
    }
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: calc(var(--space-xs) / 2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::after { transition: none; }
  }
`

/* 外链标记：↗ 传达的是信息（点它会离开本站），不是装饰；淡化色与导航同一 mix 语言 */
export const ExternalMark = styled.span`
  margin-left: calc(var(--space-xs) / 4);
  font-size: 0.85em;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`

export const MobileToggle = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-md);
  border: 1px solid color-mix(in oklab, var(--normal-300) 60%, transparent);
  padding: 0;
  background: color-mix(in oklab, var(--background-100) 70%, transparent);
  color: var(--text-primary);
  font: inherit;
  cursor: pointer;
  transition: transform var(--transition-fast) ease, background var(--transition-fast) ease, border-color var(--transition-fast) ease;

  svg {
    display: block;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  @media (min-width: ${BREAKPOINTS.mobile}px) { display: none; }

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 35%, var(--normal-300) 65%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: calc(var(--space-xs) / 2);
  }

  @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
`

export const AppearanceRoot = styled.div`
  position: relative;
  display: none;

  @media (min-width: ${BREAKPOINTS.mobile}px) { display: block; }
`

/*
 * 主题入口 = 朱砂印「墨」：打开墨签弹层选墨，动作本就是"钤印"——印面即装饰，
 * 不再挂渐隐下划线（弹层里墨字段才用下划线，印上加线是双份装饰）。
 * 行盒仍与 NavLink 同高（--header-fs × --header-lh + 上下 padding），行的节奏不随入口形态变化。
 * 可发现性：aria-label 含当前主题态 + 原生 title 悬停提示。
 * 状态直挂印面（$open transient prop + 自身 :hover）——不用跨组件插值选择器
 * （`.trigger:hover .seal` 在 SSR 双写 styleSheets 下实测不生效）。
 */
export const ThemeSeal = styled.span<{ $open?: boolean }>`
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  /* 边框拆长写：color-mix 留在 border 简写里时，:hover/态切换的 border-color 长写在部分内核上覆盖不可靠 */
  border-width: 1px;
  border-style: solid;
  border-color: ${({ $open }) => ($open ? 'var(--primary-color)' : 'color-mix(in oklab, var(--primary-color) 45%, transparent)')};
  border-radius: var(--border-radius-xs);
  color: var(--primary-color);
  font-family: var(--font-serif);
  font-size: var(--font-size-xs);
  line-height: 1;
  transition: border-color var(--transition-fast) ease;

  &:hover { border-color: var(--primary-color); }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`

export const AppearanceTrigger = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xs) var(--space-base);
  /* font 简写必须排在 font-size 之前——同块内后写的简写会把先声明的字号重置回继承值 */
  font: inherit;
  font-size: var(--header-fs);
  min-height: calc(1em * var(--header-lh) + var(--space-xs) * 2);
  border: 0;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: calc(var(--space-xs) / 2);
  }
`

/* 纸卡容器：不透明纸面 + 发丝线 + 小圆角 + 轻投影；
   去毛玻璃/inset 白高光——Header 已换纸墨语言，SaaS 玻璃卡不再搭配 */
export const DesktopAppearancePopover = styled.div`
  position: absolute;
  top: calc(100% + var(--space-base));
  right: 0;
  z-index: 70;
  width: 292px;
  padding: var(--space-sm);
  border: 1px solid color-mix(in oklab, var(--normal-300) 58%, transparent);
  border-radius: var(--border-radius-base);
  background: var(--background-100);
  box-shadow: var(--elevation-soft);
  animation: appearance-enter 200ms ease-out;

  @keyframes appearance-enter {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) { animation: none; }
`

export const AppearanceGroup = styled.div`
  & + & { margin-top: var(--space-base); padding-top: var(--space-base); border-top: 1px solid color-mix(in oklab, var(--normal-300) 48%, transparent); }
`

export const AppearanceLabel = styled.div`
  margin-bottom: var(--space-xs);
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  font-weight: 700;
  letter-spacing: 0.08em;
`

export const ThemeSwatches = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-base);
`

export const ThemeSwatch = styled.button`
  appearance: none;
  display: grid;
  gap: var(--space-xs);
  justify-items: center;
  padding: var(--space-xs);
  border: 1px solid color-mix(in oklab, var(--normal-300) 55%, transparent);
  border-radius: var(--border-radius-base);
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  cursor: pointer;
  transition: border-color var(--transition-fast) ease;

  &:hover { border-color: color-mix(in oklab, var(--primary-color) 35%, var(--normal-300) 65%); }
  &[aria-pressed='true'] { border-color: var(--primary-color); }
  &:focus-visible { outline: 2px solid color-mix(in oklab, var(--primary-color) 72%, white); outline-offset: calc(var(--space-xs) / 2); }
`

/*
 * 试笔墨签：每个主题的「真实样本」——该主题的纸色打底、墨色写一个「朝」、
 * 下方压一根该主题的朱砂/赭线（Divider ornament 同语言）。
 * 色值引用 Layer 1 原始调色板变量（--_wl-* / --_pl-* 恒定挂在 :root，
 * 不随当前主题路由）：预览独立于当前主题，且零复制漂移。
 * 字高 = 导航字号档 ×2（平板 26 / PC 30），与 logo 同一参照系。
 */
export const InkSample = styled.div<{ $paper: string; $ink: string; $line: string }>`
  display: grid;
  justify-items: center;
  width: 100%;
  padding: var(--space-xs) var(--space-base) calc(var(--space-xs) / 2);
  border-radius: var(--border-radius-sm);
  background: ${({ $paper }) => $paper};
  color: ${({ $ink }) => $ink};
  font-family: var(--font-serif);
  font-size: calc(var(--header-fs) * 2);
  line-height: var(--header-lh);

  .ink-rule {
    width: 62%;
    height: 1px;
    margin-top: calc(var(--space-xs) / 2);
    background: linear-gradient(90deg, transparent, ${({ $line }) => $line} 22%, ${({ $line }) => $line} 78%, transparent);
  }
`

/* 选中态：墨字转主题色 + 一枚朱砂点（label 承担状态，不再需要角标） */
export const SwatchLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: calc(var(--space-xs) / 2);
  /* 同 SchemeOption：避开暗色反向的 text-secondary，用 text-color 淡化表达未选中 */
  color: color-mix(in oklab, var(--text-color) 72%, transparent);

  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary-color);
    opacity: 0;
    transition: opacity var(--transition-fast) ease;
  }

  [aria-pressed='true'] & { color: var(--text-color); }
  [aria-pressed='true'] &::after { opacity: 1; }
`

/* 明暗三段：发丝线分隔的墨字，选中项用与导航 hover 同源的渐隐下划线——
   弹层里的「选中」第一次和整站交互语言同源，不再用彩色胶囊 */
export const SchemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`

export const SchemeOption = styled.button`
  appearance: none;
  position: relative;
  padding: var(--space-xs) var(--space-xs);
  border: 0;
  background: transparent;
  /* 不用 --text-secondary：暗色主题下调色板反向（600 比 500 亮），选中项会比未选中更暗。
     与 NavLink 同语言：未选中=text-color 淡化 mix，选中=实色 + 下划线 */
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  font: inherit;
  cursor: pointer;
  transition: color var(--transition-fast) ease;

  & + & { border-left: 1px solid color-mix(in oklab, var(--normal-300) 55%, transparent); }

  &::after {
    content: '';
    position: absolute;
    left: var(--space-base);
    right: var(--space-base);
    bottom: calc(var(--space-base) / 2);
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--primary-color) 18%, var(--primary-color) 82%, transparent);
    opacity: 0;
  }

  &:hover { color: var(--text-color); }
  &[aria-pressed='true'] {
    color: var(--text-color);

    &::after { opacity: 1; }
  }
  &:focus-visible { outline: 2px solid color-mix(in oklab, var(--primary-color) 72%, white); outline-offset: calc(var(--space-xs) / 2); }
`

export const ThemeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: var(--primary-color);
`

export const ThemeChevron = styled.span<{ $open?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0')});
  transition: transform var(--transition-fast, 180ms) ease-out;

  @media (prefers-reduced-motion: reduce) { transition: none; }
`

export const MobilePanel = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  padding: 0 var(--space-md) var(--space-base);

  @media (min-width: ${BREAKPOINTS.mobile}px) { display: none; }
`

export const MobileNav = styled.nav`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: var(--space-base);
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, var(--normal-300) 55%, transparent);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);
  max-height: calc(100dvh - 96px);
  overflow-y: auto;
  overscroll-behavior: contain;
  display: grid;
  gap: var(--space-base);
`

/* 菜单项是移动端的主操作，落 base 档（15px 四主题同值），不随根层辅助档缩 */
export const MobileItem = styled(Link)`
  padding: var(--space-base) var(--space-sm);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--text-primary);
  font-size: var(--font-size-base);
  background: transparent;
  border: 1px solid transparent;
  transition: background var(--transition-fast) ease, border-color var(--transition-fast) ease;

  &:hover {
    background: color-mix(in oklab, var(--background-200) 80%, transparent);
    border-color: color-mix(in oklab, var(--primary-color) 25%, var(--normal-300) 75%);
  }

  /* 当前页：菜单行没有下划线语言（行盒是卡片不是文字流），用与外观动作行
     同一支语言的墨字 + 主色淡底；与桌面导航同一 aria-current 数据源 */
  &[aria-current='page'] {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 8%, var(--background-100) 92%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: calc(var(--space-xs) / 2);
  }
`

export const MobileActions = styled.div`
  display: flex;
  gap: var(--space-xs);
  align-items: center;
`

export const MobileAppearanceAction = styled.button`
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-base);
  width: 100%;
  min-width: 44px;
  min-height: 48px;
  padding: var(--space-xs) var(--space-base);
  border: 1px solid color-mix(in oklab, var(--primary-color) 28%, var(--normal-300) 72%);
  border-radius: var(--border-radius-md);
  background: color-mix(in oklab, var(--primary-color) 8%, var(--background-100) 92%);
  color: var(--text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  transition:
    background-color var(--transition-fast, 180ms) ease-out,
    border-color var(--transition-fast, 180ms) ease-out,
    box-shadow var(--transition-fast, 180ms) ease-out;

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 46%, var(--normal-300) 54%);
    background: color-mix(in oklab, var(--primary-color) 14%, var(--background-100) 86%);
    box-shadow: var(--elevation-soft);
  }

  &:active {
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 72%, white);
    outline-offset: calc(var(--space-xs) / 2);
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`

export const MobileAppearanceOptions = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => ($expanded ? '1fr' : '0fr')};
  opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};
  transition: grid-template-rows 200ms ease, opacity 160ms ease;

  @media (prefers-reduced-motion: reduce) { transition: none; }
`

export const MobileAppearanceOptionsInner = styled.div`
  min-height: 0;
  overflow: hidden;
  padding: 0;

  ${AppearanceGroup}:first-child {
    padding-top: calc(var(--space-xs) / 2);
  }
`

export const MobileThemeMain = styled.span`
  display: flex;
  align-items: center;
  gap: var(--space-base);
  min-width: 0;
  flex: 1 1 auto;
`

export const MobileThemeCopy = styled.span`
  display: grid;
  min-width: 0;
`

export const MobileThemeTitle = styled.span`
  overflow: hidden;
  color: var(--text-primary);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MobileThemeCurrent = styled.span`
  overflow: hidden;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  text-overflow: ellipsis;
  white-space: nowrap;
`
