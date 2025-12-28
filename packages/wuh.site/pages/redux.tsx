import React from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, Dispatch } from '@/redux/store'

const ReduxIndex: React.FC<{}> = (props) => {
  const store = useSelector((state: RootState) => ({ count: state.settings, music: state.music }))
  const dispatch = useDispatch<Dispatch>()
  return <div className="redux">
    <h3>remacth demo</h3>

    <div>
      <p>count: { store.count.count }</p>

      <br />
      <button onClick={() => dispatch.settings.increment({ count: 1 })}>increment</button>
      <button onClick={() => dispatch.settings.incrementAsync({ count: 1 })}>incrementAsync</button>
    </div>

    <div>
      <Link href='other'>
        <a>TO Other</a>
      </Link>
    </div>
  </div>
}

export default ReduxIndex