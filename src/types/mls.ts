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

export interface IGeoCode {
  title: string;
  id: string;
  resultType: string;
  address: any;
  position: {
    lat: number;
    lng: number;
  };
  access: {
    lat: number;
    lng: number;
  }[];
  mapView: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
  scoring: {
    queryScore: number;
    fieldScore: {
      country: number;
      state: number;
      city?: number;
      houseNumber?: number;
      district?: number;
      postalCode?: number;
      streets?: number[];
    };
  };
}

export interface ICoordinates {
  address: string;
  lng: number;
  lat: number;
}
