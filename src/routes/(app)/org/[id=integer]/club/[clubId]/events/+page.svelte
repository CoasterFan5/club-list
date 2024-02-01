<script lang="ts">
	import dayjs from 'dayjs';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import dayOfYear from 'dayjs/plugin/dayOfYear';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';

	import { page } from '$app/stores';
	import Calendar from '$lib/components/Calendar.svelte';

	import AddEvent from './AddEvent.svelte';

	export let data;

	dayjs.extend(dayOfYear);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(advancedFormat);

	let selectedDay: dayjs.Dayjs = dayjs();

	let formDate: string = '';
	$: formDate = dayjs(selectedDay).format('YYYY-MM-DD');
</script>

<div class="wrap">
	<Calendar allowAddEvent={true} events={data.events} bind:selectedDay />
</div>

{#if $page.state.showingModal === 'addEventModal'}
	<AddEvent {formDate} />
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
</style>
