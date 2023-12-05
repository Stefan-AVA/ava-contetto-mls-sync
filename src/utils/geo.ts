import dotenv from 'dotenv';
import { IGeoCode } from '../types/mls';
dotenv.config();

interface IGeocodeResponse {
  items: IGeoCode[];
}

export const getGeocode = async (address: string): Promise<IGeoCode | null> => {
  try {
    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${process.env.HERE_API_KEY}`
    );
    const data = (await response.json()) as IGeocodeResponse;

    return data?.items[0];
  } catch (error) {
    console.log('geocode error ===>', address, error);
    return null;
  }
};
