<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import ModalHelper from '$lib/modules/ModalHelper.svelte';
	import dayjs from 'dayjs';
	import { RRule } from './rrule.js';
	import type { PageData } from './$types';
	import dayOfYear from 'dayjs/plugin/dayOfYear';

	export let data: PageData;

	dayjs.extend(dayOfYear);

	const datesOnSameDay = (date1: dayjs.Dayjs) => (date2: dayjs.Dayjs) =>
		date1.dayOfYear() === date2.dayOfYear() && date1.year() === date2.year();

	$: daysActive = data.events.map(event => RRule.fromString(event.date).all()).flat().map(day => dayjs(day))

	let day = dayjs();

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

	let showEventModal = false;
</script>

<div class="wrap">
	<div class="info">
		<h1>{day.format('MMMM YYYY')}</h1>
	</div>

	<div class="button big">
		<Button value="Add Event" on:click={() => (showEventModal = true)} />
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
		{#each calendarDays as loopDay}
			{@const inMonth = day.month() === loopDay.month()}
			<button class="day" class:inMonth class:hasEvent={daysActive.some(datesOnSameDay(loopDay))}>
				{loopDay.format('D')}
			</button>
		{/each}
	</div>
</div>

<ModalHelper bind:showing={showEventModal}>
	<form method="POST">
		<h1>Add Event</h1>

		<div class="input"><Input name="title" label="Event Title" required /></div>
		<div class="input"><Input name="description" label="Event Description" /></div>
		<div class="input"><Input name="date" label="Event Date" required type="date" /></div>

		<div class="submitButton">
			<Button type="submit" value="Add Event" />
		</div>
	</form>
</ModalHelper>

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
		margin: 0.5rem 0;
		width: 100%;
	}

	.submitButton {
		margin-top: 1rem;
		width: 100%;
	}
</style>
