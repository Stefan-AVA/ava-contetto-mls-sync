import { Db } from 'mongodb';
import { Source } from '../types/source';
import { creaSearch } from '../utils/creaClient';

export const creaMasterSync = async (db: Db) => {
  const records = await creaSearch(`(ID=*)`);

  if (records?.length) {
    console.log('Crea Master records ===>', records.length);
    await db.collection('mlsListings').updateOne(
      { source: Source.crea, source_id: { $in: records.map((record) => record.ListingKey) } },
      {
        $set: {
          deleted: false,
        },
      }
    );

    await db.collection('mlsListings').updateOne(
      { source: Source.crea, source_id: { $nin: records.map((record) => record.ListingKey) } },
      {
        $set: {
          deleted: true,
        },
      }
    );
  }
};
