'use client'

/* 队列：遮罩 + 翻页屏 + 队列行（桌面抽屉与移动目次共用）（20261005 自 PlayerPanel.tsx 拆出） */
import styled from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { equalize } from '../../mini/styles'
import { EASE, FOLD_DUR, FOLD_LIFT_SHADOW, FOLD_REST_ANGLE, FOLD_WIDTH_PX, HAIRLINE, INK_FAINT, INK_MUTED, QUICK, focusRing, reducedMotion } from './tokens'

/* ===== 播放列表抽屉（桌面）：自右滑入纸卡。
   显隐态经行内样式驱动（JSX style），不经 styled 动态类插值——规则删除竞态免疫（music-player.md） ===== */
export const DrawerScrim = styled.button`
  position: absolute;
  inset: 0;
  z-index: 7;
  padding: 0;
  background: color-mix(in oklab, black 28%, transparent);
  border: none;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity ${QUICK} ${EASE}, visibility 0s linear ${QUICK};
  visibility: hidden;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* ===== 队列翻页屏（桌面，20261001 定稿）：右缘热区 + 斜倚屏 =====
   热区 QZone 是屏的 DOM 祖先：指针滑到转正屏上 :hover 仍保持（CSS 下拉同构）；
   透视只作用于直接子级，隔层必须 preserve-3d 透传面板灭点（漏配 = 3D 静默退化）。
   进出场由纯 CSS :hover / :focus-within 引擎驱动（非 React 态翻转，不涉显隐纪律）；
   转正挂点用静态 data 属性——跨组件插值选择器禁用（design-system.md） */
export const QZone = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${FOLD_WIDTH_PX}px;
  z-index: 8;
  transform-style: preserve-3d;

  /* 键盘等价路径：Tab 进入队列即转正（与 hover 同态），焦点离开原路翻回 */
  &:focus-within [data-fold-screen='true'] {
    transform: rotateY(0deg);
    opacity: 1;
    pointer-events: auto;
    box-shadow: ${FOLD_LIFT_SHADOW};
    transition-delay: 0s, 0s, 0s;
  }

  /* hover 触发只在精确指针设备：触屏/平板走列表钮 pinned 等价路径 */
  @media (hover: hover) and (pointer: fine) {
    &:hover [data-fold-screen='true'] {
      transform: rotateY(0deg);
      opacity: 1;
      pointer-events: auto;
      box-shadow: ${FOLD_LIFT_SHADOW};
      transition-delay: 0s, 0s, 0s;
    }
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* 屏本体：静止斜倚 -40°（= 动画起点）半透明可读不可点；转正 = 0° 实墨可点选。
   pinned（queueOpen）由 JSX 行内样式驱动（显隐纪律），与 hover 同一落点姿态 */
export const QScreen = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${FOLD_WIDTH_PX}px;
  display: flex;
  flex-direction: column;
  padding: var(--space-lg) var(--space-base) 0 var(--space-lg);
  background: color-mix(in oklab, var(--background-100) 94%, transparent);
  border-left: 1px solid ${HAIRLINE};
  border-radius: var(--radius-card) 0 0 var(--radius-card);
  transform-origin: 100% 50%;
  transform: rotateY(${FOLD_REST_ANGLE});
  opacity: 0.45;
  pointer-events: none;
  transition: transform ${FOLD_DUR} var(--motion-ease-in-out-soft), opacity ${QUICK} ${EASE},
    box-shadow ${FOLD_DUR} ${EASE};
  /* 离场宽限：透明位延迟 160ms，指针掠过不频闪 */
  transition-delay: 0s, 160ms, 0s;
  backface-visibility: hidden;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }

  ${reducedMotion}
`

/* 眉标：短朱砂 tick + 字距小标 */
export const SectionHeading = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
  padding: var(--space-xs) 0 calc(var(--space-xs) + 6px);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: 500;
  letter-spacing: 0.22em;
  color: ${INK_MUTED};

  &::before {
    content: '';
    width: 10px;
    height: 2px;
    background: var(--primary-color);
  }
`

/* ===== 播放列表行（桌面抽屉 + 移动目次页共用） ===== */
export const QueueList = styled.ul`
  position: relative;
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0 0 var(--space-lg);
  list-style: none;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  scrollbar-gutter: stable;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${HAIRLINE};
    border-radius: 999px;
  }
`

/* ===== 播放列表行（桌面翻页屏 + 移动目次页共用） =====
   当前项底色/左标走行内自定义属性 --q-active（激活态禁动态类与属性选择器，music-player.md）；
   行 hover 整行左引 + 序号翻播放键（/music 目次行既有语言），纯 CSS :hover 驱动 */
export const QueueItem = styled.li`
  position: relative;
  border-radius: var(--border-radius-base);
  background: color-mix(in oklab, var(--primary-color) calc(var(--q-active, 0) * 7%), transparent);
  transition: transform 200ms var(--motion-ease-out-soft), background-color 160ms var(--motion-ease-out-soft);

  &:hover {
    background: color-mix(in oklab, var(--text-color) 5%, transparent);
    transform: translateX(-4px);
  }

  /* 当前项：朱砂左标（透明度随行内 --q-active 显隐） */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2.5px;
    height: 18px;
    border-radius: 2px;
    background: var(--primary-color);
    opacity: var(--q-active, 0);
  }

  /* 序号/播放键双面：hover 翻面 */
  & .q-no-face,
  & .q-no-play {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    transition: opacity 140ms var(--motion-ease-out-soft);
  }

  & .q-no-play {
    color: var(--primary-color);
    opacity: 0;
  }

  &:hover .q-no-face {
    opacity: 0;
  }

  &:hover .q-no-play {
    opacity: 1;
  }

  /* 正在播放等化器面（20261006 等化器三面）：QueueNo 第三面，与序号面/播放键面同 absolute 几何——
     当前行显示（--q-eq），跳动/冻结由 --q-eq-state 行内驱动（激活态纪律，暂停停走同碟面语言）；
     hover 让位播放键（操作提示优先于状态提示）；reduced-motion 静止 */
  & .q-no-eq {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 2px;
    opacity: var(--q-eq, 0);
    transition: opacity 140ms var(--motion-ease-out-soft);
  }

  & .q-no-eq span {
    width: 2.5px;
    height: 12px;
    border-radius: 1px;
    background: var(--primary-color);
    transform-origin: bottom;
    animation: ${equalize} 0.9s ease-in-out infinite;
    animation-play-state: var(--q-eq-state, paused);
  }

  &:hover .q-no-eq {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    & .q-no-eq span {
      animation: none;
    }
  }
`

export const QueueButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-xs) var(--space-xs) var(--space-sm);
  background: none;
  border: none;
  border-radius: inherit;
  color: var(--text-color);
  cursor: pointer;
  font-family: var(--font-sans);
  text-align: left;

  ${focusRing}
`

export const QueueNo = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 22px;
  height: 16px;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--primary-color) calc(var(--q-active, 0) * 100%), ${INK_FAINT});
`

export const QueueName = styled.span`
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--primary-color) calc(var(--q-active, 0) * 100%), var(--text-color));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 歌手列限宽省略：长歌手名不再把歌名列挤没，title 显全名 */
export const QueueArtist = styled.span`
  max-width: 92px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const QueueMeta = styled.span`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: var(--font-size-xs);
  color: ${INK_FAINT};
  min-width: 0;
`

