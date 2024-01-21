<script lang="ts">
	import dayjs from 'dayjs';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import dayOfYear from 'dayjs/plugin/dayOfYear';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';
	import type { Frequency, Weekday } from 'rrule';
	import { onMount, tick } from 'svelte';
	import timezones from 'timezones-list';

	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import Select from '$lib/components/Select.svelte';
	import Modal from '$lib/modules/Modal.svelte';

	import { RRule } from './rrule.js';

	const freqMapping: Record<string, Frequency> = {
		daily: RRule.DAILY,
		weekly: RRule.WEEKLY,
		monthly: RRule.MONTHLY,
		yearly: RRule.YEARLY
	};

	export let data;

	dayjs.extend(dayOfYear);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(advancedFormat);

	const datesOnSameDay = (date1: dayjs.Dayjs) => (date2: dayjs.Dayjs) =>
		date1.dayOfYear() === date2.dayOfYear() && date1.year() === date2.year();

	$: daysActive = data.events.map(
		(event) => [event, RRule.fromString(event.date).all().map(dayjs)] as const
	);

	$: flattenedDaysActive = daysActive.flatMap(([, days]) => days);
	let day = dayjs();

	const safeNumber = (num: string): number | null => {
		const parsed = parseInt(num);
		return isNaN(parsed) ? null : parsed;
	};

	let formDate = dayjs().format('YYYY-MM-DD');
	let formTime = dayjs().format('HH:mm');

	$: calculatedFormDate = dayjs(formDate)
		.set('hour', safeNumber(formTime.split(':')[0]) || 0)
		.set('minute', safeNumber(formTime.split(':')[1]) || 0)
		.utc()
		.format();

	const emptyArray = (length: number) => Array(length).fill(0);

	$: daysInMonth = emptyArray(day.daysInMonth()).map((_, i) => day.date(i + 1));

	$: startPaddingDays = emptyArray(day.date(1).day())
		.map((_, i) => day.date(-i))
		.reverse();

	$: lastDay = day.date(day.daysInMonth());

	$: endPaddingDays =
		lastDay.day() < 6
			? emptyArray(6 - lastDay.day()).map((_, i) => day.date(lastDay.date() + i + 1))
			: [];

	$: calendarDays = [...startPaddingDays, ...daysInMonth, ...endPaddingDays];

	let selectedDay: dayjs.Dayjs | null = null;

	let repeats = false;
	let allDay = false;
	let repeatType = 'indefinetly';
	let interval = '1';
	let timeZone = 'America/Los_Angeles';
	$: parsedInterval = parseInt(interval);
	let count = '1';
	$: parsedCount = parseInt(count);
	let inputFrequency = 'weekly';
	$: derivedFrequency = freqMapping[inputFrequency];
	let upTo = new Date().toISOString().split('T')[0];
	let useMonthlyDay = false;
	let dayOfTheMonth = 0;
	let weeks = 
		[
			...emptyArray(5).map((_, i) => i + 1)
				.map((week) => ({
					name: week.toString(),
					ordinal: week,
					enabled: false
				})),
			...emptyArray(4).map((_, i) => i + 1)
				.map((week) => ({
					name: `${week} to last`,
					ordinal: -week,
					enabled: false
				}))
		];
	$: enabledWeeks = weeks.filter((week) => week.enabled).map((week) => week.ordinal);
	$: rrule = new RRule({
		freq: derivedFrequency,
		interval: parsedInterval,
		dtstart: new Date(formDate),
		wkst: RRule.SU,
		count: repeatType === 'amount' ? parsedCount : undefined,
		until: repeatType === 'upTo' && upTo ? new Date(upTo) : undefined,
		bymonthday: inputFrequency === 'monthly' && useMonthlyDay ? dayOfTheMonth : undefined,
		byweekday: enabledWeekdays.length > 0 && inputFrequency !== 'daily'
			? (
				inputFrequency === 'monthly' && !useMonthlyDay
					? enabledWeekdays.flatMap(weekday => {
						if (enabledWeeks.length === 0) return [weekday];
						return enabledWeeks.map(week => weekday.nth(week));
					})
					: enabledWeekdays
			)
			: undefined
	});

	$: dayOfTheMonth = dayjs(formDate).date();
	function updateMonthlyTimer() {
		weekdays = weekdays.map((weekday, i) => ({
			...weekday,
			enabled: dayjs(formDate).day() === i
		}));
		weeks = weeks.map((week) => ({
			...week,
			enabled: Math.floor(dayjs(formDate).date() / 7) === week.ordinal - 1
		}));
		tick().then(() => weekdays = weekdays);
	}
	$: if (inputFrequency === 'monthly' && !useMonthlyDay) {
		// wrap this in a function to make weekdays and week not reactive
		updateMonthlyTimer()
	}

	interface CalendarWeekday {
		name: string;
		enabled: boolean;
		binding: Weekday;
	}

	let weekdays: CalendarWeekday[] = [
		{
			name: 'Sunday',
			enabled: false,
			binding: RRule.SU
		},
		{
			name: 'Monday',
			enabled: false,
			binding: RRule.MO,
		},
		{
			name: 'Tuesday',
			enabled: false,
			binding: RRule.TU
		},
		{
			name: 'Wednesday',
			enabled: false,
			binding: RRule.WE
		},
		{
			name: 'Thursday',
			enabled: false,
			binding: RRule.TH
		},
		{
			name: 'Friday',
			enabled: false,
			binding: RRule.FR
		},
		{
			name: 'Saturday',
			enabled: false,
			binding: RRule.SA
		}
	];

	$: enabledWeekdays = weekdays
		.filter((weekday) => weekday.enabled)
		.map((weekday) => weekday.binding);

	onMount(() => {
		timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	});
