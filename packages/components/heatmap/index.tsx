'use client'

import { useState, useMemo } from 'react'
import type { HeatmapData, ColorScheme } from './types'
import { GITHUB_COLORS, WARM_COLORS, DAY_LABELS, MONTH_LABELS } from './types'
import * as S from './styles'

const ACTIVITY_LABELS: Record<string, string> = {
  visits: '浏览',
  published: '发布',
  updated: '更新',
  comments: '评论',
  guestbook: '留言',
  projectUpdates: '项目更新',
}

interface HeatmapProps {
  data: HeatmapData | null
  loading?: boolean
  error?: Error | null
  colorScheme?: ColorScheme
  activityLabel?: string
  emptyLabel?: string
  errorLabel?: string
}

function TooltipCell({
  date,
  count,
  level,
  breakdown,
  activityLabel,
}: {
  date: string
  count: number
  level: number
  breakdown?: Record<string, number>
  activityLabel: string
}) {
  const [visible, setVisible] = useState(false)
  const d = new Date(date + 'T00:00:00')
  const details = breakdown
    ? `等级: ${level} · ${Object.entries(breakdown).map(([key, value]) => `${ACTIVITY_LABELS[key] ?? key}: ${value}`).join(' · ')}`
    : `${count} 条${activityLabel}`
  const label = `${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${details}`

  return (
    <S.CellInner
      tabIndex={0}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      onClick={() => setVisible((current) => !current)}
      aria-label={label}
    >
      <S.Tooltip $visible={visible}>{label}</S.Tooltip>
    </S.CellInner>
  )
}

export function Heatmap({ data, loading = false, error = null, colorScheme = 'github', activityLabel = '贡献', emptyLabel = '暂无贡献数据', errorLabel = '加载失败' }: HeatmapProps) {
  const colors = colorScheme === 'warm' ? [...WARM_COLORS] : [...GITHUB_COLORS]

  const monthPositions = useMemo(() => {
    if (!data) return []
    const positions: { label: string; left: number }[] = []
    let lastMonth = -1

    data.weeks.forEach((week, weekIndex) => {
      const firstDay = week.days.find((day) => day !== null)
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

  if (error) {
    return (
      <S.Wrapper>
        <S.Error role='alert'>{errorLabel}</S.Error>
      </S.Wrapper>
    )
  }

  if (!data) {
    return (
      <S.Wrapper>
        <S.Empty>{emptyLabel}</S.Empty>
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
                    <TooltipCell date={day.date} count={day.count} level={day.level} breakdown={day.breakdown} activityLabel={activityLabel} />
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
