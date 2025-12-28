import React from 'react'
import classnames from 'classnames'
import Slider, { Settings } from 'react-slick'
import { rowItem } from '@/pages/api/banner'
import Tag from '@/components/tag'
import Link from 'next/link'

type propsType = {
  data: rowItem[]
}
const Post: React.FC<propsType> = props => {
  const { data } = props

  const innerClassnames = classnames('ww_banner__item', 'ww_banner__bg')

  const slideConfig: Settings = {
    dots: true,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    arrows: false,
    dotsClass: 'slick-dots-list',
  }

  return (
    <div className="ww_banner">
      <Slider {...slideConfig}>
        {data.map(item => (
          <Link
            key={item.title}
            passHref
            href={{ pathname: '/post/[id]', query: { id: item.title } }}>
            <div key={item.title} className={innerClassnames}>
              <style jsx>{`
                .ww_banner__bg {
                  background: url(${item.cover}) no-repeat;
                }
              `}</style>
              <div className="ww_banner__head">
                <div className="ww_banner__head--lf">
                  <Tag color={item.tag} size="small">
                    {item.alt}
                  </Tag>
                </div>
                <div className="ww_banner__head--rg">
                  <div className="ww_banner__title">
                    <i className="iconfont icon-affix icon-affix-left" />
                    <span className="ww_banner__title--text">{item.title}</span>
                    <i className="iconfont icon-affix icon-affix-right" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  )
}

export default Post
