import dayjs from "dayjs"
import dayOfYear from 'dayjs/plugin/dayOfYear';
import utc from 'dayjs/plugin/utc';

import { RRule } from "$lib/utils/rrule"

import type { EventLike } from "./util"

dayjs.extend(utc)
dayjs.extend(dayOfYear)

export const createActiveDays = (day: dayjs.Dayjs, eventDays: EventLike[]) => {
	const newDay = dayjs(day);

	const nonDraftEvents = eventDays.filter((event) => !event.draft);
	const unFlatDays = nonDraftEvents.map((event) => {
		return {
			rawEvent: event,
			days: RRule.fromString(event.date)
			.between(
				newDay.date(1).utc().subtract(1, 'week').toDate(),
				newDay.date(day.daysInMonth()).utc().add(1, 'week').toDate()
			)
			.map(dayjs)
		} as const;
	})

	
	const flattenedDaysActive = unFlatDays.flatMap((item) => item.days)
	return {
		unFlatDays,
		flattenedDaysActive
	}
	
	
}