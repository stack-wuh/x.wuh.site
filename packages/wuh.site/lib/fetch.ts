import fetch from 'isomorphic-fetch'
import { isDev } from './index'

export type TResProps = {
  code: number
  data: {}
  message: string
}

export default async function fetcher(url: string): Promise<any> {
  try {
    const res = await fetch(url, {
      keepalive: true,
      referrer: 'wuh.site',
      cache: 'no-cache',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
    })
    if (!res.status) {
      throw Error('[Fetcher Error]: Response Fail')
    }
    const data = await res.json()

    if (isDev()) {
      console.group('Fetcher Response')
      console.log('==== res', res)
      console.log('==== data', data)
      console.groupEnd()
    }

    /**
     * 在v2中,请求成功的状态码换成了200
     */
    if (data.code === 200) {
      return data.data
    }

    return data
  } catch (error) {
    console.error('[Fetcher Error]: ', error)
  }
}
