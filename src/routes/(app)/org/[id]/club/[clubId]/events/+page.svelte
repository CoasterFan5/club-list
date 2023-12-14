<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import dayjs from 'dayjs';

	let day = dayjs();

	$: daysInMonth = Array(day.daysInMonth())
		.fill(0)
		.map((_, i) => dayjs().date(i + 1));

	export let data: PageData;
</script>

<div class="info">
	<h1>{day.format('MMMM YYYY')}</h1>
</div>

<div class="button big">
	<Button value={'Add Event'} />
</div>

<div class="datebar">
	<div class="button">
		<Button value={'Previous'} on:click={() => (day = day.subtract(1, 'month'))} />
	</div>
	<div class="button">
		<Button value={'Today'} on:click={() => (day = dayjs())} />
	</div>
	<div class="button">
		<Button value={'Next'} on:click={() => (day = day.add(1, 'month'))} />
	</div>
</div>
<div class="calendar">
	{#each daysInMonth as day}
		<button class="day">
			{day.format('D')}
		</button>
	{/each}
</div>

<style lang="scss">
	.datebar {
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
</style>
