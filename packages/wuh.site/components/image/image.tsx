import Image, { ImageProps } from 'next/image'

const customLoader = ({ src, width, quality = 75 }: ImageProps) =>
  `${src}?width=${width}&quality=${quality}`

const initialProps: ImageProps = {
  src: 'https://src.wuh.site/cover.webp',
  loader: customLoader,
  alt: 'cover_img',
  layout: 'fixed',
  width: 48,
  height: 48,
}
export default function image(props: ImageProps) {
  const { alt, src, loader, layout, width, height } = props
  const nowConf = {
    alt: alt ?? initialProps.alt,
    src: src ?? initialProps.src,
    loader: loader ?? initialProps.loader,
    layout: layout ?? initialProps.layout,
    width: width ?? initialProps.width,
    height: height ?? initialProps.height,
  }
  return (
    <Image
      loading="lazy"
      loader={nowConf.loader}
      src={src}
      layout={nowConf.layout}
      width={nowConf.width}
      height={nowConf.height}
      alt={nowConf.alt}
    />
  )
}
