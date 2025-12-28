import { Map, Marker } from 'react-amap'

const mapKey = 'd9895d6db5dfef6baaf99d47ee746707'
const center = {
  longitude: 113.857083,
  latitude: 22.581175,
}

const amapConfig = {
  zoomEnable: false,
  zoom: 14,
}

const AMap = () => {
  return (
    <div className="ww_amap">
      <Map center={center} amapkey={mapKey} {...amapConfig}>
        <Marker />
      </Map>

      <style jsx>{`
        .ww_amap {
          height: 25em;
          padding: var(--padding-base) 0;
        }
      `}</style>
    </div>
  )
}

export default AMap
