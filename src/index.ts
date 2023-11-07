import dotenv from 'dotenv';
import { CronJob } from 'cron';
import { MongoDB } from './utils/mongo';
import { creaSync } from './jobs/creaSync';

dotenv.config();

// set mongo config
MongoDB.setConfig(String(process.env.MONGO_URI), String(process.env.MONGO_DB_NAME));

let creaSyncRunning = false;

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
