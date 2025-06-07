'use client';

import * as React from 'react'
import classnames from 'classnames'

import Footer from './footer'
import styles from '../themes/layout.module.scss'

type propsTypes = {
  header?: React.ReactNode,
  children: React.ReactNode,
  footer?: React.ReactNode,
}

const HeaderContent = () => {
  return (<div>Header</div>)
}

const Main:React.FC<propsTypes> = (props: propsTypes) => {
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