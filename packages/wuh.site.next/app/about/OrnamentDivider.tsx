'use client'

import { DividerRow, DividerLine, DividerDiamond } from './styles'

const OrnamentDivider = () => (
  <DividerRow aria-hidden='true'>
    <DividerLine />
    <DividerDiamond viewBox='0 0 12 12' aria-hidden='true'>
      <polygon points='6,0 12,6 6,12 0,6' fill='currentColor' opacity='0.35' />
    </DividerDiamond>
    <DividerLine />
  </DividerRow>
)

export default OrnamentDivider
