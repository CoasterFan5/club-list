<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import PaletteIcon from '~icons/bx/palette';
	import { clickOutside } from '$lib/actions/clickOutside';

	export let name: string;
	export let color: string;
	export let label = 'Customize color';
	export let showAdvancedColorPicker = true;

	let open = false;

	let hiddenColorPicker: HTMLInputElement;

	type Swatches = string[];

	export let swatches: Swatches = [
		'#e63946',
		'#e6892c',
		'#e3cc36',
		'#3cc75c',
		'#3c96c7',
		'#b03cc7',
		'#b5b5b5'
	];
</script>

<div class="wrap">
	<button
		style="--pickedColor: {color}"
		class="innerButton"
		type="button"
		on:click={() => {
			open = !open;
		}}
	>
		<div class="colorPreview"/>
		{label}
	</button>

	{#if open}
		<div
			class="swatchPicker"
			use:clickOutside={() => {
				open = false;
			}}
			transition:fly={{
				duration: 250,
				delay: 0,
				easing: cubicInOut,
				x: 0,
				y: -10
			}}
		>
			<div class="swatchPickerInner">
				{#each swatches as swatch}
					<button
						style="--swatchColor: {swatch}"
						class="swatch"
						type="button"
						on:click={() => {
							color = swatch;
							open = false;
						}}
					/>
				{/each}
				{#if showAdvancedColorPicker}
					<button
						style="--swatchColor: #e6e6e6"
						class="swatch"
						type="button"
						on:click={() => {
							hiddenColorPicker.click();
						}}
					>
						<PaletteIcon height="90%" width="90%" />
					</button>
					<input
						bind:this={hiddenColorPicker}
						style="position: fixed; z-index: -1;"
						type="color"
						bind:value={color}
					/>
				{/if}
			</div>
		</div>
	{/if}
</div>

<input {name} hidden type="color" bind:value={color} />

<style lang="scss">
	.wrap {
		position: relative;
		width: 100%;
		background: var(--background);
		color: #0e0e0e;

		.innerButton {
			all: unset;
			border-radius: 3px;
			font-size: 1.2rem;
			padding: 10px;
			outline: 0px;
			box-sizing: border-box;
			border: 1px solid gray;
			display: flex;
			flex-direction: row;
			align-items: center;
			cursor: pointer;
			width: 100%;
			&:focus {
				border: 1px solid var(--accent);
				transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}

			&::placeholder {
				position: fixed;
				display: none;
				color: transparent;
			}
		}
	}

	.colorPreview {
		height: 1.2rem;
		aspect-ratio: 1/1;
		background: var(--pickedColor);
		border-radius: 0.25rem;
		margin-right: 0.25rem;
	}

	.swatchPicker {
		position: absolute;
		width: 100%;

		left: 0px;
		padding-top: 0.25rem;

		z-index: 100;
		display: flex;
		justify-content: center;
	}

	.swatchPickerInner {
		background: var(--bgMid);
		box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
		gap: 10px;
		padding: 1rem;
		flex-wrap: wrap;

		.swatch {
			all: unset;
			cursor: pointer;
			flex-grow: 1;
			aspect-ratio: 1/1;
			background: var(--swatchColor);
			border-radius: 0.25rem;
			min-width: 2rem;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

			&:hover {
				box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
			}
		}
	}
</style>
