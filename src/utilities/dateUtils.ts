// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';

// dayjs.extend(utc);
// dayjs.extend(timezone);

// const TAIPEI_TIMEZONE = 'Asia/Taipei';
// dayjs.tz.setDefault(TAIPEI_TIMEZONE);

export function convertToTaipeiTime(date: Date | string): Date {
    const inputDate = new Date(date);
    const taipeiDate = new Date(inputDate.getTime() + 8 * 60 * 60 * 1000);
    return taipeiDate;
}