import { Db } from 'mongodb';
import { Source } from '../types/source';
import { creaSearch, getCreaPhotos } from '../utils/creaClient';
import { getISOStringFromUnix, getTimeStampFromString } from '../utils/date';
import { formatField } from '../utils';
import { ICoordinates, IGeoCode, ILocation } from '../types/mls';
import { getGeocode } from '../utils/geo';

const REQUEST_LIMIT = 100;
const stValues = [
  'ListingId',
  'ListingKey',
  'ListOfficeKey',
  'StreetName',
  'StreetNumber',
  'ListAgentKey',
  'CoListOfficeKey',
  'CoListAgentKey',
  'OriginatingSystemKey',
  'PostalCode',
];

export const creaSync = async (db: Db) => {
  let last_synced_date = '(LastUpdated=2023-10-01T00:00:00Z)';
  const listings = await db
    .collection('mlsListings')
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

      if (!record.UnparsedAddress && !record.City && !record.StateOrProvince && !record.Country) {
        continue;
      }

      const address = `${record.UnparsedAddress}, ${record.City}, ${record.StateOrProvince}, ${record.Country}`
        .replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '')
        .replace(record.UnitNumber, '')
        .replace('-', '')
        .trim();
      console.log('address ===>', address);

      const photos = await getCreaPhotos(records[0].ListingKey);

      const listing: any = Object.keys(record).reduce(
        (obj, key) => ({ ...obj, [key]: stValues.includes(key) ? record[key] : formatField(record[key]) }),
        {}
      );

      const location: ILocation = {
        type: 'Point',
        coordinates: [],
      };

      let geoCode: IGeoCode | null = null;

      console.log('position ===>', listing.Longitude, listing.Latitude);
      if (listing.Longitude && listing.Latitude) {
        location.coordinates = [listing.Longitude, listing.Latitude];
        await db.collection('coordinates').updateOne(
          { address },
          {
            $set: {
              address,
              lng: listing.Longitude,
              lat: listing.Latitude,
            },
          },
          { upsert: true }
        );
      } else {
        const coordinates = await db.collection<ICoordinates>('coordinates').findOne({ address });
        if (!coordinates) {
          geoCode = await getGeocode(address);

          if (!geoCode) continue;
          if (
            (geoCode.resultType !== 'houseNumber' && geoCode.resultType !== 'street') ||
            geoCode.scoring.queryScore < 0.8
          ) {
            // store result into notFoundListings
            await db.collection('notFoundListings').updateOne(
              { source: Source.crea, source_id: listing.ListingKey },
              {
                $set: {
                  ...listing,
                  photos,
                  source: Source.crea,
                  source_id: listing.ListingKey,
                  timestamp,
                  deleted: false,
                  geoQuery: address,
                  geoCode,
                },
              },
              { upsert: true }
            );
            continue;
          }

          await db.collection('coordinates').updateOne(
            { address },
            {
              $set: {
                address,
                lng: geoCode.position.lng,
                lat: geoCode.position.lat,
              },
            },
            { upsert: true }
          );

          location.coordinates = [geoCode.position.lng, geoCode.position.lat];
        } else {
          location.coordinates = [coordinates.lng, coordinates.lat];
        }
      }

      await db.collection('mlsListings').updateOne(
        { source: Source.crea, source_id: listing.ListingKey },
        {
          $set: {
            ...listing,
            photos,
            source: Source.crea,
            source_id: listing.ListingKey,
            timestamp,
            deleted: false,
            location,
            geoQuery: address,
            geoCode,
          },
        },
        { upsert: true }
      );
    }
  }
};
