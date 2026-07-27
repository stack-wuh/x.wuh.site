import { styled } from '@wuh.site/components/styled'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow-x: auto;
  padding-bottom: 4px;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const DayLabel = styled.span`
  width: 28px;
  font-size: 10px;
  color: var(--text-muted);
  text-align: right;
  flex-shrink: 0;
  line-height: 12px;
`

export const MonthRow = styled.div`
  position: relative;
  height: 16px;
  margin-left: 32px;
  margin-bottom: 2px;
`

export const MonthLabel = styled.span<{ $left: number }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  font-size: 10px;
  color: var(--text-muted);
`

export const Cells = styled.div`
  display: flex;
  gap: 3px;
`

export const Cell = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`

export const CellInner = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
`

export const Tooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--text-primary);
  color: var(--background-color);
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  z-index: 10;
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
  width: 12px;
  height: 12px;
  border-radius: 2px;
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
