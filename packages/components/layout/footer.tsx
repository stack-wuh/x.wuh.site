'use client';

import * as React from 'react'
import classnames from 'classnames'
import styles from '../themes/layout.module.scss'

const footerConf = {
  solgon: '驿寄梅花, 鱼传尺素',
  title: '你也想起舞吗',
  MIIT: '鄂ICP备20001814号-1',
  MoPSF: '粤公网安备44030002001803号',
  copyright: 'Copyright©2024 Shadow.'
}

const Footer = () => {
  return <div className={classnames({
    [styles.footerWrapper]: true
  })}>
    <div>{footerConf.solgon}</div>
    <div>{footerConf.title}</div>
    <div>{footerConf.MIIT}</div>
    <div>{footerConf.MoPSF}</div>
    <div>{footerConf.copyright}</div>
  </div>
}

export default Footer
