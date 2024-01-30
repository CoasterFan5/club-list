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
		(event) =>
			[
				event,
				RRule.fromString(event.date)
					.between(
						day.date(1).utc().subtract(1, 'week').toDate(),
						day.date(day.daysInMonth()).utc().add(1, 'week').toDate()
					)
					.map(dayjs)
			] as const
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

	let formDate: string = '';
	$: formDate = dayjs(selectedDay).format('YYYY-MM-DD');
</script>

<div class="wrap">
	<div class="top">
		<div class="info">
			<div class="button">
				<Button value="Today" on:click={() => (day = dayjs())} />
			</div>
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
	</div>
	<div class="calendar">
		{#each calendarDays as loopDay (loopDay.toDate())}
			{@const inMonth = day.month() === loopDay.month()}
			{@const eventsOnThisDay = daysActive.filter(([, days]) => days.some(datesOnSameDay(loopDay)))}
			<div class="dayWrap">
				<button
					class="day"
					class:hasEvent={flattenedDaysActive.some(datesOnSameDay(loopDay))}
					class:inMonth
					on:click={() => {
						selectedDay = loopDay;
						pushState('', { showingModal: 'dayModal' });
					}}
				>
				<p>{loopDay.format('D')}</p>

				{#if eventsOnThisDay.length > 0}
					{@const event = eventsOnThisDay[0]}
					<div class="inDisplayEvent">
						{event[0].title}
					</div>
					{#if eventsOnThisDay.length > 1}
					<div class="extraEvents">
						+{eventsOnThisDay.length - 1} more
					</div>
						

						
					{/if}
				{/if}
			</button>
			</div>
			
		{/each}
	</div>
</div>

{#if $page.state.showingModal === 'addEventModal'}
	<AddEvent {formDate} />
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

			<Button
				value="Add Event"
				on:click={() => {
					pushState('', { showingModal: 'addEventModal' });
				}}
			/>
		{/if}
	</Modal>
{/if}

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		max-width: 100%;
	}

	.button {
		width: 25%;
	}

	.top {
		width: 100%;
		max-width: 100%;
		padding: 0px 20px;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		justify-content: space-between;
	}

	.info {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		margin: 10px 0px;
		height: 50px;

		.arrowWrap {
			height: 50px;
			flex-grow: 1;
			width: 100px;
			display: flex;
			align-items: center;
		}

		h1 {
			position: relative;
			display: block;
			margin: 0px;
			width: 100%;
		}

		button {
			all: unset;
			cursor: pointer;
			height: 75%;
			aspect-ratio: 1/1;
			box-sizing: border-box;
			border-radius: 50%;
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

	.inDisplayEvent {
		width: 100%;
		background: var(--accent50);
		padding: 5px;
		box-sizing: border-box;
		border-radius: 3px;
		margin-bottom: 5px;
		overflow: hidden;
	}

	.calendar {
		
		width: 100vw;
		max-width: 100%;
		padding: 10px;
		max-height: 100%;
		gap: 0px;
		margin-top: 25px;
		
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(5, 1fr);
		box-sizing: border-box;
		
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

	.dayWrap {
		box-sizing: border-box;
		background: var(--background);
		aspect-ratio: 3/2;
		
		
		
		
	}

	.day {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		box-sizing: border-box;
		flex-grow: 1;
		height: calc(98%);
		width: calc(98%);
		color: var(--textDark);
		
		
		background-color: #fff;
		border: 0;
		
		cursor: pointer;

		p {
			margin: 5px;
			padding: 3px;
			box-sizing: border-box;
			height: 20px;
			width: 20px;
			border-radius: 50%;
			aspect-ratio: 1/1;
		}
		

		&.hasEvent {
			p {
				background: var(--accent50);
			}
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

	@media screen and (max-width: 500px) {
			.inDisplayEvent {
				display: none !important;
			}
			.day {
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.button {
				display: none;
			}

			.extraEvents {
				display: none;
			}
		}
</style>
