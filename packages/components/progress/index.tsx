'use client'

import * as React from 'react'
import { useLocale } from '@wuh.site/components/locales'
import * as S from './styles'
import type { ProgressProps } from './specs'

export type { ProgressProps, ProgressSize } from './specs'

/* 纸墨「运笔」双模态进度条：
   传 onChange 即交互态（原生 range 透明覆盖，印光标随 $fill 移动）；
   缺 value 进不确定态（渐隐墨迹行笔）。印光标 = 白文方印「樂」，呼吸晕归播放态。 */
const Progress: React.FC<ProgressProps> = ({
  value,
  onChange,
  thumb,
  glyph = '樂',
  breathing,
  showLabel,
  size = 'md',
  label,
  ...rest
}) => {
  const { t } = useLocale()
  const indeterminate = value == null
  const interactive = typeof onChange === 'function'
  // 非有限值（如消费方 0/0 的时长换算）落 0，不把 NaN 灌进受控 range
  const clamped = indeterminate || !Number.isFinite(value) ? 0 : Math.min(100, Math.max(0, value))
  const showThumb = (thumb ?? interactive) && !indeterminate

  const bar = (
    <S.SBar $size={size}>
      {indeterminate ? (
        <S.STrack>
          <S.SStroke />
        </S.STrack>
      ) : (
        <S.STrack>
          <S.SFill $fill={clamped / 100} />
        </S.STrack>
      )}
      {showThumb && (
        <S.SThumb className='wuh-progress-thumb' $fill={clamped / 100} $breathing={breathing} aria-hidden='true'>
          {glyph ? <S.SGlyph aria-hidden='true'>{glyph}</S.SGlyph> : <S.SThumbFrame aria-hidden='true' />}
        </S.SThumb>
      )}
      {interactive && (
        <S.SRange
          className='wuh-progress-range'
          type='range'
          min={0}
          max={100}
          step={1}
          value={clamped}
          onChange={(e) => onChange?.(Number(e.target.value))}
          aria-label={label ?? t('components.progress.defaultLabel')}
        />
      )}
    </S.SBar>
  )

  if (interactive) {
    return (
      <S.SRoot {...rest}>
        {bar}
        {showLabel && <S.SLabel>{Math.round(clamped)}%</S.SLabel>}
      </S.SRoot>
    )
  }

  return (
    <S.SRoot
      role='progressbar'
      aria-label={label ?? t('components.progress.defaultLabel')}
      {...(indeterminate ? {} : { 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(clamped) })}
      {...rest}
    >
      {bar}
      {showLabel && <S.SLabel>{Math.round(clamped)}%</S.SLabel>}
    </S.SRoot>
  )
}

export default Progress
