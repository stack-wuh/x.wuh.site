'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { BilibiliPlayer } from '@wuh.site/components/footprint-map/bilibili'
import type { FootprintData } from '@wuh.site/components/footprint-map'

const FootprintMap = dynamic(
  () => import('@wuh.site/components/footprint-map'),
  { ssr: false }
)
import ImagePreview from '@wuh.site/components/image-preview'
import useImagePreview from '@wuh.site/hooks/useImagePreview'
import {
  FullLayout,
  MapPanel,
  ContentPanel,
  PlaceName,
  PlaceDate,
  PhotoGrid,
  Photo,
  HtmlContent,
  EmptyPanel,
} from '@wuh.site/components/footprint-map/styles'
import * as S from './styles'

export default function FootprintPage() {
  const [footprints, setFootprints] = useState<FootprintData[]>([])
  const [selected, setSelected] = useState<FootprintData | null>(null)
  const imagePreview = useImagePreview()

  useEffect(() => {
    fetch('/api/footprints')
      .then((res) => res.json())
      .then((json) => {
        const data = json.data || []
        setFootprints(data)
        if (data.length > 0) setSelected(data[0])
      })
      .catch(() => {})
  }, [])

  const handleMarkerClick = (fp: FootprintData) => {
    setSelected(fp)
  }

  const handlePhotoClick = (index: number) => {
    imagePreview.open(index)
  }

  return (
    <S.Root>
      <S.Title>足迹</S.Title>
      <FullLayout>
        <MapPanel>
          <FootprintMap
            footprints={footprints}
            variant="full"
            onMarkerClick={handleMarkerClick}
          />
        </MapPanel>
        <ContentPanel>
          {selected ? (
            <>
              <div>
                <PlaceName>{selected.name}</PlaceName>
                <PlaceDate>
                  {new Date(selected.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </PlaceDate>
              </div>

              {selected.photos.length > 0 && (
                <div>
                  <PhotoGrid>
                    {selected.photos.map((url, i) => (
                      <Photo
                        role='thumbnail'
                        key={i}
                        src={url}
                        alt={selected.name}
                        width={160}
                        height={160}
                        onClick={() => handlePhotoClick(i)}
                      />
                    ))}
                  </PhotoGrid>
                  <ImagePreview
                    bind={imagePreview.bind}
                    images={selected.photos.map((src) => ({ src, alt: selected.name }))}
                  />
                </div>
              )}

              {selected.videos.length > 0 && (
                <div>
                  {selected.videos.map((url, i) => (
                    <S.VideoItem key={i}>
                      <BilibiliPlayer url={url} />
                    </S.VideoItem>
                  ))}
                </div>
              )}

              {selected.content && (
                <HtmlContent dangerouslySetInnerHTML={{ __html: selected.content }} />
              )}
            </>
          ) : (
            <EmptyPanel>请在地图上选择一个地点</EmptyPanel>
          )}
        </ContentPanel>
      </FullLayout>
    </S.Root>
  )
}
