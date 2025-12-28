import * as React from 'react'
import Link from 'next/link'
import { IHomeItemProps, THomeInitialProps } from '@/pages/index'
import Image from '@/components/image/image'
import { LoadMoreButton } from '@/components/button'
import useConfig from '@/hooks/useConfig'
import fetcher from '@/lib/fetch'
import { API_ARTICLE_LIST } from '@/constant/api'
import { useRequest } from 'ahooks'

const PAGE_SIZE = 10

interface IListProps {
  data: THomeInitialProps
}

const Item = (props: IHomeItemProps) => {
  return (
    <>
      <Link
        href={{ pathname: '/post/[id]', query: { id: props.title } }}
        passHref>
        <a>
          <li className="ww_home__item">
            <div className="lf">
              <Image
                src={props.cover_img}
                width="160px"
                height="108px"
                alt="cover"
              />
            </div>
            <div className="body">
              <h4 className="title">{props.title}</h4>
              <p className="description text-overflow-multi transition-text">
                {props.sub_title}
              </p>
            </div>
          </li>
        </a>
      </Link>
    </>
  )
}


const List: React.FC<{ data: any }> = props => {
  const config = useConfig()
  const cacheDataListRef = React.useRef<{ dataMaps: { [key: string]: { hits: [] }}, page: number }>({ dataMaps: {}, page: 1 })

  if (cacheDataListRef.current && cacheDataListRef.current.dataMaps) {
    cacheDataListRef.current.dataMaps[1] = props.data
  }
  
  const result = useRequest((params) => {
    return fetcher(`${API_ARTICLE_LIST}?p=${params.page}&pageSize=${PAGE_SIZE}`)
  }, {
    defaultParams: [{ page: 1 }],
    cacheKey: API_ARTICLE_LIST,
    onSuccess: (data, [params]) => {
      cacheDataListRef.current.dataMaps[params.page] = data
    }
  })

  const handleNextPage = async () => {
    const page = ++cacheDataListRef.current.page
    await result.runAsync({ page })
  }

  const hits = React.useMemo(() => {
    const memo = Object.entries(cacheDataListRef.current.dataMaps).reduce((acc, curr) => {
      const [, d] = curr
  
      acc = [].concat(acc, d.hits)
  
      return acc
    }, [])

    return memo

  }, [JSON.stringify(cacheDataListRef.current.dataMaps)])

  const allowFetchNextDisabled = React.useMemo(() => {
    if (!result.data) return true
    const { data } = result

    const disabled = data.pager.count < data.pager.page * PAGE_SIZE

    return disabled
  }, [result])

  return (
    <ul className="ww_home__list">
      {hits.map((item: IHomeItemProps) => (
        <Item {...item} key={item.title} />
      ))}
      <LoadMoreButton
        disabled={allowFetchNextDisabled}
        onClick={handleNextPage}
        icon="icon-costoms-alearance"
        size="small">
        {allowFetchNextDisabled ? config?.pager.disableNextText : config?.pager.nextText}
      </LoadMoreButton>
    </ul>
  )
}

export default React.memo(List)
