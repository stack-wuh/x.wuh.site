import { useState, useEffect, useRef } from 'react'
import { useMount } from 'ahooks'
import markdownToHtml from '@/lib/markdownToHtml'
import { usePostContext } from '.'

const getBodyString = async (str: string): Promise<any> =>
  await markdownToHtml(str)

const Body = () => {
  const postRef = useRef<any>(null)
  const data = usePostContext()
  const [body, setbody] = useState(data.body)
  useEffect(() => {
    getBodyString(data.body).then(res => setbody(res))
  }, [data])

  useMount(() => {
    if (global || window) {
      postRef.current.addEventListener('click', (e: any) => {
        if (e.target.nodeName.toLowerCase() === 'img') {
          window.open(e.target?.currentSrc)
        }
      })
    }
  })

  return (
    <section className="ww_post ww_post__body" ref={postRef}>
      <section className="markdown-body">
        <article dangerouslySetInnerHTML={{ __html: body }}></article>
      </section>
    </section>
  )
}

export default Body
