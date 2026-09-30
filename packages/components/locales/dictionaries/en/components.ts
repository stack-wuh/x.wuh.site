import type { DeepPartial, Dict } from '../zh'

export const components: DeepPartial<Dict['components']> = {
  preview: {
    title: 'Image preview',
    emptyCaption: 'No image to preview',
    emptyState: 'No images to preview',
    subtitleHint: '←/→ to switch · ESC to close',
    legend: '←/→ navigate · Space for next · ESC to close',
    previous: 'Previous image',
    next: 'Next image',
    close: 'Close preview',
    more: 'More actions',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetZoom: 'Reset zoom',
    rotate: 'Rotate image',
    rotateShort: 'Rotate',
    download: 'Download image',
    downloadShort: 'Download',
    fullscreen: 'Fullscreen',
    enterFullscreen: 'Enter fullscreen',
    exitFullscreen: 'Exit fullscreen',
    thumbnailAria: 'Preview image {index}',
    thumbnailAlt: 'Preview {index}',
  },
  alert: {
    defaultTitle: 'Supplementary notes',
    defaultSummary: 'Additional notes for this article, for reference and further reading.',
    shareLabel: 'Share article',
    closeNotice: 'Close notice',
    updatedAtLabel: 'Updated:',
    updatedByTitle: 'Updated by {by} at {time}',
    updatedAtTitle: 'Updated at {time}',
    updatedAt: 'updated at {time}',
    githubProfileTitle: 'Visit {by} on GitHub',
    sourceLinkLabel: 'Source:',
    projectLabel: 'Project:',
    licenseLabel: 'License:',
    labelsLabel: 'Labels:',
    labelsAria: 'Document labels',
  },
  heatmap: {
    date: '{m}/{d}',
    less: 'Less',
    more: 'More',
  },
  footprintMap: {
    here: 'I am here',
    homeAddress: "Bao'an District, Shenzhen · Lixinhu Creative Park",
    loading: 'Loading map',
    loadingDetail: 'Drawing footprints',
  },
  progress: {
    defaultLabel: 'Progress',
  },
  empty: {
    title: 'Nothing here yet',
  },
  result: {
    errorTitle: 'Something went wrong',
    infoTitle: 'Notice',
    unavailable: 'This page is temporarily unavailable. Please try again later.',
  },
  image: {
    loadFailed: 'Image failed to load',
  },
  dialog: {
    close: 'Close',
  },
  message: {
    closeNotice: 'Close notice',
  },
}
