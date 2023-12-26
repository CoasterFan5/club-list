import { browser } from '$app/environment';
import * as rrule from 'rrule';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { RRule } = browser ? rrule : (rrule as any).default as typeof rrule;

export { RRule };
