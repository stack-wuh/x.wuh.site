import React from 'react'
import { IHomeItemProps } from '@/pages/index'

export const PostContextKey = React.createContext({})

type valueTypeProps = IHomeItemProps
export type PostContextProps = {
  value: valueTypeProps
}
const Context: React.FC<PostContextProps> = props => {
  const { value, children } = props
  return (
    <PostContextKey.Provider value={value}>{children}</PostContextKey.Provider>
  )
}

export const usePostContext = (): IHomeItemProps | any => {
  const context = React.useContext(PostContextKey)

  return context
}

export default Context
