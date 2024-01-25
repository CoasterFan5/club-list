<script lang="ts">
	import dayjs from 'dayjs';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import dayOfYear from 'dayjs/plugin/dayOfYear';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';

	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';

	import AddEvent from './AddEvent.svelte';
	import { RRule } from './rrule.js';

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

	let formDate: string = ""
	$: formDate = dayjs(selectedDay).format('YYYY-MM-DD')
	
</script>

<div class="wrap">
	<div class="top">
		<div class="info">
			<div class="arrowWrap">
				<button on:click={() => (day = day.subtract(1, 'month'))}>
					<img alt="previous" src="/icons/chevronLeft.svg" />
				</button>
				<button on:click={() => (day = day.add(1, 'month'))}>
					<img alt="next" src="/icons/chevronRight.svg" />
				</button>
			</div>
			<h1>{day.format('MMMM YYYY')}</h1>
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

{#if $page.state.showingModal === 'addEventModal'}
	<AddEvent formDate={formDate}/>
{/if}

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

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.button {
		width: 25%;
	}

	.top {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

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
		justify-content: space-between;
		align-items: center;
		width: calc(100% - 2rem);
		box-sizing: border-box;
		margin: 10px 0px;
		height: 50px;

		.arrowWrap {
			height: 50px;
		}

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
		width: 100%;
		display: grid;
		gap: 3px;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(5, 1fr);
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
		align-items: start;
		padding: 10px;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		aspect-ratio: 2/1;
		background-color: #fff;
		border: 0;
		
		cursor: pointer;

		&.hasEvent {
			background-color: #ffabab;
		}

		&:not(.inMonth) {
			background-color: #ddd;
			opacity: 0.25;
		}

		&:hover {
			background-color: var(--accent);
			color: #fff;
		}
	}
</style>
