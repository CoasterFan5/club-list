<script lang="ts">
	export let text: string;
	export let pos = {
		x: 0,
		y: 0
	};
	export let opacity = 0;

	let toolTipHeight: number;
	let toolTipWidth: number;
</script>

<div
	style="left: {pos.x - toolTipWidth / 2}px; top: {pos.y - toolTipHeight / 4}px; opacity: {opacity}"
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
		z-index: 250;
	}
	.tooltip {
		border-radius: 3px;
		padding: 5px 10px;

		background: var(--bgPure);
	}
</style>
