<script lang="ts">
	import { fade } from 'svelte/transition';

	export let text: string;
	export let pos = {
		x: 0,
		y: 0
	};
	export let opacity = 0;

	$: console.log(opacity)

	let toolTipHeight: number;
	let toolTipWidth: number;
	$: console.log(toolTipHeight);
	console.log(text);
</script>

<div
	style="left: {pos.x - toolTipWidth / 2}px; top: {pos.y - 5 - toolTipHeight / 2}px; opacity: {opacity}"
	class="wrap"
>
	{#if text}
		<div class="tooltip" bind:clientHeight={toolTipHeight} bind:clientWidth={toolTipWidth}>
			{text}
		</div>
	{/if}
</div>

<style>
	.wrap {
		position: fixed;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
		border-radius: 3px;
		
	}
	.tooltip {
		z-index: 12;
		border-radius: 3px;
		padding: 5px 10px;
		
		background: var(--bgPure);
		
	}
	
</style>
