import dayjs from 'dayjs';

export const datesOnSameDay = (date1: dayjs.Dayjs) => (date2: dayjs.Dayjs) =>
	date1.dayOfYear() === date2.dayOfYear() && date1.year() === date2.year();
