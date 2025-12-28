/**
 * @NOTE 获取浏览器的当前的情景模式
 * 
 * * 通过prefers-color-schema: dark 来判断用户浏览器是否是暗黑模式
 */
interface IOptions {
  change: (e: any) => void
}

const options = {
  change () {}
}

const useSystemColorSchema = (ops: IOptions = options): Boolean => {
  const prefersSchema = window.matchMedia('(prefers-color-scheme: dark)')

  if (ops && ops.change) {
    prefersSchema.addEventListener('change', function (e) {
      ops.change(e)
    })
  }

  return prefersSchema.matches
}


export default typeof window !== 'undefined' ? useSystemColorSchema : () => {}