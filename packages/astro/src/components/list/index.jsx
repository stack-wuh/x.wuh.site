import * as services from '@https/services.ts'
import { onMount, createSignal } from 'solid-js'
import ListCard from './card.astro'
import PaginationJsx from '../pagination/index.jsx'

export default function () {
  const [ store, setStore ] = createSignal({ data: [], pager: {} })
  
  const getNextPage = async () => {
    const response = await services.getPosts()
    const data = response.hits
    const pager = response.pager

    return { data, pager }
  }

  onMount(() => {
    getNextPage().then(res => {
      console.log('======> res', res)
    })

    // setStore(res)
  })
console.log('=======> store', store())
  return (
    <>
      <div class='w-20/24 md:max-w-4xl mx-auto my-6 flex flex-col gap-4'>
        {store().data.map(item => {
          return <ListCard title={item.title} sub_title={item.sub_title} cover_img={item.cover_img} updated_at={item.updated_at} created_at={item.created_at} />
        })}

        {/* <PaginationJsx {...pager} getNextPage={getNextPage} /> */}
      </div>
    </>
  )
}
