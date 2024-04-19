import dayjs from 'dayjs';

const createEmptyArray = (length: number) => Array(length).fill(0);

const createWrappedDate = (day: dayjs.Dayjs, inMonth: boolean) => {
	return {
		day,
		inMonth
	}
}

export const createCalendarDays = (passedDay?: dayjs.Dayjs) => {
	const day = dayjs(passedDay);

	
	const startPaddingDays = createEmptyArray(day.date(1).day()).map((_, i) => createWrappedDate(day.date(-i), false)).reverse();
	const daysInMonth = createEmptyArray(day.daysInMonth()).map((_, i) => createWrappedDate(day.date(i + 1), true));
	const lastDay = day.date(day.daysInMonth());
	const endPaddingDays = lastDay.day() < 6? createEmptyArray(6 - lastDay.day()).map((_, i) => createWrappedDate(day.date(lastDay.date() + i + 1), false)): [];

	
	return {
		loopDay: day,
		days: [...startPaddingDays, ...daysInMonth, ...endPaddingDays]
	}
}