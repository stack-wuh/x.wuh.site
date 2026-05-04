'use client'

import { DividerRow, DividerLine } from './styles'
import { DiamondDivider } from '@wuh.site/components/icons'

const OrnamentDivider = () => (
  <DividerRow aria-hidden='true'>
    <DividerLine />
    <DiamondDivider />
    <DividerLine />
  </DividerRow>
)

export default OrnamentDivider
