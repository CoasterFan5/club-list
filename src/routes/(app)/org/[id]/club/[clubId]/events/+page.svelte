<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/modules/Modal.svelte';
	import dayjs from 'dayjs';
	import { RRule } from './rrule.js';
	import dayOfYear from 'dayjs/plugin/dayOfYear';
	import utc from 'dayjs/plugin/utc';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	dayjs.extend(dayOfYear);
	dayjs.extend(utc);

	const datesOnSameDay = (date1: dayjs.Dayjs) => (date2: dayjs.Dayjs) =>
		date1.dayOfYear() === date2.dayOfYear() && date1.year() === date2.year();

	$: daysActive = data.events.map(
		(event) => [event, RRule.fromString(event.date).all().map(dayjs)] as const
	);

	$: flattenedDaysActive = daysActive.flatMap(([, days]) => days);
	console.log(data.events);

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
</script>

<div class="wrap">
	<div class="info">
		<h1>{day.format('MMMM YYYY')}</h1>
	</div>

	<div class="button big">
		<Button value="Add Event" on:click={() => {
			pushState('', { showingModal: 'addEventModal' });
		}} />
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

{#if $page.state.showingModal === "dayModal"}
	<Modal on:close={() => history.back()}>
		{#if selectedDay !== null}
			<!-- Assure typescript that our selectedDay will remain the same in filter -->
			{@const selectedDayLocal = selectedDay}

			<h1>{selectedDay.format('MMMM D, YYYY')}</h1>
			{#each daysActive.filter( ([, days]) => days.some(datesOnSameDay(selectedDayLocal)) ) as [event, days]}
				<div class="event">
					<h2>{event.title}</h2>
					<p class="subDescription">At {days[0].format('h:mm A')}</p>
					<p>{event.description}</p>
				</div>
			{/each}
		{/if}
	</Modal>
{/if}

{#if $page.state.showingModal === "addEventModal"}
	<Modal on:close={() => history.back()}>
		<form method="POST">
			<h1>Add Event</h1>

			<div class="input"><Input name="title" bg="white" label="Event Title" required /></div>
			<div class="input"><Input name="description" bg="white" label="Event Description" /></div>
			<input name="date" type="hidden" value={calculatedFormDate} />
			<div class="input">
				<Input bg="white" label="Event Date" required type="date" bind:value={formDate} />
			</div>
			<div class="input">
				<Input bg="white" label="Event Time" required type="time" bind:value={formTime} />
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
		width: 100%;
	}

	.submitButton {
		margin-top: 2rem;
		width: 100%;
	}
</style>
