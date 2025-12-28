import withConfig from '@/hooks/useConfig'
import Image from 'next/image'
// import AudioControl from '@/components/audio/control'

const Header = () => {
  const config = withConfig()
  return (
    <header className="ww_header">
      <div className="container">
        <div className="lf">
          <Image
            src="/icons/64.png"
            width="32px"
            height="32px"
            layout="fixed"
            alt="favicon"
          />
          <strong className="title">{config?.header.title}</strong>
        </div>
        <div className="empty"></div>
        <div className="rg">{/* <AudioControl /> */}</div>
      </div>
    </header>
  )
}

export default Header
