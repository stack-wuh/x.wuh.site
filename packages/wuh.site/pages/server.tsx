import React from 'react'
import useConfig from '@/hooks/useConfig'
import packageJSON from '../package.json'

interface ServerInterface {
  config: any
}

export default function Server(props: ServerInterface) {
  const { config } = props

  const appConfig = useConfig()

  const filterKeys = (obj: {}): {} => {
    let val = {} as any

    Object.entries(obj).map(([k, v]) => {
      if (k.includes('toggle') || k.includes('stateLocale')) return

      val[k] = v
    })

    return val
  }

  return (
    <div>
      <h1>Server Config List</h1>
      <details open>
        <summary>Node Server Config</summary>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </details>
      <details>
        <summary>Nextjs App config List</summary>
        <pre>{JSON.stringify(filterKeys(appConfig), null, 2)}</pre>
      </details>
      <details>
        <summary>Node Package Manage Config</summary>
        <pre>{JSON.stringify(packageJSON, null, 2)}</pre>
      </details>
    </div>
  )
}

export async function getStaticProps() {
  let config: {
    [k: string]: any
  } = {}
  Object.entries(process.env).forEach(([k, v]) => {
    config[k] = v
  })
  return {
    props: {
      config,
    },
  }
}
