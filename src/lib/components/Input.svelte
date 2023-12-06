<script lang="ts">
	import { onMount } from 'svelte';

	export let name = 'Input';
	export let label = 'Input';
	export let bgColor = 'var(--bg)';
	export let type: 'password' | 'email' | undefined = undefined;
	export let required = false;
	export let autocomplete: HTMLInputElement['autocomplete'] | null = null;
	let moveText = false;

	let input: HTMLInputElement;
	export let value: string = '';

	let startFocus = () => input.focus();

	let selectInput = () => {
		active = true;
		moveText = true;
	};
	let deselectText = () => {
		active = false;
		if (value.length > 0) {
			moveText = true;
		} else {
			moveText = false;
		}
	};

	onMount(() => {
		value = value;
		if (value) {
			active = false;
			moveText = true;
		} else {
			active = false;
			moveText = false;
		}
	});
	let active = false;
</script>

<button
	style="--bgColor: {bgColor}"
	class="wrap"
	class:active
	tabindex="-1"
	type="button"
	on:click={startFocus}
>
	<input
		bind:this={input}
		{name}
		{autocomplete}
		{required}
		on:focus={selectInput}
		on:blur={deselectText}
		bind:value
		{...{ type /* asserting string input since we know the type is always a password */ }}
	/>
	<div class="labelBase" class:label1={!moveText} class:labelMoved={moveText}>
		{label}
	</div>
</button>

<style lang="scss">
	.wrap {
		all: unset;
		position: relative;
		width: 100%;
		font-family: 'Lexend Variable', sans-serif;
		border-radius: 3px;
		border: 1px solid gray;
		cursor: text;
		background: var(--bgColor);
	}

	input {
		border: 0px;
		outline: 0px;
		box-sizing: border-box;
		padding: 10px;
		font-size: 1.2rem;
		width: 100%;
		font-family: 'Lexend Variable', sans-serif;
		background: transparent;
	}

	.labelBase {
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
	}

	.label1 {
		font-size: 1.12rem;
		font-weight: 400;
		box-sizing: border-box;
		padding: 10px;
		top: 0px;
		left: 0px;
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: start;
		background: transparent;
		color: #333;
	}

	.labelMoved {
		font-size: 0.8rem;
		position: absolute;
		top: -10px;
		left: 10px;
		background: var(--bgColor);
		padding: 0px 5px;
		color: black;
	}

	.active {
		border: 1px solid var(--accent);
	}
</style>
