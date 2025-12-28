import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import { RootModel } from '@/redux/models'
import { TMusicProps } from '@/redux/models/music'
import useControl from '@/hooks/useAudio/useControl'
import { TTraceItem } from '@/redux/models/music'
import Link from 'next/link'

type TProps = {}

function useData() {
  const store = useSelector((state: RootModel) => state.music)
  const dispatch = useDispatch()

  return {
    store,
    dispatch,
  }
}

const Music: React.FC<TProps> = props => {
  const [activeCurrent, setActiveCurrent] = useState<TTraceItem>()
  const { store } = useData()
  const { current, track } = store as unknown as TMusicProps
  const [_, actions] = useControl()

  const handleClickItem = (id: number) => {
    actions.onFetchPlayer({ id })
    const value = current.tracks.find(item => item.id === id)
    setActiveCurrent(value)
  }

  return (
    <div className="ww_music">
      <h3>{current.name}</h3>
      <div>状态栏</div>
      <div>
        <p>当前播放: {activeCurrent?.name || '暂无开始'}</p>
        <p>播放状态: {track.canplay ? '可以播放' : '拉取资源中....'}</p>
        <p>播放进度: {track.procent}%</p>
      </div>

      <ul className="ww_music__wrap-list">
        {(current.tracks || []).map(item => (
          <li
            className={classnames('ww_music__wrap-item', {
              'is-active': activeCurrent?.id === item.id,
            })}
            key={item.id}
            onClick={() => handleClickItem(item.id)}>
            <span>{item.name}</span>
            <span>--{item.author}</span>
          </li>
        ))}
      </ul>

      <div>
        <button onClick={actions.onPlay}>play</button>
        <button onClick={actions.onPause}>pause</button>
        <button onClick={actions.onToggleMuted}>toggle muted</button>
        <button>
          <Link href={'/'}>回首页</Link>
        </button>
      </div>
    </div>
  )
}

export default Music
