<script lang="ts">
	import Color from '@tiptap/extension-color';
	import type { ComponentType } from 'svelte';
	import MehIcon from '~icons/bx/meh';
	import SadIcon from '~icons/bx/sad';
	import SmileIcon from '~icons/bx/smile';

	let selected = 0;
	export let name = "smileScale";

	let smiles = [
		{
			color: "#e38987",
			icon: SadIcon as ComponentType
		},
		{
			color: "#e69a67",
			icon: SadIcon as ComponentType
		},
		{
			color: "#cfb44f",
			icon: MehIcon as ComponentType 
		},
		{
			color: "#9ecf56",
			icon: SmileIcon as ComponentType 
		},
		{
			color: "#36e789",
			icon: SmileIcon as ComponentType 
		}
	]

</script>

<input name={name} hidden bind:value={selected} />
<div class="wrap">
	<div class="smileScale">
		{#each smiles as smile, i}
			<button
				style="--color: {smile.color}"
				class:active={selected == i + 1}
				type="button"
				on:click={() => (selected = i + 1)}
			>
				<svelte:component this={smile.icon} color="var(--color)" height="100%" width="100%" />
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.smileScale {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		button {
			all: unset;
			cursor: pointer;
			flex-grow: 1;
			height: 3rem;
			width: 3rem;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 3rem;
			opacity: 0.4;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

			&:hover {
				opacity: 1;
			}
		}

		.active {
			opacity: 1;
			position: relative;
			z-index: 2;

			&::after {
				content: '';
				position: absolute;
				height: 100%;
				width: 100%;
				top: 0px;
				left: 0px;
				background: var(--color);
				border-radius: 50%;
				z-index: -1;
				opacity: 0.25;
			}
		}
	}
</style>
