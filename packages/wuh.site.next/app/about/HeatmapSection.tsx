'use client'

import styled from '@wuh.site/components/styled'
import { Section, SectionHeading, SectionTitle, SectionSubtitle } from './styles'
import { heatmap, filters, timelineFilters, legendLabels, heatColors, formatMonthDay } from './data'

const heatColorsRef = heatColors

interface Props {
  highlightDate?: string
}

const HeatmapSection = ({ highlightDate = '2026-03-25' }: Props) => {
  return (
    <Section>
      <SectionHeading>
        <SectionTitle>平台热力图</SectionTitle>
        <SectionSubtitle>
          以日为单位的活动格子，颜色深浅代表当天的内容密度，Hover 可查看每个平台的贡献明细。
        </SectionSubtitle>
      </SectionHeading>
      <Controls>
        <ControlGroup>
          {filters.map((filter, index) => (
            <ChipButton key={filter} $active={index === 0}>
              {filter}
            </ChipButton>
          ))}
        </ControlGroup>
        <ControlGroup>
          {timelineFilters.map((item, idx) => (
            <ChipButton key={item} $active={idx === 0}>
              {item}
            </ChipButton>
          ))}
        </ControlGroup>
      </Controls>
      <Grid>
        {heatmap.map((row) => (
          <HeatRow key={row.weekday}>
            <DayLabel>{row.weekday}</DayLabel>
            <Cells>
              {row.cells.map((cell) => (
                <Cell
                  key={cell.date}
                  type='button'
                  $level={cell.level}
                  $selected={cell.date === highlightDate}
                  title={`${formatMonthDay(cell.date)} · ${cell.count} 条`}
                />
              ))}
            </Cells>
          </HeatRow>
        ))}
      </Grid>
      <Legend>
        {legendLabels.map((label, index) => (
          <LegendItem key={label}>
            <Swatch style={{ background: heatColorsRef[index] }} />
            <LegendLabel>{label}</LegendLabel>
          </LegendItem>
        ))}
      </Legend>
    </Section>
  )
}

export default HeatmapSection

/* ====== Heatmap Styles ====== */

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  justify-content: space-between;
`

const ControlGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`

const ChipButton = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--primary-color)' : 'color-mix(in oklab, var(--normal-300) 45%, transparent)'};
  background: ${({ $active }) => ($active ? 'var(--primary-100)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'var(--text-primary)')};
  border-radius: 999px;
  padding: 6px 16px;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);

  &:focus-visible {
    outline: 2px solid rgba(59, 130, 246, 0.6);
    outline-offset: 2px;
  }

  @media (prefers-color-scheme: dark) {
    ${({ $active }) =>
      $active &&
      `
      background: color-mix(in oklab, var(--primary-color) 18%, transparent);
      border-color: color-mix(in oklab, var(--primary-color) 55%, transparent);
    `}
  }
`

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-x: auto;
`

const HeatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const DayLabel = styled.span`
  min-width: 30px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`

const Cells = styled.div`
  display: flex;
  gap: 4px;
`

const Cell = styled.button<{ $level: number; $selected?: boolean }>`
  width: 14px;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  border: ${({ $selected }) => ($selected ? '2px solid var(--primary-color)' : '1px solid transparent')};
  background: ${({ $level }) => heatColorsRef[$level]};
  cursor: pointer;
  &:hover,
  &:focus-visible {
    border-color: var(--primary-color);
  }
`

const Legend = styled.div`
  display: flex;
  gap: var(--space-xs);
  align-items: center;
  flex-wrap: wrap;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const Swatch = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);
`

const LegendLabel = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
`
