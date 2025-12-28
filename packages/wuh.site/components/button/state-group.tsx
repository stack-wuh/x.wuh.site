import React from 'react'
import { useExternal, useGetState } from 'ahooks'
import Space from '@/components/space/space'
import Affix from '@/components/affix'
import useConfig from '@/hooks/useConfig'
import classnames from 'classnames'
import { Button } from '.'

const StateGroup: React.FC<{}> = () => {
  const config = useConfig()
  
  const [hlThemeMode, setHlThemeMode] = useGetState('https://src.wuh.site/stylesheet/github.min.css')
  useExternal(hlThemeMode)

  const themeClassnames = classnames(
    'ww_button__state',
    `ww_button__state--${config.themeMode}`
  )
  const langClassnames = classnames(
    'ww_button__state',
    `ww_button__state--${config.language}`
  )

  const themeIconName = config.themeMode === 'light' ? 'icon-Moon' : 'icon-Sun'
  const langIconName =
    config.language === 'en' ? 'icon-yingwen' : 'icon-zhongwen'

  const handleToggleTheme = () => {
    config.toggleThemeMode()
    const hrefStr = hlThemeMode.includes('dark') ? 'https://src.wuh.site/stylesheet/github.min.css' : 'https://src.wuh.site/stylesheet/github-dark.min.css'
    setHlThemeMode(hrefStr)
  }

  return (
    <Affix position="right" offsetY={120}>
      <div className="ww_button ww_button-group">
        <Space direction="vertical" size={0}>
          <Button
            events={{ category: 'button', label: 'btn_language' }}
            onClick={config.toggleLang}
            className={langClassnames}
            ghost
            size="small"
            icon={langIconName}
          />
          <Button
            events={{ category: 'button', label: 'btn_theme' }}
            onClick={handleToggleTheme}
            className={themeClassnames}
            ghost
            size="small"
            icon={themeIconName}
          />
        </Space>
      </div>
    </Affix>
  )
}

export default StateGroup
