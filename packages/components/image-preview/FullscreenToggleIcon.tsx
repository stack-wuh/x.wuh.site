import { IconExitFullscreen, IconFullscreen } from '../icons'

interface FullscreenToggleIconProps {
  active: boolean
}

const FullscreenToggleIcon = ({ active }: FullscreenToggleIconProps) =>
  active ? <IconExitFullscreen /> : <IconFullscreen />

export default FullscreenToggleIcon
