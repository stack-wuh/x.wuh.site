'use client'

import { useState, useMemo } from 'react'
import type { HeatmapData, ColorScheme } from './types'
import { GITHUB_COLORS, WARM_COLORS, DAY_LABELS, MONTH_LABELS } from './types'
import * as S from './styles'

interface HeatmapProps {
  data: HeatmapData | null
  loading?: boolean
  colorScheme?: ColorScheme
}

function TooltipCell({ date, count }: { date: string; count: number }) {
  const [hovered, setHovered] = useState(false)
  const d = new Date(date + 'T00:00:00')
  const label = `${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${count} 条贡献`

  return (
    <S.CellInner
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <S.Tooltip $visible={hovered}>{label}</S.Tooltip>
    </S.CellInner>
  )
}

export function Heatmap({ data, loading = false, colorScheme = 'github' }: HeatmapProps) {
  const colors = colorScheme === 'warm' ? [...WARM_COLORS] : [...GITHUB_COLORS]

  const monthPositions = useMemo(() => {
    if (!data) return []
    const positions: { label: string; left: number }[] = []
    let lastMonth = -1

    data.weeks.forEach((week, weekIndex) => {
      const firstDay = week.days[0]
      if (!firstDay) return
      const month = new Date(firstDay.date + 'T00:00:00').getMonth()
      if (month !== lastMonth) {
        positions.push({ label: MONTH_LABELS[month], left: weekIndex * 15 })
        lastMonth = month
      }
    })
    return positions
  }, [data])

  if (loading) {
    return (
      <S.Wrapper>
        <S.MonthRow />
        <S.Grid>
          {Array.from({ length: 7 }).map((_, row) => (
            <S.Row key={row}>
              <S.DayLabel>{DAY_LABELS[row]}</S.DayLabel>
              {Array.from({ length: 53 }).map((_, col) => (
                <S.SkeletonCell key={col} />
              ))}
            </S.Row>
          ))}
        </S.Grid>
        <S.Legend>
          <span>Less</span>
          {colors.map((c, i) => (
            <S.LegendCell key={i} $color={c} />
          ))}
          <span>More</span>
        </S.Legend>
      </S.Wrapper>
    )
  }

  if (!data) {
    return (
      <S.Wrapper>
        <S.Empty>暂无贡献数据</S.Empty>
      </S.Wrapper>
    )
  }

  return (
    <S.Wrapper>
      <S.MonthRow>
        {monthPositions.map((m, i) => (
          <S.MonthLabel key={i} $left={m.left}>{m.label}</S.MonthLabel>
        ))}
      </S.MonthRow>
      <S.Grid>
        {DAY_LABELS.map((label, rowIndex) => (
          <S.Row key={rowIndex}>
            <S.DayLabel>{label}</S.DayLabel>
            <S.Cells>
              {data.weeks.map((week, colIndex) => {
                const day = week.days[rowIndex]
                if (!day) {
                  return <S.Cell key={colIndex} $color='transparent' />
                }
                return (
                  <S.Cell key={colIndex} $color={colors[day.level]}>
                    <TooltipCell date={day.date} count={day.count} />
                  </S.Cell>
                )
              })}
            </S.Cells>
          </S.Row>
        ))}
      </S.Grid>
      <S.Legend>
        <span>Less</span>
        {colors.map((c, i) => (
          <S.LegendCell key={i} $color={c} />
        ))}
        <span>More</span>
      </S.Legend>
    </S.Wrapper>
  )
}

export type { HeatmapData, ColorScheme }
