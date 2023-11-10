import { Db } from 'mongodb';
import { Source } from '../types/source';
import { creaSearch, getCreaPhotos } from '../utils/creaClient';
import { getISOStringFromUnix, getTimeStampFromString } from '../utils/date';
import { formatField } from '../utils';

const REQUEST_LIMIT = 100;
const stValues = [
  'ListingId',
  'ListingKey',
  'ListOfficeKey',
  'StreetNumber',
  'ListAgentKey',
  'CoListOfficeKey',
  'CoListAgentKey',
  'OriginatingSystemKey',
];

export const creaSync = async (db: Db) => {
  let last_synced_date = '(LastUpdated=2023-10-01T00:00:00Z)';
  const listings = await db
    .collection('mlsListing')
    .find({ source: Source.crea, timestamp: { $exists: true } })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();

  if (listings.length > 0) {
    console.log('last listing ===>', listings[0].source_id, listings[0].ModificationTimestamp);
    last_synced_date = `(LastUpdated=${getISOStringFromUnix(listings[0].timestamp)})`;
  }

  const records = await creaSearch(last_synced_date, REQUEST_LIMIT, 0);
  console.log('records ===>', records?.length);

  if (records?.length) {
    for (const record of records) {
      const timestamp = getTimeStampFromString(record.ModificationTimestamp);
      console.log('record ===>', record.ListingKey, record.ModificationTimestamp, timestamp);

      const photos = await getCreaPhotos(records[0].ListingKey);
      const listing: any = Object.keys(record).reduce(
        (obj, key) => ({ ...obj, [key]: stValues.includes(key) ? record[key] : formatField(record[key]) }),
        {}
      );

      await db.collection('mlsListing').updateOne(
        { source: Source.crea, source_id: listing.ListingKey },
        {
          $set: {
            ...listing,
            photos,
            source: Source.crea,
            source_id: listing.ListingKey,
            timestamp,
            location:
              listing.Longitude && listing.Latitude
                ? {
                    type: 'Point',
                    coordinates: [listing.Longitude, listing.Latitude],
                  }
                : null,
          },
        },
        { upsert: true }
      );
    }
  }
};
