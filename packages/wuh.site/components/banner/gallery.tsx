import React, { useRef } from 'react'
import classnames from 'classnames'
import Slider, { Settings } from 'react-slick'
import { Button } from '@/components/button'
import { useRequest } from 'ahooks'
import fetcher from '@/lib/fetch'
import { API_GALLERY_LIST } from '@/constant/api'
import { rowItem } from '@/pages/api/gallery'

type galleryDataType = {
  galleryList: rowItem[]
}
const useGalleryData = (): galleryDataType => {
  const { data: gallery } = useRequest(() => {
    return fetcher(`${API_GALLERY_LIST}`)
  }, {
    cacheKey: API_GALLERY_LIST
  })

  if (!gallery || !gallery.data || gallery.error) return { galleryList: [] }

  return {
    galleryList: gallery.data.rows,
  }
}

type galleryPropsType = {
  data: any[]
  onClose?: () => void
}
const Gallery: React.FC<galleryPropsType> = props => {
  const slideRef = useRef<Slider | null>(null)
  const galleryData = useGalleryData()

  const innerClassnames = classnames('ww_gallery__item')

  const slideConfig: Settings = {
    dots: false,
    infinite: false,
    autoplay: false,
    speed: 1500,
    autoplaySpeed: 2000,
    arrows: false,
  }

  const handleNextSlide = () => slideRef.current?.slickNext()

  const handlePrevSlide = () => slideRef.current?.slickPrev()

  const handleClose = () => {
    if (props.onClose) {
      props.onClose()
    }
  }

  return (
    <div className="ww_gallery">
      <Slider ref={slideRef} {...slideConfig}>
        {galleryData.galleryList.map(item => (
          <div key={item.url} className={innerClassnames}>
            <div className="ww_gallery__bg">
              <style jsx>{`
                .ww_gallery__bg {
                  background: url(${item.url}?width=384&quality=75) no-repeat;
                }
              `}</style>
            </div>
          </div>
        ))}
      </Slider>
      <div className="ww_gallery__footer">
        <div className="ww_gallery__desc">
          <p className="ww_gallery__desc--title">美丽湖北，美丽枝江</p>
          <p className="ww_gallery__desc--desc">
            <span>故乡山川 -- </span>
            <span>以方圆百里得名 -- </span>
            <span>by (@吴尒红)</span>
          </p>
        </div>
        <div className="ww_gallery__btns">
          <Button
            className="ww_gallery__btns--item"
            size="small"
            onClick={handlePrevSlide}
            icon="icon-arrow-lift"
          />
          <Button
            className="ww_gallery__btns--item"
            size="small"
            onClick={handleNextSlide}
            icon="icon-arrow-right"
          />
          <Button
            className="ww_gallery__btns--item"
            size="small"
            onClick={handleClose}
            icon="icon-searchclose"
          />
        </div>
      </div>
    </div>
  )
}

export default Gallery
