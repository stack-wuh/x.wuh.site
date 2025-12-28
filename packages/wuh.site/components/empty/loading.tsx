import * as React from 'react'
import { NextSeo } from 'next-seo'

const Loading: React.FC<{}> = () => {
  return (
    <div className="ww_loading">
      <NextSeo title="loading·日积跬步,以致千里·wuh.site" />
      <h4>loading</h4>
    </div>
  )
}

export default Loading
