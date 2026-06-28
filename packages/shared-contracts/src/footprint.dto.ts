export interface FootprintDto {
  _id?: string;
  name: string;
  lng: number;
  lat: number;
  date: Date | string;
  photos: string[];
  videos: string[];
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
