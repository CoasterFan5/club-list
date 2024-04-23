import dayjs from 'dayjs';

const createEmptyArray = (length: number) => Array(length).fill(0);

const createWrappedDate = (day: dayjs.Dayjs, inMonth: boolean) => {
	return {
		day,
		inMonth
	};
};

export const createCalendarDays = (passedDay?: dayjs.Dayjs) => {
	const currentDay = dayjs(passedDay);

	// 7 days per week, always show 6 rows since that is the maximum number of rows that a month can have.
	const gridSize = 7 * 6;
	const startPaddingDays = createEmptyArray(currentDay.date(1).day())
		.map((_, i) => createWrappedDate(currentDay.date(-i), false))
		.reverse();
	const daysInMonth = createEmptyArray(currentDay.daysInMonth()).map((_, i) =>
		createWrappedDate(currentDay.date(i + 1), true)
	);
	const lastDayOfMonth = currentDay.date(currentDay.daysInMonth());
	const endPaddingDays = createEmptyArray(
		gridSize - startPaddingDays.length - daysInMonth.length
	).map((_, i) => createWrappedDate(currentDay.date(lastDayOfMonth.date() + i + 1), false));

	return {
		loopDay: currentDay,
		days: [...startPaddingDays, ...daysInMonth, ...endPaddingDays]
	};
};