</script>

<div class="wrap">
	<div class="top">
		<div class="info">
			<button on:click={() => (day = day.subtract(1, 'month'))}>
				<img alt="previous" src="/icons/chevronLeft.svg" />
			</button>
			<h1>{day.format('MMMM YYYY')}</h1>
			<button on:click={() => (day = day.add(1, 'month'))}>
				<img alt="next" src="/icons/chevronRight.svg" />
			</button>
		</div>
		<div class="rightButtonWrap">
			<div class="button">
				<Button value="Today" on:click={() => (day = dayjs())} />
			</div>
			<div class="button">
				<Button
					value="Add Event"
					on:click={() => {
						pushState('', { showingModal: 'addEventModal' });
					}}
				/>
			</div>
		</div>
	</div>
	<div class="calendar">
		{#each calendarDays as loopDay (loopDay.toDate())}
			{@const inMonth = day.month() === loopDay.month()}
			<button
				class="day"
				class:hasEvent={flattenedDaysActive.some(datesOnSameDay(loopDay))}
				class:inMonth
				on:click={() => {
					selectedDay = loopDay;
					pushState('', { showingModal: 'dayModal' });
				}}
			>
				{loopDay.format('D')}
			</button>
		{/each}
	</div>
</div>

{#if $page.state.showingModal === 'dayModal'}
	<Modal on:close={() => history.back()}>
		{#if selectedDay !== null}
			<!-- Assure typescript that our selectedDay will remain the same in filter -->
			{@const selectedDayLocal = selectedDay}

			<h1>{selectedDay.format('MMMM D, YYYY')}</h1>
			{@const eventsOnThisDay = daysActive.filter(([, days]) =>
				days.some(datesOnSameDay(selectedDayLocal))
			)}
			{#if eventsOnThisDay.length === 0}
				<p>No events today.</p>
			{:else}
				{#each eventsOnThisDay as [event, days]}
					<div class="event">
						<h2>{event.title}</h2>
						<p class="subDescription">At {days[0].format('h:mm A')}</p>
						<p>{event.description}</p>
					</div>
				{/each}
			{/if}
		{/if}
	</Modal>
{/if}

{#if $page.state.showingModal === 'addEventModal'}
	<Modal on:close={() => history.back()}>
		<form method="POST">
			<h1>Add Event</h1>
			<div class="formBody">
				<div class="formBodyChild">
					<div class="input"><Input name="title" bg="white" label="Title" required /></div>
					<div class="input"><Input name="description" bg="white" label="Description" /></div>
					<input name="date" type="hidden" value={calculatedFormDate} />
					<div class="input">
						<Input
							bg="white"
							label={repeats ? 'Starts On' : 'Event Date'}
							required
							type="date"
							bind:value={formDate}
						/>
					</div>
					<div class="input no-bottom-margin">
						<Input
							bg="white"
							disabled={allDay}
							label="Start Time"
							required
							type="time"
							bind:value={formTime}
						/>
					</div>
					<div class="input checkbox no-top-margin">
						<p>All Day?</p>
						<Checkbox bind:checked={allDay} />
					</div>
					<div class="input">
						<Select
							id="timezone"
							name="timezone"
							--background="white"
							label="Event Timezone"
							bind:value={timeZone}
						>
							{#each timezones as timezone}
								<option value={timezone.tzCode}>{timezone.name}</option>
							{/each}
						</Select>
					</div>

					<hr />

					<div class="input checkbox">
						Repeats?
						<Checkbox bind:checked={repeats} />
					</div>
				</div>

				{#if repeats}
					<div class="formBodyChild">
						<!-- TODO: custom number input -->
						<div class="input no-top-margin">
							<div class="input">
								<Select
									id="repeat"
									name="repeat"
									--background="white"
									label="Repeats Every"
									bind:value={inputFrequency}
								>
									<option value="daily">Days</option>
									<option value="weekly">Weeks</option>
									<option value="monthly">Months</option>
									<option value="yearly">Years</option>
								</Select>
							</div>
							<div class="input">
								<Input
									name="repeatEvery"
									bg="white"
									label="Count"
									type="number"
									bind:value={interval}
								/>
							</div>
						</div>
						<!-- 
							we skip daily; we don't care about every n hour;
							this isn't a cron job
						-->
						{#if inputFrequency === 'monthly'}
							<p>Specific Day <Checkbox name="monthlyDay" bind:checked={useMonthlyDay} /></p>
							{#if useMonthlyDay}
								<p>On the <input name="monthlyDay" type="number" min="1" max="31" bind:value={dayOfTheMonth}/> day of the month.</p>
							{:else}
								<!-- TODO: svelte 5 snippets -->
								{#each weekdays as weekday}
									<div class="weekdayInput">
										<Checkbox name="weekday" bind:checked={weekday.enabled} />
										<label for={weekday.name}>{weekday.name}</label>
									</div>
								{/each}
								<p>On the</p>
								{#each weeks as week}
									<div class="weekdayInput">
										<Checkbox name="week" bind:checked={week.enabled} />
										<label for={week.name}>{week.name}</label>
									</div>
								{/each}
							{/if}
						{:else if inputFrequency !== 'daily'}
							{#each weekdays as weekday}
								<div class="weekdayInput">
									<Checkbox name="weekday" bind:checked={weekday.enabled} />
									<label for={weekday.name}>{weekday.name}</label>
								</div>
							{/each}
						{/if}
						<div class="input">
							<div class="input">
								<Select
									id="repeatType"
									name="repeatType"
									--background="white"
									label="Repeat Type"
									bind:value={repeatType}
								>
									<option value="amount">Amount</option>
									<option value="upTo">Up To</option>
									<option value="indefinetly">Indefinetly</option>
								</Select>
							</div>
							{#if repeatType == 'amount'}
								<div class="input">
									<Input
										name="repeatEvery"
										bg="white"
										label="Amount of times"
										type="number"
										bind:value={count}
									/>
								</div>
							{:else if repeatType == 'upTo'}
								<div class="input">
									<Input name="upTo" bg="white" label="End Date" type="date" bind:value={upTo} />
								</div>
							{/if}
						</div>
						{#if enabledWeekdays.length > 0}
							<p>Occurs {rrule.toText()} starting on {formDate}.</p>
						{:else if inputFrequency === 'daily'}
							<p>Occurs {rrule.toText()}.</p>
						{:else if inputFrequency === 'weekly'}
							<p>Occurs {rrule.toText()} on {dayjs(formDate).format('dddd')}.</p>
						{:else if inputFrequency === 'monthly'}
							<p>Occurs {rrule.toText()}.</p>
						{:else if inputFrequency === 'yearly'}
							<p>Occurs {rrule.toText()} on {dayjs(formDate).format('MMMM Do')}.</p>
						{/if}
					</div>
				{/if}
			</div>

			<div class="submitButton">
				<Button type="submit" value="Add Event" />
			</div>
		</form>
	</Modal>
{/if}

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}
	.formBody {
		display: flex;
		gap: 1rem;

		.formBodyChild {
			width: 100%;
		}
	}

	.button {
		width: 25%;
	}

	.top {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.rightButtonWrap {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100%;
			justify-content: end;

			.button {
				padding-left: 20px;
			}
		}
	}

	.info {
		display: flex;
		justify-content: center;
		align-items: center;
		width: calc(100% - 2rem);
		box-sizing: border-box;
		margin: 10px 0px;
		height: 50px;

		h1 {
			position: relative;
			display: block;
			margin: 0px;
		}

		button {
			all: unset;
			cursor: pointer;
			height: 100%;
			aspect-ratio: 1/1;
			padding: 5px;
			box-sizing: border-box;
			border-radius: 50%;
			margin: 0px 10px;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

			&:hover {
				background: var(--accent50);
			}

			img {
				height: 100%;
				aspect-ratio: 1/1;
			}
		}
	}

	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(5, 1fr);
		grid-gap: 1rem;
		width: calc(100% - 2rem);
		height: calc(100% - 2rem - (3rem + 2rem));
	}

	.weekdayInput {
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: row;
	}

	.event {
		box-sizing: border-box;
		text-align: left;
		padding: 1rem;
		margin: 2rem;
		width: 100%;
		height: 100%;
		background-color: #ddd;
		border: 0;
		border-radius: 0.5rem;

		.subDescription {
			color: var(--textLow);
			margin-top: 0;
		}

		h2 {
			margin-bottom: 0;
		}
	}

	.day {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		margin: 1rem;
		background-color: #fff;
		border: 0;
		cursor: pointer;

		&.hasEvent {
			background-color: #ffabab;
		}

		&:not(.inMonth) {
			background-color: #ddd;
		}

		&:hover {
			background-color: var(--accent);
			color: #fff;
		}
	}

	.input {
		margin: 1rem 0;
		gap: 0.5rem;
		width: 100%;
		display: flex;
		flex-direction: row;
		height: min-content;

		&.checkbox {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.submitButton {
		margin-top: 2rem;
		width: 100%;
	}

	.no-top-margin {
		margin-top: 0;
	}

	.no-bottom-margin {
		margin-bottom: 0;
	}
</style>
