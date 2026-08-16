import * as React from 'react'
import { IconEmpty } from '../icons'
import Button from '../button'
import * as S from './styles'
import type { EmptyProps } from './specs'

export type { ActionItem, EmptyProps } from './specs'

const Empty = React.forwardRef<HTMLElement, EmptyProps>(function Empty(props, ref) {
  const {
    title = '空空如也',
    description,
    icon,
    actions,
    children,
    role = 'status',
    'aria-live': ariaLive = 'polite',
    ...rest
  } = props

  const resolvedDescription = description ?? children

  return (
    <S.EmptyRoot ref={ref} role={role} aria-live={ariaLive} {...rest}>
      <S.EmptyIcon aria-hidden='true'>{icon ?? <IconEmpty />}</S.EmptyIcon>
      {title ? <S.EmptyTitle>{title}</S.EmptyTitle> : null}
      {resolvedDescription ? <S.EmptyDescription>{resolvedDescription}</S.EmptyDescription> : null}
      {actions && actions.length > 0 && (
        <S.EmptyActions>
          {actions.map((action, i) => (
            <Button
              key={i}
              href={action.href}
              onClick={action.onClick}
              variant={action.variant ?? 'outlined'}
              color={action.color ?? 'primary'}
              size='small'
            >
              {action.label}
            </Button>
          ))}
        </S.EmptyActions>
      )}
    </S.EmptyRoot>
  )
})

export default Empty
