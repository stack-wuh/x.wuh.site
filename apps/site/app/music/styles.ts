import styled, { css, keyframes } from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { responsive } from '@wuh.site/components/themes/responsive'

/* ==========================================================================
   /music 页样式（与组件逻辑分离，样式集中导出）
   —— 年轮编年·碟心封面：左侧衬线年份纵轨 + 超大水印年份 +
   面板头小黑胶（封面做碟心圆标）+ 按语 + 曲目行（次数/最爱）
   ========================================================================== */

export const Section = styled.section`
  width: min(960px, 100%);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-base) var(--space-3xl);
  font-family: var(--font-sans);
  color: var(--text-color);
`

/* ===== 页头：站点 PageHeader 语言（标题 + 副题，与博客/关于同构） ===== */

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  gap: var(--space-lg);
  border-bottom: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);

  ${responsive(['var(--space-sm)', undefined, 'var(--space-md)'], (v) => `padding-bottom: ${v};`)}
`

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-family: var(--font-serif);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.03em;

  ${responsive(['26px', undefined, 'var(--font-size-xl)'], (v) => `font-size: ${v};`)}
`

export const PageSubtitle = styled.p`
  margin: 0;
  line-height: 1.7;

  ${responsive(['var(--font-size-xs)', undefined, 'var(--font-size-sm)'], (v) => `font-size: ${v};`)}
  ${responsive(
    [
      'color-mix(in oklab, var(--text-color) 55%, transparent)',
      undefined,
      'color-mix(in oklab, var(--text-color) 72%, transparent)',
    ],
    (v) => `color: ${v};`,
  )}
`

/* ==========================================================================
   年轮编年：纵轨 / 水印 / 碟心封面 / 按语
   ========================================================================== */

export const Chronicle = styled.div`
  position: relative;
  display: grid;

  ${responsive(['minmax(0, 1fr)', undefined, '148px minmax(0, 1fr)'], (v) => `grid-template-columns: ${v};`)}
  ${responsive(['0', undefined, 'var(--space-lg)'], (v) => `gap: ${v};`)}
  ${responsive(['var(--space-sm)', undefined, 'var(--space-lg)'], (v) => `padding-top: ${v};`)}
`

export const Rail = styled.div`
  position: relative;
  display: flex;

  /* 移动端落位：无滚动容器时 snap/scrollbar 声明惰性，直落基线静态 */
  scroll-snap-type: x proximity;
  scrollbar-width: none;

  /* 纵轨基线 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: color-mix(in oklab, var(--normal-400) 45%, transparent);
  }

  /* 移动端：年谱刻度带——纯文字沿一条基线排开，两端渐隐提示横滑，
     滚动条全隐藏（组件级 specific 于全局滚动条语言，留言板先例）；
     回退税逐条复现桌面：overflow-x visible、mask none、光标 auto */
  ${responsive(['row', undefined, 'column'], (v) => `flex-direction: ${v};`)}
  ${responsive(['baseline', undefined, 'flex-start'], (v) => `align-items: ${v};`)}
  ${responsive(['22px', undefined, '2px'], (v) => `gap: ${v};`)}
  ${responsive(['auto', undefined, 'visible'], (v) => `overflow-x: ${v};`)}
  ${responsive(['6px calc(-1 * var(--space-base)) 0', undefined, '0'], (v) => `margin: ${v};`)}
  ${responsive(['8px var(--space-base)', undefined, '0'], (v) => `padding: ${v};`)}
  ${responsive(['grab', undefined, 'auto'], (v) => `cursor: ${v};`)}
  ${responsive(
    [
      'linear-gradient(90deg, transparent, #000 20px, #000 calc(100% - 20px), transparent)',
      undefined,
      'none',
    ],
    (v) => `-webkit-mask: ${v};
  mask: ${v};`,
  )}
  ${responsive(
    [
      '&::-webkit-scrollbar { display: none; }',
      undefined,
      '&::-webkit-scrollbar { display: revert; }',
    ],
    (v) => v,
  )}
`

