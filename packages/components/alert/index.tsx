'use client';

import * as React from 'react'
import styles from '../themes/alert.module.css'

const Alert: React.FC = () => {
  return <div className={styles.wAlert}>
    <p>Alert<style jsx>{`
      p {
        color: red;
      }
    `}</style></p>
  </div>
}

export default Alert