import dotenv from 'dotenv';
dotenv.config();

interface ILocation {
  lat: number;
  lng: number;
}

interface IGeocodeResponse {
  items: { position: ILocation }[];
}

export const getGeocode = async (address: string): Promise<ILocation | null> => {
  try {
    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${process.env.HERE_API_KEY}`
    );
    const data = (await response.json()) as IGeocodeResponse;
    const position = data?.items[0]?.position;

    return position;
  } catch (error) {
    console.log('geocode error ===>', address, error);
    return null;
  }
};