export const RailItem = styled.button`
  position: relative;
  z-index: 1;
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;

  /* 移动端落位：刻度吸附（非滚动容器惰性直落） */
  scroll-snap-align: center;

  /* 轨上节点 */
  &::before {
    content: '';
    position: absolute;
    left: -3px;
    top: 50%;
    width: 7px;
    height: 7px;
    margin-top: -3.5px;
    border-radius: 50%;
    background: var(--background-color);
    border: 1px solid color-mix(in oklab, var(--normal-500) 60%, transparent);
    transition:
      background-color var(--motion-dur-quick) ease,
      border-color var(--motion-dur-quick) ease,
      box-shadow var(--motion-dur-quick) ease;
  }

  &:hover {
    background: none;
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  &[aria-current='true']::before {
    background: var(--primary-color);
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary-color) 18%, transparent);
  }

  ${responsive(['4px 0 7px', undefined, '2px 0 2px 18px'], (v) => `padding: ${v};`)}
  ${responsive(['0 0 auto', undefined, '0 1 auto'], (v) => `flex: ${v};`)}

  /* 移动端隐轨上节点，桌面回显 */
  ${responsive(['&::before { display: none; }', undefined, '&::before { display: block; }'], (v) => v)}

  /* 选中年份的刻度下划标（挂在自身属性选择器上，不跨组件插值）；桌面回 content none */
  ${responsive(
    [
      '&[aria-current="true"]::after { content: ""; position: absolute; left: 1px; right: 1px; bottom: 0; height: 2px; border-radius: 2px; background: var(--primary-color); }',
      undefined,
      '&[aria-current="true"]::after { content: none; }',
    ],
    (v) => v,
  )}
`

export const RailYear = styled.span<{ $dist: number }>`
  display: block;
  font-family: var(--font-serif);
  font-weight: ${(p) => (p.$dist === 0 ? 600 : 500)};
  letter-spacing: 0.04em;
  color: ${(p) =>
    p.$dist === 0
      ? 'var(--primary-color)'
      : p.$dist === 1
        ? 'color-mix(in oklab, var(--text-color) 44%, transparent)'
        : 'color-mix(in oklab, var(--text-color) 26%, transparent)'};
  transition:
    color 240ms var(--motion-ease-out-soft),
    font-size 240ms var(--motion-ease-out-soft);

  ${RailItem}:hover & {
    color: color-mix(in oklab, var(--text-color) 70%, transparent);
  }

  ${RailItem}[aria-current='true'] & {
    color: var(--primary-color);
  }

  /* 移动端：选中年放大成刻度主档，其余按距离缩小淡化（衬线数字本身当刻度）；
     逐实例槽——transient 参与槽值构造而非声明函数 */
  ${({ $dist }) =>
    responsive([$dist === 0 ? '27px' : '16px', undefined, 'var(--font-size-lg)'], (v) => `font-size: ${v};`)}
  ${responsive(['1.3', undefined, '1.5'], (v) => `line-height: ${v};`)}
`

export const RailCount = styled.span`
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 45%, transparent);
  padding-left: 2px;

  ${RailItem}[aria-current='true'] & {
    color: color-mix(in oklab, var(--primary-color) 75%, var(--text-color));
  }

  /* 移动端整段隐去（年谱刻度带只留年份） */
  ${responsive(['none', undefined, 'block'], (v) => `display: ${v};`)}
`

export const Content = styled.div`
  position: relative;
  min-width: 0;
`

export const Watermark = styled.span`
  position: absolute;
  top: -30px;
  right: -6px;
  z-index: 0;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(120px, 22vw, 210px);
  line-height: 1;
  letter-spacing: -0.02em;
  color: color-mix(in oklab, var(--text-color) 6%, transparent);
  pointer-events: none;
  user-select: none;

  /* 移动端水印年份隐去 */
  ${responsive(['none', undefined, 'unset'], (v) => `display: ${v};`)}
`

export const ContentInner = styled.div`
  position: relative;
  z-index: 1;
`

export const PanelHead = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 0 var(--space-sm);
`

const discSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

/* 碟心封面：小黑胶，歌单封面做圆标；切年淡出→轻转 120°→淡入，播放时慢转 */
export const CoverDisc = styled.span<{
  $rotation: number
  $fading: boolean
  $spinning: boolean
  $fast: boolean
}>`
  position: relative;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    conic-gradient(
        from 210deg,
        rgba(255, 255, 255, 0.09),
        transparent 26%,
        rgba(255, 255, 255, 0.05) 48%,
        transparent 62%,
        rgba(255, 255, 255, 0.08) 82%,
        transparent
      ),
    repeating-radial-gradient(circle at 50% 50%, #171310 0 1.5px, #221b15 1.5px 3px),
    #14100c;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.28),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  opacity: ${(p) => (p.$fading ? 0 : 1)};
  transform: rotate(${(p) => p.$rotation}deg);
  transition:
    transform ${(p) => (p.$fast ? 240 : 620)}ms var(--motion-ease-out-soft),
    opacity ${(p) => (p.$fast ? 60 : 160)}ms ease;

  /* 主轴孔 */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 6px;
    height: 6px;
    margin: -3px 0 0 -3px;
    border-radius: 50%;
    background: #0e0b09;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
  }

  ${(p) =>
    p.$spinning
      ? css`
          animation: ${discSpin} 5s linear infinite;
        `
      : ''}

  /* 移动端碟心放大一档 */
  ${responsive(['72px', undefined, '64px'], (v) => `width: ${v};
  height: ${v};`)}

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.01ms;
    animation: none;
  }
