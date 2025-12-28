import React from 'react'
import Tag from '@/components/tag'
import Flex from '@/components/flex/flex'
import { localDateTimeString } from '@/__utils/index'

export type TPropsType = {
  update_at?: string
  keywords?: string[]
}
const infoList: React.FC<TPropsType> = props => {
  const { update_at, keywords } = props

  return (
    <div className="ww_post__info">
      <ul className="ww_post__list">
        <li className="ww_post__item">
          本文于 {localDateTimeString(update_at)} 首次更新在&nbsp;
          <Tag color="github" ghost>
            github
          </Tag>
          &nbsp;已同步至&nbsp;
          <Tag color="yuque" ghost>
            语雀
          </Tag>
        </li>
        <li className="ww_post__item">
          <span className="ww_post__item--label">相关标签</span>
          <Flex>
            {(keywords || []).map(item => (
              <Tag key={item}>{item}</Tag>
            ))}
          </Flex>
        </li>
        <li className="ww_post__item">
          <span className="ww_post__item--label">检索关键字</span>
          <Flex>
            <Tag ghost>wuh.site</Tag>
            <Tag ghost>吴尒红</Tag>
            <Tag ghost>日志、博客</Tag>
          </Flex>
        </li>
        <li className="ww_post__item">
          <span className="ww_post__item--label">版权声明</span>
          <div>署名-非商业性使用-禁止演绎 3.0 中国大陆(CC BY-NC-ND 3.0 CN)</div>
        </li>
      </ul>
    </div>
  )
}

export default infoList
