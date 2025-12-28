import { useContext, createContext } from 'react'

export interface responseInterfaceProps {
  key?: string
  xl?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
  xs?: boolean
  isMobile?: boolean
  isTablet?: boolean
  isPc?: boolean
}
const ResponsiveProvider = createContext<responseInterfaceProps | null>(null)

export { ResponsiveProvider }

export default function useRepsonse() {
  const response = useContext(ResponsiveProvider)
  return response
}
