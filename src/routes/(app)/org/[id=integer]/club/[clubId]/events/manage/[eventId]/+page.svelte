<script lang="ts">
	import dayjs from 'dayjs';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import dayOfYear from 'dayjs/plugin/dayOfYear';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';
	import type { Frequency, Weekday } from 'rrule';
	import { onMount, tick } from 'svelte';
	import timezones from 'timezones-list';

	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Select from '$lib/components/Select.svelte';
	import { RRule } from '$lib/utils/rrule.js';

	export let data;

	function ordinal(number: number) {
		switch (number) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	}

	const freqMapping: Record<string, Frequency> = {
		daily: RRule.DAILY,
		weekly: RRule.WEEKLY,
		monthly: RRule.MONTHLY,
		yearly: RRule.YEARLY
	};

	dayjs.extend(dayOfYear);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(advancedFormat);

	const safeNumber = (num: string): number | null => {
		const parsed = parseInt(num);
		return isNaN(parsed) ? null : parsed;
	};

	export let formDate = dayjs().format('YYYY-MM-DD');
	let formTime = dayjs().format('HH:mm');

	$: calculatedFormDate = dayjs(formDate)
		.set('hour', safeNumber(formTime.split(':')[0]) || 0)
		.set('minute', safeNumber(formTime.split(':')[1]) || 0)
		.utc()
		.format();

	const emptyArray = (length: number) => Array(length).fill(0);

	let repeats = false;
	let allDay = false;
	let repeatType = 'indefinitely';

	let interval = '1';
	$: parsedInterval = parseInt(interval);

	let timeZone = 'America/Los_Angeles';

	let count = '1';
	$: parsedCount = parseInt(count);

	let inputFrequency = 'weekly';
	$: derivedFrequency = freqMapping[inputFrequency];

	let upTo = new Date().toISOString().split('T')[0];
	let useMonthlyDay = false;
	let dayOfTheMonth = 0;

	let weeksFront = emptyArray(5)
		.map((_, i) => i + 1)
		.map((week) => ({
			name: `${week}${ordinal(week)}`,
			ordinal: week,
			enabled: false
		}));
	let weeksBack = emptyArray(4)
		.map((_, i) => i + 1)
		.map((week) => ({
			name: `${week}${ordinal(week)} to last`,
			ordinal: -week,
			enabled: false
		}));

	$: weeks = [...weeksFront, ...weeksBack];

	$: enabledWeeks = weeks.filter((week) => week.enabled).map((week) => week.ordinal);
	$: rrule = new RRule({
		freq: derivedFrequency,
		interval: parsedInterval,
		dtstart: new Date(formDate),
		wkst: RRule.SU,
		count: repeatType === 'amount' ? parsedCount : undefined,
		until: repeatType === 'upTo' && upTo ? new Date(upTo) : undefined,
		bymonthday: inputFrequency === 'monthly' && useMonthlyDay ? dayOfTheMonth : undefined,
		byweekday:
			enabledWeekdays.length > 0 && inputFrequency !== 'daily'
				? inputFrequency === 'monthly' && !useMonthlyDay
					? enabledWeekdays.flatMap((weekday) => {
							if (enabledWeeks.length === 0) return [weekday];
							return enabledWeeks.map((week) => weekday.nth(week));
						})
					: !useMonthlyDay
						? enabledWeekdays
						: undefined
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
		tick().then(() => {
			weekdays = weekdays;
			weeks = weeks;
		});
	}
	$: if (inputFrequency === 'monthly' && !useMonthlyDay) {
		// Wrap this in a function to make weekdays and week not reactive
		updateMonthlyTimer();
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
		}
	];

	$: enabledWeekdays = weekdays
		.filter((weekday) => weekday.enabled)
		.map((weekday) => weekday.binding);

	onMount(() => {
		timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	});
</script>

