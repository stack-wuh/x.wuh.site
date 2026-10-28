import { IconPause, IconPlay } from '@wuh.site/components/icons'

interface PlayPauseIconProps {
  playing: boolean
  size: number
}

const PlayPauseIcon = ({ playing, size }: PlayPauseIconProps) =>
  playing ? <IconPause size={size} /> : <IconPlay size={size} />

export default PlayPauseIcon
