import { MongoClient, ServerApiVersion } from 'mongodb';

export class MongoDB {
  static uri = '';
  static dbName = '';
  static client: MongoClient | undefined = undefined;

  static setConfig(uri: string, dbName: string) {
    this.uri = uri;
    this.dbName = dbName;
  }

  static async connect(): Promise<MongoClient | undefined> {
    if (this.client) return;
    try {
      const client = new MongoClient(this.uri, {
        // serverApi: ServerApiVersion.v1,
        maxPoolSize: 10,
        minPoolSize: 1,
        ssl: true,
      });
      await client.connect();
      console.log('mongodb connected')
      this.client = client;
      return;
    } catch (error) {
      console.log('connection error. retrying ...');
      return await this.connect();
    }
  }

  static async getDB(name?: string) {
    if (!this.uri) return Promise.reject({ message: 'please set config first' });

    await this.connect();
    const dbName = name || this.dbName;
    if (dbName && this.client) {
      return this.client?.db(dbName);
    }

    return Promise.reject({ message: 'please set config first' });
  }
}
