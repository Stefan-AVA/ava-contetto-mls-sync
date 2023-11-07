import { Db } from 'mongodb';
import { IMlsListing } from '../types/mls';
import { Source } from '../types/source';
import { creaSearch, getCreaPhotos } from '../utils/creaClient';
import { getISOStringFromUnix, getTimeFromString, getTimeStampFromString } from '../utils/date';

const REQUEST_LIMIT = 100;

const formatListingNumber = (listingNumber: string): number | undefined => {
  return !listingNumber.trim() ? undefined : parseInt(listingNumber.trim());
};

const formatListing = (listing: any): IMlsListing => ({
  source: Source.crea,
  source_id: listing.ListingId,
  mls_id: listing.ListingId,
  street_address: listing.UnparsedAddress,
  city: listing.City,
  province: listing.StateOrProvince,
  country: listing.Country,
  postal_code: listing.PostalCode,
  build_year: listing.YearBuilt,
  bathrooms: formatListingNumber(listing.BathroomsTotal),
  bedrooms: formatListingNumber(listing.BedroomsTotal),
  lot_size: listing.LotSizeArea,
  lot_units: listing.LotSizeUnits,
  floor_size: listing.BuildingAreaTotal,
  floor_units: listing.BuildingAreaUnits,
  list_price: listing.ListPrice,
  description: listing.PublicRemarks,
  listing_agent_name: listing.ListAgentFullName,
  listing_agent_phone: listing.ListAgentDirectPhone,
  listing_agent_email: listing.ListAgentEmail === 'False' ? undefined : listing.ListAgentEmail,
  listing_agent_website: listing.ListAgentURL,
  listing_office_name: listing.ListOfficeName,
  listing_office_phone: listing.ListOfficePhone,
  listing_office_website: listing.ListOfficeURL,
  mls_listing_link: listing.MoreInformationLink,
  photos_change_timestamp: listing.PhotosChangeTimestamp && getTimeStampFromString(listing.PhotosChangeTimestamp),
  photo_key: listing.ListingKey,
  timestamp: getTimeStampFromString(listing.ModificationTimestamp),
  timestampString: listing.ModificationTimestamp,
});

export const creaSync = async (db: Db) => {
  let last_synced_date = '(LastUpdated=2023-10-01T00:00:00Z)';
  const listings = await db
    .collection<IMlsListing>('mlsListing')
    .find({ source: Source.crea, timestamp: { $exists: true } })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();

  if (listings.length > 0) {
    console.log('last listing ===>', listings[0].source_id, listings[0].timestampString);
    last_synced_date = `(LastUpdated=${getISOStringFromUnix(listings[0].timestamp)})`;
  }

  const records = await creaSearch(last_synced_date, REQUEST_LIMIT, 0);
  console.log('records ===>', records?.length);

  if (records?.length) {
    for (const record of records) {
      const timestamp = getTimeStampFromString(record.ModificationTimestamp);
      console.log(
        'record ===>',
        record.ListingId,
        record.ModificationTimestamp,
        timestamp,
        getISOStringFromUnix(timestamp)
      );

      const photos = await getCreaPhotos(records[0].ListingKey);
      const listing = formatListing(record);

      await db
        .collection<IMlsListing>('mlsListing')
        .updateOne(
          { source: Source.crea, source_id: listing.source_id },
          { $set: { ...listing, photos } },
          { upsert: true }
        );
    }
  }
};
