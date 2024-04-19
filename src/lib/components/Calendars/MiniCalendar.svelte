<script lang="ts">
	import dayjs from 'dayjs';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import dayOfYear from 'dayjs/plugin/dayOfYear';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';
	import { createCalendarDays } from './createCalendarDays';

	import ChevronLeft from "~icons/bx/chevron-left"
	import ChevronRight from "~icons/bx/chevron-right"
	import IconButton from '../IconButton.svelte';
	import type { EventLike } from './util';
	import { createActiveDays } from './createActiveDays';
	import { datesOnSameDay } from './dayOnSameDay';



	export let events: EventLike[];


	
	let calDays = createCalendarDays()
	$: activeDays = createActiveDays(calDays.loopDay, events)
</script>

<div class="cal">
	<div class="toolbar">
		<p>
			{calDays.loopDay.format("MMM YYYY")}
		</p>
		<div class="navigate">
			<IconButton type="button" on:click={() => {
				calDays = createCalendarDays(calDays.loopDay.add(-1, "month"))
			}}>
				<ChevronLeft/>
			</IconButton>
			<IconButton type="button" on:click={
				() => {
					calDays = createCalendarDays(calDays.loopDay.add(1, "month"))
				}
			}>
				<ChevronRight/>
			</IconButton>
		</div>
	</div>
	<div class="days">
		{#each calDays.days as day}
			<div class="day" class:hasEvent={activeDays.some(datesOnSameDay(day.day))} class:inactive={!day.inMonth}>
				{day.day.format("DD")}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.cal {
		width: 100%;
	}

	.toolbar {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		p {
			margin: 0px;
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
			}

			&:not(.hasEvent):hover {
				background: rgba(0, 0, 0, 0.15);
				transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
			}

			
		}
	}
</style>