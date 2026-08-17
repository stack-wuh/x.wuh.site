'use client';

import * as React from 'react'
import classnames from 'classnames'

import Footer from './footer'
import styles from '../themes/layout.module.scss'
import type { MainProps } from './specs'

const HeaderContent = () => {
  return (<div>Header</div>)
}

const Main: React.FC<MainProps> = (props: MainProps) => {
  return <body className={classnames({
    [styles.wLayout]: true
  })}>
    <header className={classnames({
      [styles.wHeader]: true
    })}>
      { props.header || <HeaderContent /> }
    </header>
    <main className={classnames({
      [styles.wMain]: true
    })}>
      { props.children }
    </main>
    <footer className={classnames({
      [styles.wFooter]: true
    })}>
      { props.footer || <Footer /> }
    </footer>
  </body>
}

export default Main
