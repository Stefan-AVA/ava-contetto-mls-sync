import dotenv from 'dotenv';
dotenv.config();

import { DdfCulture, RetsClient, RetsFormat, RetsVersion } from 'rets-ddf-client';
import { ICreaPhotoResult, IMlsPhoto } from '../types/mls';

let client: RetsClient;

export const getCreaClient = async () => {
  if (client) {
    return client;
  } else {
    client = new RetsClient({
      url: 'https://data.crea.ca/Login.svc/Login',
      username: String(process.env.CREA_USERNAME),
      password: String(process.env.CREA_PASSWORD),
      version: RetsVersion.CREA_DDF,
    });

    await client.login();

    return client;
  }
};

export const creaSearch = async (query: string, limit?: number, offset?: number, select?: string | string[]) => {
  console.log({ query, limit, offset });

  const client = await getCreaClient();

  const response = await client.search({
    format: RetsFormat.CompactDecoded,
    query,
    select,
    searchType: 'Property',
    class: 'Property',
    culture: DdfCulture.EN_CA,
    limit,
    offset,
  });

  return response.records;
};

export const getCreaPhotos = async (photoKey: string): Promise<IMlsPhoto[]> => {
  try {
    const client = await getCreaClient();

    const result = (await client.getObjects({
      resource: 'Property',
      type: 'LargePhoto',
      contentId: photoKey,
      withLocation: false,
    })) as unknown as ICreaPhotoResult[];

    if (!result || !result[0].records?.length) {
      return [];
    }

    const photos = result[0].records.map((photo) => ({
      sourceId: photo.ResourceRecordID,
      order: parseInt(photo.Order),
      url: photo.MediaUrl,
      modificationTimestamp: photo.MediaModificationTimestamp,
    }));

    return photos;
  } catch (error: any) {
    return [];
  }
};
