export interface ICreaPhotoResult {
  records?: ICreaPhoto[];
}

export interface ICreaPhoto {
  ResourceRecordID: string;
  Order: string;
  MediaUrl: string;
  MediaModificationTimestamp: string;
}

export interface IMlsPhoto {
  sourceId: string;
  order: number;
  url: string;
  modificationTimestamp: string;
}

export interface ILocation {
  type: 'Point';
  coordinates: number[]; // lng, lat
}

export interface ICoordinates {
  address: string;
  lng: number;
  lat: number;
}
