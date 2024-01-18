<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/modules/Modal.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import dayjs from 'dayjs';
	import { RRule } from './rrule.js';
	import type { Frequency, Weekday } from 'rrule';
	import dayOfYear from 'dayjs/plugin/dayOfYear';
	import utc from 'dayjs/plugin/utc';
	import timezone from 'dayjs/plugin/timezone';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import timezones from 'timezones-list';
	import Select from '$lib/components/Select.svelte';
	import { onMount } from 'svelte';

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
	let repeatType = 'amount';
	let interval = '1';
	let timeZone = 'America/Los_Angeles';
	$: parsedInterval = parseInt(interval);
	let count = '1';
	$: parsedCount = parseInt(count);
	let inputFrequency = 'daily';
	$: derivedFrequency = freqMapping[inputFrequency];
	let upTo = new Date().toISOString().split('T')[0];
	$: rrule = new RRule({
		freq: derivedFrequency,
		interval: parsedInterval,
		dtstart: new Date(formDate),
		...(repeatType === 'amount'
			? {
					count: parsedCount
				}
			: {}),
		...(repeatType === 'upTo' && upTo
			? {
					until: new Date(upTo)
				}
			: {}),
		...(enabledWeekdays.length > 0 && inputFrequency !== 'daily'
			? {
					byweekday: enabledWeekdays
				}
			: {})
	});

	interface CalendarWeekday {
		name: string;
		enabled: boolean;
		binding: Weekday;
	}

	const weekdays: CalendarWeekday[] = [
		{
			name: 'Monday',
			enabled: false,
			binding: RRule.MO
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
		},
		{
			name: 'Sunday',
			enabled: false,
			binding: RRule.SU
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
	<div class="info">
		<h1>{day.format('MMMM YYYY')}</h1>
	</div>

	<div class="button big">
		<Button
			value="Add Event"
			on:click={() => {
				pushState('', { showingModal: 'addEventModal' });
			}}
		/>
	</div>

	<div class="dateBar">
		<div class="button">
			<Button value="Previous" on:click={() => (day = day.subtract(1, 'month'))} />
		</div>
		<div class="button">
			<Button value="Today" on:click={() => (day = dayjs())} />
		</div>
		<div class="button">
			<Button value="Next" on:click={() => (day = day.add(1, 'month'))} />
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
						{#if inputFrequency !== 'daily'}
							{#each weekdays as weekday}
								<div class="weekdayInput">
									<Checkbox name="weekday" bind:checked={weekday.enabled} />
									<label for={weekday.name}>{weekday.name}</label>
								</div>
							{/each}
						{/if}

						{#if inputFrequency === 'monthly'}
							<p>monthly</p>
						{:else if inputFrequency === 'yearly'}
							<p>yearly</p>
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
						<p>Occurs {rrule.toText()}.</p>
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
	.dateBar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: calc(100% - 2rem);
		height: 3rem;
		margin: 1rem;
	}

	.info {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: calc(100% - 2rem);
		height: 2rem;
		margin: 1rem;
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

	.button {
		width: 25%;

		&.big {
			width: 40%;
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
