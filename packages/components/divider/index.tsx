'use client'

import * as React from 'react'
import * as S from './styles'
import type { DividerProps } from './specs'

export type { DividerProps, DividerVariant } from './specs'

const Divider: React.FC<DividerProps> = ({ variant = 'hairline', children, ...rest }) => {
  if (variant === 'ornament') {
    return (
      <S.SOrnament role='separator' aria-orientation='horizontal' {...rest}>
        <S.SOrnamentGlyph aria-hidden='true'>{children ?? '◇'}</S.SOrnamentGlyph>
      </S.SOrnament>
    )
  }

  return <S.SDivider role='separator' aria-orientation='horizontal' {...rest} />
}

export default Divider
