import { DateTime } from 'luxon';

export const getTimeStampFromString = (
  time: string,
  format: string = 'dd/LL/yyyy hh:mm:ss a',
  zone: string = 'GMT'
) => {
  return DateTime.fromFormat(time, format, { zone }).toSeconds();
};

export const getTimeFromString = (time: string, format: string = 'dd/LL/yyyy hh:mm:ss a', zone: string = 'GMT') => {
  return DateTime.fromFormat(time, format, { zone }).toJSDate();
};

export const getISOStringFromUnix = (timestamp: number, zone: string = 'GMT') => {
  return DateTime.fromSeconds(timestamp, { zone })
    .toISO({ includeOffset: true, includePrefix: false })
    ?.replace('.000', '');
};
