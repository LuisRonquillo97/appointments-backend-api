import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export class DateUtil {
  static getMexicoCityTime(date: Date = new Date()): string {
    const mexicoCityTimeZone = process.env.TIMEZONE || 'America/Mexico_City';
    const zonedDate = toZonedTime(date, mexicoCityTimeZone);
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  }
}
