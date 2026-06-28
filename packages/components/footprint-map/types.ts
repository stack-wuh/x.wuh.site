export interface FootprintData {
  _id: string;
  name: string;
  lng: number;
  lat: number;
  date: Date | string;
  photos: string[];
  videos: string[];
  content: string;
}

export interface FootprintMapProps {
  footprints: FootprintData[];
  variant?: 'compact' | 'full';
  onMarkerClick?: (footprint: FootprintData) => void;
}
