import { styled } from 'styled-components'

type TooltipVertical = 'up' | 'down'
type TooltipHorizontal = 'left' | 'center' | 'right'

export const Wrapper = styled.div`
  --heatmap-gap: clamp(1px, 0.35vw, 3px);
  --heatmap-columns: 28px repeat(53, minmax(0, 1fr));

  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
`

export const Grid = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--heatmap-gap);
  padding-block: 4px;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: var(--heatmap-columns);
  align-items: center;
  gap: var(--heatmap-gap);
  min-width: 0;
`

export const DayLabel = styled.span`
  font-size: 10px;
  color: var(--text-muted);
  text-align: right;
  line-height: 1;
`

export const MonthRow = styled.div`
  display: grid;
  grid-template-columns: var(--heatmap-columns);
  gap: var(--heatmap-gap);
  min-width: 0;
  height: 16px;
  margin-bottom: 2px;
`

export const MonthLabel = styled.span<{ $column: number }>`
  grid-column: ${({ $column }) => $column};
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
`

export const Cells = styled.div`
  display: grid;
  grid-column: 2 / -1;
  grid-template-columns: repeat(53, minmax(0, 1fr));
  gap: var(--heatmap-gap);
  min-width: 0;
`

export const Cell = styled.span<{ $color: string }>`
  width: 100%;
  min-width: 0;
  aspect-ratio: 1;
  border-radius: clamp(1px, 0.2vw, 2px);
  background: ${({ $color }) => $color};
`

export const CellInner = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
`

export const Tooltip = styled.div<{
  $visible: boolean
  $vertical: TooltipVertical
  $horizontal: TooltipHorizontal
}>`
  position: absolute;
  ${({ $vertical }) => ($vertical === 'down' ? 'top: calc(100% + 6px);' : 'bottom: calc(100% + 6px);')}
  ${({ $horizontal }) => {
    if ($horizontal === 'left') return 'left: 0;'
    if ($horizontal === 'right') return 'right: 0;'
    return 'left: 50%; transform: translateX(-50%);'
  }}
  width: clamp(190px, 22vw, 240px);
  max-width: calc(100vw - 32px);
  box-sizing: border-box;
  background: var(--text-primary);
  color: var(--background-color);
  padding: 12px;
  border-radius: 4px;
  white-space: normal;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  z-index: 10;
`

export const TooltipDate = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
`

export const TooltipTotal = styled.div`
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
`

export const TooltipDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid color-mix(in oklab, currentColor 22%, transparent);
`

export const TooltipDetail = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
  font-size: 12px;
  line-height: 1.5;
`

export const TooltipDetailLabel = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
`

export const TooltipDetailValue = styled.span`
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-muted);
  padding-left: 32px;
`

export const LegendCell = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`

export const SkeletonCell = styled.span`
  width: 100%;
  min-width: 0;
  aspect-ratio: 1;
  border-radius: clamp(1px, 0.2vw, 2px);
  background: var(--background-300);
`

export const Error = styled.div`
  padding: 24px 0;
  text-align: center;
  font-size: 13px;
  color: var(--error-color, #c0392b);
`

export const Empty = styled.div`
  padding: 24px 0;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
`
