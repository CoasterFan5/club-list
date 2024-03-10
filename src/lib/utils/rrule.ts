import * as rrule from 'rrule';

import { browser, dev } from '$app/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { RRule } = browser || !dev ? rrule : ((rrule as any).default as typeof rrule);

export let freqMapping: Record<string, rrule.Frequency>;

// TODO: move RRULE to esm
if (RRule) {
	freqMapping = {
		daily: RRule.DAILY,
		weekly: RRule.WEEKLY,
		monthly: RRule.MONTHLY,
		yearly: RRule.YEARLY
	};
}

export { RRule };
