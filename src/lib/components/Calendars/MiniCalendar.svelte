<script lang="ts">
	import dayjs from 'dayjs';
	import { cubicInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import ChevronLeft from '~icons/bx/chevron-left';
	import ChevronRight from '~icons/bx/chevron-right';
	import { clickOutside } from '$lib/actions/clickOutside';

	import Button from '../Button.svelte';
	import IconButton from '../IconButton.svelte';
	import { createActiveDays } from './createActiveDays';
	import { createCalendarDays } from './createCalendarDays';
	import { datesOnSameDay } from './dayOnSameDay';
	import type { EventLike } from './util';

	export let events: EventLike[];

	type TodaysEvents = {
		rawEvent: EventLike;
		days: dayjs.Dayjs[];
	}[];

	let selectedEvent: EventLike | undefined = undefined;
	let todaysEvents: TodaysEvents | undefined = undefined;
	let todaysEventsSelectorCurrent = 0;

	let calDays = createCalendarDays();
	$: activeDays = createActiveDays(calDays.loopDay, events);

	const setActiveEvent = (event: EventLike, eventsToday: TodaysEvents) => {
		todaysEventsSelectorCurrent = 0;
		todaysEvents = eventsToday;
		selectedEvent = event;
	};

	const cycleEventSelector = (count: number) => {
		todaysEventsSelectorCurrent += count;
		if (todaysEvents) {
			selectedEvent = todaysEvents[todaysEventsSelectorCurrent].rawEvent;
		}
	};
</script>

<input name="eventId" hidden value={selectedEvent?.id} />

<div class="cal">
	<div class="toolbar">
		<div class="navigate">
			<IconButton
				type="button"
				on:click={() => {
					calDays = createCalendarDays(calDays.loopDay.add(-1, 'month'));
				}}
			>
				<ChevronLeft />
			</IconButton>
		</div>
		<p>
			{calDays.loopDay.format('MMM YYYY')}
		</p>
		<div class="navigate">
			<IconButton
				type="button"
				on:click={() => {
					calDays = createCalendarDays(calDays.loopDay.add(1, 'month'));
				}}
			>
				<ChevronRight />
			</IconButton>
		</div>
	</div>
	<div class="days">
		{#each calDays.days as day}
			{@const hasEvent = activeDays.flattenedDaysActive.some(datesOnSameDay(day.day))}
			{@const eventsToday = activeDays.unFlatDays.filter((activeEventDay) =>
				activeEventDay.days.some(datesOnSameDay(day.day))
			)}
			{#if hasEvent}
				<button
					class="day hasEvent"
					class:inactive={!day.inMonth}
					type="button"
					on:click={() => {
						setActiveEvent(eventsToday[0].rawEvent, eventsToday);
					}}
				>
					{day.day.format('DD')}
				</button>
			{:else}
				<div class="day" class:inactive={!day.inMonth}>
					{day.day.format('DD')}
				</div>
			{/if}
		{/each}
	</div>
	{#if selectedEvent}
		<div
			class="eventPicker"
			use:clickOutside={() => {
				selectedEvent = undefined;
			}}
			transition:fly={{
				duration: 100,
				delay: 0,
				easing: cubicInOut,
				x: 0,
				y: 25
			}}
		>
			<div class="title">
				<IconButton
					disabled={todaysEventsSelectorCurrent < 1}
					type="button"
					on:click={() => {
						cycleEventSelector(-1);
					}}
				>
					<ChevronLeft />
				</IconButton>
				<p>{selectedEvent.title}</p>
				<IconButton
					disabled={!todaysEvents || todaysEvents.length < todaysEventsSelectorCurrent + 2}
					type="button"
					on:click={() => {
						cycleEventSelector(1);
					}}
				>
					<ChevronRight />
				</IconButton>
			</div>
			<div class="description">
				{selectedEvent.description}
			</div>
			<div class="useEventWrap">
				<Button value="Use Event" />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.cal {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.toolbar {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		p {
			margin: 0px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-grow: 1;
		}

		.navigate {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.days {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;

		.day {
			all: unset;
			cursor: pointer;
			width: 100%;
			height: 100%;
			aspect-ratio: 1/1;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

			&.inactive {
				opacity: 0.5;
			}

			&.hasEvent {
				background: var(--accent50);

				&:hover {
					background: var(--accent);
				}
			}

			&:not(.hasEvent):hover {
				background: rgba(0, 0, 0, 0.15);
				transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
			}
		}
	}

	.eventPicker {
		position: absolute;
		bottom: 0px;
		right: 0px;
		width: 100%;
		height: 80%;
		box-shadow: 0px -2px 0px 2px rgba(0, 0, 0, 0.05);
		border-radius: 1rem 1rem 0 0;
		background: var(--bgPure);
		backdrop-filter: blur(3px);
		display: flex;
		flex-direction: column;
		padding: 0.25rem;
		box-sizing: border-box;

		.title {
			width: 100%;
			padding: 0px 0.25rem;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;

			p {
				flex-grow: 1;
				margin: 0px;
			}
		}

		.description {
			flex-grow: 1;
			height: 100%;
		}
	}

	.useEventWrap {
		margin-top: auto;
		padding: 0px 0.5rem;
	}
</style>
