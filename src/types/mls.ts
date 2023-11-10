import { Source } from './source';

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

// export interface IMlsListing {
//   source: Source;
//   source_id: string;
//   street_address?: string;
//   city?: string;
//   province?: string;
//   country?: string;
//   postal_code?: string;
//   build_year?: string;
//   bathrooms?: number;
//   bedrooms?: number;
//   lot_size?: number;
//   lot_units?: string;
//   floor_size?: number;
//   floor_units?: string;
//   list_price?: number;
//   tax?: string;
//   description?: string;
//   listing_agent_name?: string;
//   listing_agent_phone?: string;
//   listing_agent_email?: string;
//   listing_agent_website?: string;
//   listing_office_name?: string;
//   listing_office_phone?: string;
//   listing_office_website?: string;
//   mls_listing_link?: string;
//   mls_id?: string;
//   photos?: IMlsPhoto[];
//   photo_key?: string;
//   photos_change_timestamp?: number;
//   timestamp: number;
//   timestampString?: string;
// }
