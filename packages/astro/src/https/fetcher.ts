interface IOptions {
  params?: any,
  method?: 'GET' | 'POST',
  headers?: object,
  body?: any,
  credentials?: 'include' | 'omit' | 'same-origin',
  mode?: 'cors' | 'no-cors' | 'same-origin',
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached',
  redirect?: 'follow' | 'error' | 'manual',
  priority?: 'high' | 'low' | 'auto',
}

/**
 * @NOTE 常规的发起请求的fetch函数, 直接返回了有效的数据body结构
 */
export const fetcher = async (api: string, options?: IOptions) => {
  const method = options?.method || 'GET'
  const headers = Object.assign({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }, options?.headers)
  const body = Object.assign({}, options?.body)
  const mode = options?.mode || 'cors'

  const ops = {
    method,
    headers,
    mode
  }

  if (options?.method && !['GET', 'HEAD'].includes(options?.method)) {
    Object.assign(ops, { body: JSON.stringify(body) })
  }

  const response = await fetch(api, ops)
  const data = await response.json()
  // console.log('====fetcher===')
  // console.log('==== data', data)
  // console.log('==============')

  return data.data
} 