<script lang="ts">
	export let text: string;
	export let pos = {
		x: 0,
		y: 0
	};
	export let opacity = 0;
	export let id: string;

	let toolTipHeight: number;
	let toolTipWidth: number;
</script>

<div
	{id}
	style="left: {pos.x - toolTipWidth / 2}px; top: {pos.y - toolTipHeight / 4}px; opacity: {opacity}"
	class="wrap"
	aria-hidden="true"
	role="tooltip"
>
	<div class="tooltip" bind:clientHeight={toolTipHeight} bind:clientWidth={toolTipWidth}>
		{text}
	</div>
</div>

<style lang="scss">
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
