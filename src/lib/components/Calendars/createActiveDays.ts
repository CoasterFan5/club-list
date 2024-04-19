import dayjs from "dayjs"

import { RRule } from "$lib/utils/rrule"

import type { EventLike } from "./util"


export const createActiveDays = (day: dayjs.Dayjs, eventDays: EventLike[]) => {
	const unflatDays = eventDays.filter((event) => !event.draft).map(
			(event) =>
				[
					event,
					RRule.fromString(event.date)
						.between(
							day.date(1).utc().subtract(1, 'week').toDate(),
							day.date(day.daysInMonth()).utc().add(1, 'week').toDate()
						)
						.map(dayjs)
				] as const);
	const flattenedDaysActive = unflatDays.flatMap(([, days]) => days)
	return flattenedDaysActive
	
	
}