`

export const DiscLabel = styled.span`
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.45);

  /* 移动端圆标随碟心同步放大 */
  ${responsive(['34px', undefined, '30px'], (v) => `width: ${v};
  height: ${v};`)}
`

export const PanelCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const PanelTitle = styled.h2`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  line-height: 1.4;
`

export const PanelSub = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`

/* 歌单描述 + 标签：站长自留地（描述来自网易云歌单简介；标签服务端后续补字段即点亮） */
export const Intro = styled.p`
  margin: 0 0 var(--space-xs);
  max-width: 56ch;
  font-size: var(--font-size-sm);
  line-height: 1.9;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`

export const IntroTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 var(--space-sm);
`

export const TagChip = styled.span`
  padding: 0 8px;
  font-size: var(--font-size-xs);
  line-height: 1.7;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  border: 1px solid color-mix(in oklab, var(--normal-400) 70%, transparent);
  border-radius: var(--border-radius-xs);
  background: color-mix(in oklab, var(--normal-300) 28%, transparent);
`

/* 按语：本卷播放次数最高的一首，像志书页脚的纪年按语 */
export const Epigraph = styled.p`
  margin: 0 0 var(--space-sm);
  padding: 2px 0 2px var(--space-sm);
  border-left: 2px solid color-mix(in oklab, var(--primary-color) 45%, transparent);
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  line-height: 1.9;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);

  .em {
    color: var(--primary-color);
  }
`

/* ===== 曲目列表 ===== */

export const TrackList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const TrackRow = styled.li`
  align-items: center;
  border-bottom: 1px solid color-mix(in oklab, var(--normal-400) 30%, transparent);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color var(--motion-dur-quick) ease;

  /* 移动端两行制落位：桌面 flex 上下文惰性的列定义直落基线静态 */
  grid-template-columns: auto minmax(0, 1fr) auto;

  ${responsive(['grid', undefined, 'flex'], (v) => `display: ${v};`)}
  ${responsive(['2px 10px', undefined, 'var(--space-sm)'], (v) => `gap: ${v};`)}
  ${responsive(['9px 4px', undefined, '9px var(--space-xs)'], (v) => `padding: ${v};`)}
  ${responsive(['54px', undefined, 'unset'], (v) => `min-height: ${v};`)}

  &:hover {
    background: color-mix(in oklab, var(--primary-color) 5%, transparent);
  }

  /* 悬停行：编号淡出、翻出播放键（点击行即播） */
  &:hover .track-idx-num {
    opacity: 0;
  }

  &:hover .track-idx-play {
    opacity: 1;
  }

  &:hover .track-name {
    color: var(--primary-color);
  }

  /* 移动端两行制：编号跨两行、歌名独占一行、艺术家退第二行、次数/时长/最爱右列竖排 */
  /* 触屏无 hover：按住即翻出播放键。
     注记（范围外）：移动端专属的「选择器级条件组」——桌面原形态是「无规则」，
     md 槽回退声明参与级联与静态 hover 规则同特异度、位次靠后，桌面按下态会反转；
     回写 hover 备份规则又救不到行级 hover（跨组件引用违纪），
     且会误伤 ≥641 无 hover 有 active 的触屏平板——整体保留手写 max-width 块
     （批次4 FloatingButton compact 条件媒体同法） */
  @media (max-width: ${BREAKPOINTS.mobile}px) {
    &:active {
      background: color-mix(in oklab, var(--primary-color) 8%, transparent);
    }

    &:active .track-idx-num {
      opacity: 0;
    }

    &:active .track-idx-play {
      opacity: 1;
    }
  }
`

export const TrackIndex = styled.span`
  position: relative;
  width: 2.2em;
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);

  /* 移动端落位（桌面 flex 惰性直落）：编号跨两行 */
  grid-column: 1;
  grid-row: 1 / 3;

  ${responsive(['auto', undefined, '20px'], (v) => `height: ${v};`)}
  ${responsive(['40px', undefined, 'unset'], (v) => `min-height: ${v};`)}
  ${responsive(['stretch', undefined, 'auto'], (v) => `align-self: ${v};`)}
`

export const IndexNum = styled.span.attrs({ className: 'track-idx-num' })`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  transition: opacity var(--motion-dur-quick) ease;
`

export const IndexPlay = styled.span.attrs({ className: 'track-idx-play' })`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  opacity: 0;
  color: var(--primary-color);
  transition: opacity var(--motion-dur-quick) ease;

  svg {
    width: 11px;
    height: 11px;
    fill: currentColor;
  }