<form method="POST" use:enhance>
	<h1>Add Event</h1>
	<div class="formBody">
		<div class="formBodyChild">
			<div class="input">
				<Input name="title" label="Title" required value={data.event.title} />
			</div>
			<div class="input">
				<Input name="description" label="Description" value={data.event.description || ''} />
			</div>
			<input name="date" type="hidden" value={calculatedFormDate} />
			<div class="input">
				<Input
					name={null}
					label={repeats ? 'Starts On' : 'Event Date'}
					required
					type="date"
					bind:value={formDate}
				/>
			</div>
			<div class="input no-bottom-margin">
				<Input
					name={null}
					disabled={allDay}
					label="Start Time"
					required
					type="time"
					bind:value={formTime}
				/>
			</div>
			<div class="input checkbox no-top-margin">
				<p>All Day?</p>
				<Checkbox name="allDay" bind:checked={allDay} />
			</div>
			<div class="input">
				<Select
					id="timezone"
					name={null}
					--background="white"
					label="Event Timezone"
					bind:value={timeZone}
				>
					{#each timezones as timezone}
						<option value={timezone.tzCode}>{timezone.label.replaceAll('_', ' ')}</option>
					{/each}
				</Select>
			</div>

			<hr />

			<div class="input checkbox">
				Repeats?
				<Checkbox name={null} bind:checked={repeats} />
			</div>
		</div>

		{#if repeats}
			<div class="formBodyChild">
				<!-- TODO: custom number input -->
				<div class="input no-top-margin">
					<div class="input">
						<Select
							id="repeat"
							name="inputFrequency"
							--background="white"
							label="Repeats Every"
							bind:value={inputFrequency}
						>
							<option value="daily">Day</option>
							<option value="weekly">Week</option>
							<option value="monthly">Month</option>
							<option value="yearly">Year</option>
						</Select>
					</div>
					<div class="input">
						<Input name="repeatInterval" label="Count" type="number" bind:value={interval} />
					</div>
				</div>
				<!-- 
					we skip daily; we don't care about every n hour;
					this isn't a cron job
				-->
				{#if inputFrequency === 'monthly'}
					<p>Specific Day <Checkbox name="monthlyDay" bind:checked={useMonthlyDay} /></p>
					{#if useMonthlyDay}
						<p>
							On the <input
								name="dayOfTheMonth"
								max="31"
								min="1"
								type="number"
								bind:value={dayOfTheMonth}
							/> day of the month.
						</p>
					{:else}
						<!-- TODO: svelte 5 snippets -->
						{#each weekdays as weekday}
							<div class="weekdayInput">
								<Checkbox name="weekday{weekday.name}" bind:checked={weekday.enabled} />
								<label for={weekday.name}>{weekday.name}</label>
							</div>
						{/each}
						<p>On the</p>
						<div class="weeksContainer">
							<div class="weeks">
								{#each weeksFront as week}
									<div class="weekdayInput">
										<Checkbox
											name="week{week.name.replace('-', '_')}"
											bind:checked={week.enabled}
										/>
										<label for={week.name}>{week.name}</label>
									</div>
								{/each}
							</div>
							<div class="weeks">
								{#each weeksBack as week}
									<div class="weekdayInput">
										<Checkbox
											name="week{week.name.replace('-', '_')}"
											bind:checked={week.enabled}
										/>
										<label for={week.name}>{week.name}</label>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				{:else if inputFrequency !== 'daily'}
					{#each weekdays as weekday}
						<div class="weekdayInput">
							<Checkbox name="weekday{weekday.name}" bind:checked={weekday.enabled} />
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
							<option value="indefinitely">Indefinetly</option>
						</Select>
					</div>
					{#if repeatType == 'amount'}
						<div class="input">
							<Input name="repeatEvery" label="Amount of times" type="number" bind:value={count} />
						</div>
					{:else if repeatType == 'upTo'}
						<div class="input">
							<input name="repeatUpTo" type="hidden" value={dayjs(upTo).utc().format()} />
							<Input name={null} label="End Date" type="date" bind:value={upTo} />
						</div>
					{/if}
				</div>
				{#if enabledWeekdays.length > 0}
					<p>Occurs {rrule.toText()} starting on {formDate}.</p>
				{:else if inputFrequency === 'daily'}
					<p>Occurs {rrule.toText()} starting on {formDate}.</p>
				{:else if inputFrequency === 'weekly'}
					<p>
						Occurs {rrule.toText()} on {dayjs(formDate).format('dddd')} starting on {formDate}.
					</p>
				{:else if inputFrequency === 'monthly'}
					<p>Occurs {rrule.toText()} starting on {formDate}.</p>
				{:else if inputFrequency === 'yearly'}
					<p>
						Occurs {rrule.toText()} on {dayjs(formDate).format('MMMM Do')} starting on {formDate}.
					</p>
				{/if}
			</div>
		{/if}
	</div>

	<div class="submitButton">
		<Button type="submit" value="Save" />
	</div>
</form>

<style lang="scss">
	form {
		padding-bottom: 1rem;
	}

	.formBody {
		display: flex;
		gap: 1rem;

		.formBodyChild {
			width: 100%;
		}
	}

	.weekdayInput {
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: row;
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

	.weeksContainer {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
</style>
