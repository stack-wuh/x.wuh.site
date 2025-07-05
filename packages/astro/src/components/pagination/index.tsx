import type { TPager } from '@/https/interface'

type TPagination = TPager & {
  getNextPage: () => {},
}

export default function (props: TPagination) {
  const isLastPage = props.page >= props.pageTotal
  // const spetFL = isLastPage ? 1 : props.pageTotal - props.page

  console.log(props)
  return (
    <div className='w-pagination w-full border p-2 text-sm bg-white rounded-sm overflow-hidden border-gray-200'>
      <div className='w-full h-4 inline-flex items-center justify-between'>
        <div className='last-pager-btn w-2/3'>
          悟已往之不谏, 知来者之可追({props.page}/{props.pageTotal})
        </div>
        <div className={`separator-btn w-16 h-16`}></div>
        {isLastPage ? (
          <div className='w-1/6 cursor-not-allowed text-gray-400'>空空如也~~</div>
        ) : (
          <div onClick={props.getNextPage} className='next-pager-btn w-1/6 cursor-pointer'>远眺山河</div>
        )}
      </div>
    </div>
  )
}
