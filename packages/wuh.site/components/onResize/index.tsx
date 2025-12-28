import React from 'react'

export type TProps = {}

const Resize: React.FC<TProps> = props => {
  return <div>{props.children}</div>
}

export default Resize
