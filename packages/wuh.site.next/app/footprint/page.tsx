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
  EmptyPanel,
} from '@wuh.site/components/footprint-map/styles'

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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: 24 }}>
        足迹
      </h1>
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
                        key={i}
                        src={url}
                        alt={selected.name}
                        onClick={() => handlePhotoClick(i)}
                        loading="lazy"
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
                    <div key={i} style={{ marginBottom: 12 }}>
                      <BilibiliPlayer url={url} />
                    </div>
                  ))}
                </div>
              )}

              {selected.content && (
                <div
                  style={{ lineHeight: 1.75, fontSize: '0.9375rem' }}
                  dangerouslySetInnerHTML={{ __html: selected.content }}
                />
              )}
            </>
          ) : (
            <EmptyPanel>请在地图上选择一个地点</EmptyPanel>
          )}
        </ContentPanel>
      </FullLayout>
    </div>
  )
}
