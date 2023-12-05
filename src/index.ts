import dotenv from 'dotenv';
import { CronJob } from 'cron';
import { MongoDB } from './utils/mongo';
import { creaSync } from './jobs/creaSync';
import { creaMasterSync } from './jobs/creaMasterSync';

dotenv.config();

// set mongo config
MongoDB.setConfig(String(process.env.MONGO_URI), String(process.env.MONGO_DB_NAME));

let creaSyncRunning = false;
let creaMasterSyncRunning = false;

new CronJob(
  '*/5 * * * * *',
  async function () {
    if (creaSyncRunning) return;
    creaSyncRunning = true;

    try {
      const db = await MongoDB.getDB();

      console.log('Crea sync start ===>', new Date().toISOString());
      await creaSync(db);
      console.log('Crea sync end ===>', new Date().toISOString());
    } catch (error) {
      console.log('Crea sync error ===>', error);
    }

    creaSyncRunning = false;
  },
  null,
  true,
  'America/New_York'
);

new CronJob(
  '*/10 * * * * *',
  async function () {
    if (creaMasterSyncRunning) return;
    creaMasterSyncRunning = true;

    try {
      const db = await MongoDB.getDB();

      console.log('Crea Master Sync start ===>', new Date().toISOString());
      await creaMasterSync(db);
      console.log('Crea Master Sync end ===>', new Date().toISOString());
    } catch (error) {
      console.log('Crea Master Sync error ===>', error);
    }

    creaMasterSyncRunning = false;
  },
  null,
  true,
  'America/New_York'
);

// const update = async () => {
//   try {
//     console.log('Crea Master Sync start ===>', new Date().toISOString());
//     const db = await MongoDB.getDB();

//     var bulkOps: any = [];
//     let i = 0;

//     const cities = await db.collection('cities').find().toArray();
//     console.log(cities.length)

//     for (const city of cities) {
//       var geoJsonLocation = {
//         type: 'Point',
//         coordinates: [city.lng, city.lat], // Note: Order is [longitude, latitude]
//       };

//       bulkOps.push({
//         updateOne: {
//           filter: { _id: city._id }, // Assuming _id is the document's ObjectId
//           update: { $set: { location: geoJsonLocation } },
//         },
//       });

//       // Execute the bulk update in batches of 500
//       if (bulkOps.length === 500) {
//         i++;
//         console.log(i);
//         await db.collection('cities').bulkWrite(bulkOps);
//         bulkOps = [];
//       }
//     }

//     // Execute the remaining bulk update operations
//     if (bulkOps.length > 0) {
//       db.collection('cities').bulkWrite(bulkOps);
//     }

//     console.log('Crea Master Sync end ===>', new Date().toISOString());
//   } catch (error) {
//     console.log('Crea Master Sync error ===>', error);
//   }
// };

// update();
