<script lang="ts">
	import dayjs from 'dayjs';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import dayOfYear from 'dayjs/plugin/dayOfYear';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';

	import Calendar from '$lib/components/Calendar.svelte';

	export let data;

	dayjs.extend(dayOfYear);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(advancedFormat);
</script>

<div class="wrap">
	<Calendar 
		allowAddEvent={true}
		events={data.events}
		orgId={data.org.id.toString()}
		clubId={data.club.id.toString()}
	/>
</div>

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