`

/* 正在播放槽位（20261006 等化器三面）：全行等宽占位防文字抖动，仅当前行在槽内渲染包出口 Equalizer
   （播放跳动/暂停冻结，与书耳等化器同语言）；静态红点退役——暂停不消失是假状态。
   移动端维持「歌名主色 + 编号翻播放键」触控语言，槽位不占横向空间 */
export const PlayingSlot = styled.span`
  width: 13px;
  height: 12px;
  flex-shrink: 0;
  align-items: flex-end;

  /* 移动端不占横向空间（触控语言改由歌名主色承担） */
  ${responsive(['none', undefined, 'inline-flex'], (v) => `display: ${v};`)}
`

export const TrackButton = styled.button`
  flex: 1;
  min-width: 0;
  display: flex;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  color: inherit;
  font-family: inherit;

  /* 移动端落位（桌面 flex 惰性直落）：第二列跨两行 */
  grid-column: 2;
  grid-row: 1 / 3;

  /* 陷阱：两行制下必须 stretch，flex-start 会让歌名保持内容宽不截断、溢出盖住右列 */
  ${responsive(['column', undefined, 'row'], (v) => `flex-direction: ${v};`)}
  ${responsive(['stretch', undefined, 'baseline'], (v) => `align-items: ${v};`)}
  ${responsive(['1px', undefined, 'var(--space-sm)'], (v) => `gap: ${v};`)}

  &:hover .track-name {
    color: var(--primary-color);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  /* 注记（范围外）：移动端专属选择器级条件组——「播放中歌名常驻主色」在桌面无对应规则，
     md 槽回退 inherit 与行级/钮级 hover 主色规则同特异度且位次靠后，桌面悬停当前行会丢高亮；
     与 TrackRow active 三连同法保留手写（批次4 条件媒体注记先例） */
  @media (max-width: ${BREAKPOINTS.mobile}px) {
    /* 播放中的卷内曲目：歌名常驻主色（移动端无 dot，主色即状态） */
    &[aria-current='true'] .track-name {
      color: var(--primary-color);
    }
  }
`

export const TrackName = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: color var(--motion-dur-quick) ease;

  ${responsive(['var(--font-size-base)', undefined, 'var(--font-size-sm)'], (v) => `font-size: ${v};`)}
  ${responsive(['1.55', undefined, 'normal'], (v) => `line-height: ${v};`)}
`

export const TrackArtist = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--font-size-xs);
  flex-shrink: 1;

  ${responsive(
    [
      'color-mix(in oklab, var(--text-color) 58%, transparent)',
      undefined,
      'color-mix(in oklab, var(--text-color) 72%, transparent)',
    ],
    (v) => `color: ${v};`,
  )}
`

export const TrackPlays = styled.span`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  text-align: right;
  font-variant-numeric: tabular-nums;

  /* 移动端落位（父 contents 时桌面 flex 惰性直落）：横贯两行制顶行 */
  grid-column: 1 / -1;
  grid-row: 1;

  .unit {
    margin-left: 2px;
    color: color-mix(in oklab, var(--text-color) 45%, transparent);
  }

  ${responsive(['0', undefined, '3.4em'], (v) => `min-width: ${v};`)}
`

/* 次数/时长/最爱归组的右侧竖列：桌面 contents 溶入行布局（与历史渲染一致），移动端两行右锚 */
export const TrackSide = styled.span`
  /* 移动端落位：contents 溶入时桌面 flex/grid 上下文惰性直落 */
  grid-column: 3;
  grid-row: 1 / 3;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  align-items: center;
  justify-items: end;
  column-gap: 6px;
  row-gap: 3px;

  ${responsive(['grid', undefined, 'contents'], (v) => `display: ${v};`)}
`

export const FavSlot = styled.span`
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;

  /* 移动端落位（桌面 contents 溶入惰性直落）：右列第二行 */
  grid-column: 2;
  grid-row: 2;

  ${responsive(['auto', undefined, '40px'], (v) => `width: ${v};`)}
`

export const FavBadge = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  line-height: 1.6;
  color: var(--primary-color);
  border: 1px solid color-mix(in oklab, var(--primary-color) 45%, transparent);
  border-radius: var(--border-radius-xs);
  background: color-mix(in oklab, var(--primary-color) 7%, var(--background-100));

  ${responsive(['10px', undefined, 'var(--font-size-xs)'], (v) => `font-size: ${v};`)}
`

export const TrackDuration = styled.span`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);

  /* 移动端落位（桌面 contents 溶入惰性直落）：右列第二行左格 */
  grid-column: 1;
  grid-row: 2;
`

export const TracksEmpty = styled.p`
  margin: 0;
  padding: var(--space-lg) 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);
`
