<script lang="ts">
	import { onMount } from 'svelte';

	// Options
	export let name = 'Input';
	export let label = 'Input';
	export let type: 'password' | 'email' | undefined = undefined;
	export let required = false;
	export let autocomplete: HTMLInputElement['autocomplete'] | null = null;
	export let pattern: string = '.*';

	export let bg = 'var(--bg)';

	/**
	 * Value of the input
	 */
	export let value: string = '';

	let enableJS = false;
	let active = true;
	let ready = false;

	onMount(() => {
		enableJS = true;
		active = !!value;
		ready = true;
	});

	let focusHandle = () => (active = true);
	let blurHandle = () => (active = !!value);
</script>

<label style="--background: {bg}">
	<span class:active class:inactive={!active} class:ready>{label}</span>
	<input
		{name}
		class:doPlaceholder={!enableJS}
		{autocomplete}
		{pattern}
		{required}
		{...{ type }}
		placeholder={label}
		bind:value
		on:focus={focusHandle}
		on:blur={blurHandle}
	/>
</label>

<style lang="scss">
	label {
		display: block;
		position: relative;
		height: 100%;
		cursor: text;
		color: gray;
		font-size: 1.2rem;
	}

	.active {
		display: none;
		height: 20px;
		position: absolute;
		top: -10px;
		left: 10px;
		align-items: center;
		justify-content: center;
		background: var(--background);
		padding: 0px 5px;
		font-size: 0.8rem;
		color: #0e0e0e;
	}

	.inactive {
		display: none;
		height: 100%;
		position: absolute;
		align-items: center;
		justify-content: center;
		padding: 0px 5px;
		left: 6px;
		box-sizing: border-box;
		color: gray;
	}

	input {
		all: unset;
		border: 0px;
		outline: 0px;
		box-sizing: border-box;
		padding: 10px;
		border-radius: 3px;
		font-size: 1.2rem;
		width: 100%;
		background: transparent;
		background: var(--background);
		text-align: left;
		border: 1px solid gray;
		color: #0e0e0e;

		&:focus {
			border: 1px solid var(--accent);
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
		}

		&::placeholder {
			position: fixed;
			display: none;
			color: transparent;
		}
	}

	.doPlaceholder::placeholder {
		color: gray;
	}

	.ready {
		display: flex;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
</style>
